<?php
// api/get_user_listings.php

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
    $query = "SELECT listing_id, seller_id, title, author, course_code, edition, price, \"condition\", description
              FROM listings
              WHERE seller_id = :seller_id";
    $stmt = $conn->prepare($query);
    $stmt->execute([':seller_id' => $user_id]);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['listings' => $listings]);
} catch (PDOException $e) {
    error_log('[get_user_listings] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch listings']);
}

?>
