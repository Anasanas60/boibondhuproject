<?php
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

// Simple routing based on URL
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Route requests to appropriate PHP files
if (strpos($path, '/login') !== false && $method === 'POST') {
    require 'login.php';
} elseif (strpos($path, '/register') !== false && $method === 'POST') {
    require 'register.php';
} elseif (strpos($path, '/listings') !== false) {
    require 'listings.php';
} elseif (strpos($path, '/search') !== false) {
    require 'search_listings.php';
} elseif (strpos($path, '/wishlist') !== false) {
    if ($method === 'GET') {
        require 'get_wishlist.php';
    } elseif ($method === 'POST') {
        require 'add_wishlist.php';
    } elseif ($method === 'DELETE') {
        require 'remove_wishlist.php';
    }
} elseif (strpos($path, '/message') !== false) {
    require 'send_message.php';
} elseif (strpos($path, '/conversations') !== false) {
    require 'get_conversations.php';
} elseif (strpos($path, '/profile') !== false) {
    require 'upload_profile_picture.php';
} elseif (strpos($path, '/analytics') !== false) {
    require 'user_analytics.php';
} elseif (strpos($path, '/reviews') !== false) {
    require 'get_user_reviews.php';
} elseif (strpos($path, '/rate') !== false) {
    require 'rate_seller.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found', 'path' => $path, 'method' => $method]);
}
?>
