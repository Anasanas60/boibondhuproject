<?php
// api/create_listing.php

require_once 'cors.php';
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

try {
    $sql = "INSERT INTO listings (seller_id, title, author, course_code, edition, price, \"condition\", description) VALUES (:seller_id, :title, :author, :course_code, :edition, :price, :condition, :description) RETURNING listing_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':seller_id' => $seller_id,
        ':title' => $title,
        ':author' => $author,
        ':course_code' => $course_code,
        ':edition' => $edition,
        ':price' => $price,
        ':condition' => $condition,
        ':description' => $description,
    ]);

    $listingId = $stmt->fetchColumn();
    echo json_encode(['success' => 'Listing created successfully.', 'listing_id' => $listingId]);
} catch (PDOException $e) {
    error_log('[create_listing] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to create listing']);
}

?>
