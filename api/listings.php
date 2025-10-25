<?php
// api/listings.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Invalid request method. Use GET.']);
    exit;
}

// Fetch all listings with seller information
try {
    $query = "SELECT l.listing_id, l.seller_id, l.title, l.author, l.course_code, l.edition, l.price, l.\"condition\", l.description, u.name as seller_name FROM listings l JOIN users u ON l.seller_id = u.user_id";
    $stmt = $conn->query($query);
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'listings' => $listings]);
} catch (PDOException $e) {
    error_log('[listings] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch listings']);
}

?>
