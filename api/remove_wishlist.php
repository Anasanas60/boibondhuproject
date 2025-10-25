<?php
// api/remove_wishlist.php

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
    $stmt = $conn->prepare("DELETE FROM wishlists WHERE user_id = :uid AND listing_id = :lid");
    $stmt->execute([':uid' => $user_id, ':lid' => $listing_id]);
    $affected = $stmt->rowCount();
    if ($affected > 0) {
        echo json_encode(['success' => 'Removed from wishlist']);
    } else {
        echo json_encode(['message' => 'Item not found in wishlist']);
    }
} catch (PDOException $e) {
    error_log('[remove_wishlist] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to remove from wishlist']);
}

?>
