<?php
// api/get_wishlist.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Invalid request method. Use GET.']);
    exit;
}

if (!isset($_GET['user_id'])) {
    echo json_encode(['error' => 'Missing user_id parameter']);
    exit;
}

$user_id = intval($_GET['user_id']);

try {
    $query = "SELECT w.wishlist_id, w.listing_id, l.title, l.author, l.course_code, l.edition, l.price, l.condition, l.description
              FROM wishlists w
              JOIN listings l ON w.listing_id = l.listing_id
              WHERE w.user_id = :uid";
    $stmt = $conn->prepare($query);
    $stmt->execute([':uid' => $user_id]);
    $wishlist = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['wishlist' => $wishlist]);
} catch (PDOException $e) {
    error_log('[get_wishlist] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch wishlist']);
}

?>
