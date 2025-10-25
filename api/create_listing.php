<?php
// api/create_listing.php

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$required_fields = ['seller_id', 'title', 'author', 'course_code', 'edition', 'price', 'condition', 'description'];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

$seller_id = intval($data['seller_id']);
$title = trim($data['title']);
$author = trim($data['author']);
$course_code = trim($data['course_code']);
$edition = intval($data['edition']);
$price = floatval($data['price']);
$condition = trim($data['condition']);
$description = trim($data['description']);

// Insert new listing
$stmt = $conn->prepare("INSERT INTO Listings (seller_id, title, author, course_code, edition, price, `condition`, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");$stmt->bind_param("isssidss", $seller_id, $title, $author, $course_code, $edition, $price, $condition, $description);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Listing created successfully.', 'listing_id' => $stmt->insert_id]);
} else {
    echo json_encode(['error' => 'Failed to create listing: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
