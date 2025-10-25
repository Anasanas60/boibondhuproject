<?php
// Simple router - handle everything
error_log("SIMPLE ROUTER: REQUEST_URI = " . ($_SERVER['REQUEST_URI'] ?? '/'));

require_once 'cors.php';
require_once 'db_connect.php';

$path = $_SERVER['REQUEST_URI'] ?? '/';
error_log("Processing path: " . $path);

// Simple routing
if (strpos($path, 'listings') !== false) {
    error_log("Routing to listings.php");
    require 'listings.php';
} elseif (strpos($path, 'login') !== false) {
    error_log("Routing to login.php");
    require 'login.php';
} else {
    error_log("No route matched, showing debug");
    echo json_encode([
        'status' => 'Router working', 
        'path' => $path,
        'try' => '/index.php/listings'
    ]);
}
?>