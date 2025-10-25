<?php
// api/get_user_reviews.php

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
    $query = "SELECT rating_id, seller_id, buyer_id, rating, review, created_at
              FROM ratings
              WHERE seller_id = :uid OR buyer_id = :uid";
    $stmt = $conn->prepare($query);
    $stmt->execute([':uid' => $user_id]);
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'reviews' => $reviews]);
} catch (PDOException $e) {
    error_log('[get_user_reviews] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch reviews']);
}

?>
