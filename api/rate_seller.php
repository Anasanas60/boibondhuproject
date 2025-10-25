<?php
// api/rate_seller.php

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

// Check if already rated
$check_stmt = $conn->prepare("SELECT rating_id FROM ratings WHERE seller_id = ? AND buyer_id = ? AND listing_id = ?");
$check_stmt->bind_param("iii", $seller_id, $buyer_id, $listing_id);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    echo json_encode(['error' => 'You have already rated this seller for this listing.']);
    $check_stmt->close();
    exit;
}
$check_stmt->close();

// Insert rating - match your table columns exactly
$stmt = $conn->prepare("INSERT INTO ratings (seller_id, buyer_id, listing_id, rating, review, comment) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iiiiss", $seller_id, $buyer_id, $listing_id, $rating, $review, $comment);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Rating submitted successfully.', 'rating_id' => $stmt->insert_id]);
} else {
    echo json_encode(['error' => 'Failed to submit rating: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>