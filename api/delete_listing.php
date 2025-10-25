<?php
// api/delete_listing.php

require_once 'cors.php';
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

try {
    $stmt = $conn->prepare("DELETE FROM listings WHERE listing_id = :lid AND seller_id = :sid");
    $stmt->execute([':lid' => $listing_id, ':sid' => $seller_id]);
    $affected = $stmt->rowCount();
    if ($affected === 1) {
        echo json_encode(['success' => 'Listing deleted successfully.']);
    } elseif ($affected === 0) {
        echo json_encode(['error' => 'Listing not found or you do not have permission to delete it.']);
    } else {
        echo json_encode(['error' => 'Unexpected error occurred.']);
    }
} catch (PDOException $e) {
    error_log('[delete_listing] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to delete listing']);
}

?>
