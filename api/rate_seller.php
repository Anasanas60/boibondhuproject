<?php
// api/rate_seller.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Update required fields to match your table structure
$required_fields = ['seller_id', 'buyer_id', 'listing_id', 'rating'];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

$seller_id = intval($data['seller_id']);
$buyer_id = intval($data['buyer_id']);
$listing_id = intval($data['listing_id']);
$rating = intval($data['rating']);
$review = isset($data['review']) ? trim($data['review']) : null;
$comment = isset($data['comment']) ? trim($data['comment']) : null;

// Validate IDs
if ($seller_id <= 0 || $buyer_id <= 0 || $listing_id <= 0) {
    echo json_encode(['error' => 'Invalid user or listing IDs.']);
    exit;
}

// Prevent self-rating
if ($seller_id === $buyer_id) {
    echo json_encode(['error' => 'Cannot rate yourself.']);
    exit;
}

// Validate rating
if ($rating < 1 || $rating > 5) {
    echo json_encode(['error' => 'Rating must be between 1 and 5.']);
    exit;
}

try {
    // Check if already rated
    $check_stmt = $conn->prepare("SELECT 1 FROM ratings WHERE seller_id = :seller AND buyer_id = :buyer AND listing_id = :listing LIMIT 1");
    $check_stmt->execute([':seller' => $seller_id, ':buyer' => $buyer_id, ':listing' => $listing_id]);
    $exists = $check_stmt->fetchColumn();
    if ($exists) {
        echo json_encode(['error' => 'You have already rated this seller for this listing.']);
        exit;
    }

    // Insert rating - match your table columns exactly
    $stmt = $conn->prepare("INSERT INTO ratings (seller_id, buyer_id, listing_id, rating, review, comment) VALUES (:seller, :buyer, :listing, :rating, :review, :comment) RETURNING rating_id");
    $stmt->execute([
        ':seller' => $seller_id,
        ':buyer' => $buyer_id,
        ':listing' => $listing_id,
        ':rating' => $rating,
        ':review' => $review,
        ':comment' => $comment,
    ]);
    
    $ratingId = $stmt->fetchColumn();
    echo json_encode(['success' => 'Rating submitted successfully.', 'rating_id' => $ratingId]);
} catch (PDOException $e) {
    error_log('[rate_seller] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to submit rating']);
}

?>