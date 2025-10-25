<?php
// api/index.php - Main router
require_once 'db_connect.php';

// Set CORS headers
header("Access-Control-Allow-Origin: https://bolbondhuproject.vercel.app");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Simple routing based on URL
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Route requests to appropriate PHP files
if (strpos($path, '/api/login') !== false && $method === 'POST') {
    require 'login.php';
} elseif (strpos($path, '/api/register') !== false && $method === 'POST') {
    require 'register.php';
} elseif (strpos($path, '/api/listings') !== false) {
    require 'listings.php';
} elseif (strpos($path, '/api/search') !== false) {
    require 'search_listings.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
