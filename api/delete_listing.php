<?php
// api/delete_listing.php

// Add CORS headers at the VERY TOP
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

require_once 'db_connect.php';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Use POST.']);
    exit;
}

// Get JSON data from request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!isset($data['listing_id']) || !isset($data['seller_id'])) {
    echo json_encode(['error' => 'Missing listing_id or seller_id.']);
    exit;
}

$listing_id = intval($data['listing_id']);
$seller_id = intval($data['seller_id']);

// Validate IDs
if ($listing_id <= 0 || $seller_id <= 0) {
    echo json_encode(['error' => 'Invalid listing_id or seller_id.']);
    exit;
}

// Prepare and execute DELETE statement
// Only delete if both listing_id and seller_id match
$stmt = $conn->prepare("DELETE FROM Listings WHERE listing_id = ? AND seller_id = ?");
$stmt->bind_param("ii", $listing_id, $seller_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows === 1) {
        echo json_encode(['success' => 'Listing deleted successfully.']);
    } elseif ($stmt->affected_rows === 0) {
        echo json_encode(['error' => 'Listing not found or you do not have permission to delete it.']);
    } else {
        echo json_encode(['error' => 'Unexpected error occurred.']);
    }
} else {
    echo json_encode(['error' => 'Failed to delete listing: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
