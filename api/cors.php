<?php
// api/cors.php
// Centralized CORS handling. Include this at the top of API endpoints.
// Reads allowed origins from env var ALLOWED_ORIGINS (comma-separated) or
// VITE_API_BASE_URL. Falls back to localhost for development.

// Determine allowed origins from environment variables only.
// Do NOT add localhost origins automatically; add them to ALLOWED_ORIGINS for local development.
$allowedEnv = getenv('ALLOWED_ORIGINS');
$viteApi = getenv('VITE_API_BASE_URL');
$allowed = [];
if ($allowedEnv !== false && trim($allowedEnv) !== '') {
    $parts = array_map('trim', explode(',', $allowedEnv));
    foreach ($parts as $p) {
        if ($p !== '') $allowed[] = $p;
    }
}
if ($viteApi !== false && trim($viteApi) !== '') {
    $allowed[] = rtrim($viteApi, '/');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // If no origin or not allowed, avoid setting a permissive wildcard in prod
    // Optionally, you can allow all origins in development by setting DEBUG=1
    if ((getenv('APP_ENV') === 'development') || getenv('DEBUG') === '1') {
        header('Access-Control-Allow-Origin: *');
    }
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
$allowCredentials = getenv('CORS_ALLOW_CREDENTIALS');
if ($allowCredentials === '1' || strtolower($allowCredentials) === 'true') {
    header('Access-Control-Allow-Credentials: true');
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Short-circuit OPTIONS requests
    http_response_code(200);
    exit(0);
}

?>