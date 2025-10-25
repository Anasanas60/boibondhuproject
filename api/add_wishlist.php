<?php
// api/add_wishlist.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['user_id']) || !isset($data['listing_id'])) {
    echo json_encode(['error' => 'Missing user_id or listing_id']);
    exit;
}

$user_id = intval($data['user_id']);
$listing_id = intval($data['listing_id']);

try {
    // Check if already in wishlist
    $stmt = $conn->prepare("SELECT 1 FROM wishlists WHERE user_id = :uid AND listing_id = :lid LIMIT 1");
    $stmt->execute([':uid' => $user_id, ':lid' => $listing_id]);
    $exists = $stmt->fetchColumn();
    if ($exists) {
        echo json_encode(['message' => 'Listing already in wishlist']);
        exit;
    }

    // Insert into wishlist
    $stmt = $conn->prepare("INSERT INTO wishlists (user_id, listing_id) VALUES (:uid, :lid)");
    $stmt->execute([':uid' => $user_id, ':lid' => $listing_id]);
    echo json_encode(['success' => 'Added to wishlist']);
} catch (PDOException $e) {
    error_log('[add_wishlist] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to add to wishlist']);
}

?>
