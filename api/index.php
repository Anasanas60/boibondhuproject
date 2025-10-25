<?php
// IMMEDIATE DEBUG - Add this at the VERY TOP
error_log("=== IMMEDIATE DEBUG START ===");
error_log("RAW REQUEST_URI: " . ($_SERVER['REQUEST_URI'] ?? 'NULL'));
error_log("RAW PATH_INFO: " . ($_SERVER['PATH_INFO'] ?? 'NULL'));
error_log("RAW SCRIPT_NAME: " . ($_SERVER['SCRIPT_NAME'] ?? 'NULL'));
error_log("FULL SERVER VARS: " . json_encode([
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? null,
    'PATH_INFO' => $_SERVER['PATH_INFO'] ?? null,
    'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? null,
    'PHP_SELF' => $_SERVER['PHP_SELF'] ?? null,
    'QUERY_STRING' => $_SERVER['QUERY_STRING'] ?? null
]));

// api/index.php - Main router

// Set proper MIME types for static files
$requested_file = $_SERVER['REQUEST_URI'];
$extension = pathinfo($requested_file, PATHINFO_EXTENSION);

$mime_types = [
    'js' => 'application/javascript',
    'svg' => 'image/svg+xml',
    'css' => 'text/css',
    'json' => 'application/json',
    'wasm' => 'application/wasm',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg'
];

if (isset($mime_types[$extension])) {
    $file_path = __DIR__ . $requested_file;
    if (file_exists($file_path)) {
        header('Content-Type: ' . $mime_types[$extension]);
        readfile($file_path);
        exit;
    }
}

// Centralized CORS handling
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';
// Helper: debug toggle (set DEBUG=1 in env for verbose output)
$debug = (getenv('DEBUG') !== false && in_array(strtolower(getenv('DEBUG')), ['1','true','yes'], true));

// Determine request path robustly (support Render-style routing that may include script name)
function get_request_path(): string {
    // Prefer PATH_INFO if available
    if (!empty($_SERVER['PATH_INFO'])) {
        return $_SERVER['PATH_INFO'];
    }

    // Some hosts provide REQUEST_URI with query string; strip query
    if (!empty($_SERVER['REQUEST_URI'])) {
        $uri = $_SERVER['REQUEST_URI'];
        $uri = parse_url($uri, PHP_URL_PATH) ?: $uri;
    } else {
        $uri = '/';
    }

    // If script name is present in the URI (e.g. /api/index.php/login), strip it
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    if ($scriptName && strpos($uri, $scriptName) === 0) {
        $uri = substr($uri, strlen($scriptName));
        if ($uri === '') $uri = '/';
    }

    // Some providers put the script's dirname (e.g. /api) into REQUEST_URI; strip that as well
    $scriptDir = rtrim(dirname($scriptName), '\\/');
    if ($scriptDir && $scriptDir !== '.' && strpos($uri, $scriptDir) === 0) {
        $uri = substr($uri, strlen($scriptDir));
        if ($uri === '') $uri = '/';
    }

    return $uri;
}

$request_uri = $_SERVER['REQUEST_URI'] ?? null;
$path = get_request_path();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Define endpoints and their handlers; map logical endpoint key => ['file' => ..., 'methods' => [...]]
$routes = [
    'login' => ['file' => 'login.php', 'methods' => ['POST']],
    'register' => ['file' => 'register.php', 'methods' => ['POST']],
    'listings' => ['file' => 'listings.php', 'methods' => ['GET','POST','PUT','DELETE']],
    'search' => ['file' => 'search_listings.php', 'methods' => ['GET']],
    'wishlist' => ['file' => null, 'methods' => ['GET','POST','DELETE']], // sub-handled
    'message' => ['file' => 'send_message.php', 'methods' => ['POST']],
    'conversations' => ['file' => 'get_conversations.php', 'methods' => ['GET']],
    'profile' => ['file' => 'upload_profile_picture.php', 'methods' => ['POST','PUT']],
    'analytics' => ['file' => 'user_analytics.php', 'methods' => ['GET']],
    'reviews' => ['file' => 'get_user_reviews.php', 'methods' => ['GET']],
    'get_unread_count' => ['file' => 'GET_UNREAD_COUNT.PHP', 'methods' => ['GET']],
    'rate' => ['file' => 'rate_seller.php', 'methods' => ['POST']]
];

// Helper to record checks for debug
$checks = [];

// Check function: look for endpoint anywhere in path segments OR as prefix
function path_contains(string $path, string $needle): bool {
    // normalize
    $p = strtolower($path);
    $n = strtolower('/' . ltrim($needle, '/'));
    if (strpos($p, $n) !== false) return true;
    // also check segments
    $segments = array_values(array_filter(explode('/', $p)));
    return in_array(ltrim($needle, '/'), $segments, true);
}

$handled = false;

// Evaluate wishlist specially because it maps to multiple files
foreach ($routes as $key => $meta) {
    $matched = path_contains($path, $key);
    $methodAllowed = in_array($method, $meta['methods'], true);
    $checks[$key] = ['matched' => $matched, 'methodAllowed' => $methodAllowed];

    if ($matched && $methodAllowed) {
        if ($key === 'wishlist') {
            if ($method === 'GET') {
                require 'get_wishlist.php';
                $handled = true; break;
            } elseif ($method === 'POST') {
                require 'add_wishlist.php';
                $handled = true; break;
            } elseif ($method === 'DELETE') {
                require 'remove_wishlist.php';
                $handled = true; break;
            }
        } else {
            if (!empty($meta['file'])) {
                require $meta['file'];
                $handled = true; break;
            }
        }
    }
}

// Fallback: match first path segment to route key (handles Render adding prefixes)
if (!$handled) {
    $segments = array_values(array_filter(explode('/', $path)));
    $first = $segments[0] ?? '';
    if ($first !== '') {
        foreach ($routes as $key => $meta) {
            if (strtolower($first) === strtolower($key) && in_array($method, $meta['methods'], true)) {
                if ($key === 'wishlist') {
                    if ($method === 'GET') { require 'get_wishlist.php'; $handled = true; break; }
                    if ($method === 'POST') { require 'add_wishlist.php'; $handled = true; break; }
                    if ($method === 'DELETE') { require 'remove_wishlist.php'; $handled = true; break; }
                } else {
                    require $meta['file']; $handled = true; break;
                }
            }
        }
    }
}

// If still not handled, produce debug output (and log) to help diagnose Render path
if (!$handled) {
    $debug_info = [
        'request_uri' => $request_uri,
        'path' => $path,
        'method' => $method,
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? null,
        'php_self' => $_SERVER['PHP_SELF'] ?? null,
        'path_info' => $_SERVER['PATH_INFO'] ?? null,
        'query_string' => $_SERVER['QUERY_STRING'] ?? null,
        'checked_routes' => $checks,
    ];

    // Log to server error log for Render inspection
    if ($debug) {
        error_log('[API ROUTER DEBUG] ' . json_encode($debug_info));
        echo json_encode(['error' => 'Endpoint not found (debug)', 'debug' => $debug_info]);
    } else {
        // Minimal info in production but still log
        error_log('[API ROUTER] Unmatched request: ' . $method . ' ' . ($request_uri ?? $path));
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
}
?>