<?php
// api/update_listing.php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['listing_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing listing_id']);
    exit;
}

$listing_id = intval($input['listing_id']);
$title = $input['title'] ?? '';
$author = $input['author'] ?? '';
$course_code = $input['course_code'] ?? '';
$edition = $input['edition'] ?? '';
$price = floatval($input['price'] ?? 0);
$condition = $input['condition'] ?? '';
$description = $input['description'] ?? '';
$status = $input['status'] ?? 'available';

// Validate required fields
if (empty($title) || empty($author) || empty($course_code) || $price <= 0 || empty($condition)) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$query = 'UPDATE listings SET
    title = :title,
    author = :author,
    course_code = :course_code,
    edition = :edition,
    price = :price,
    "condition" = :condition,
    description = :description,
    status = :status,
    updated_at = CURRENT_TIMESTAMP
    WHERE listing_id = :listing_id';

$stmt = $conn->prepare($query);
$stmt->bindValue(':title', $title, PDO::PARAM_STR);
$stmt->bindValue(':author', $author, PDO::PARAM_STR);
$stmt->bindValue(':course_code', $course_code, PDO::PARAM_STR);
$stmt->bindValue(':edition', $edition, PDO::PARAM_STR);
$stmt->bindValue(':price', $price, PDO::PARAM_STR);
$stmt->bindValue(':condition', $condition, PDO::PARAM_STR);
$stmt->bindValue(':description', $description, PDO::PARAM_STR);
$stmt->bindValue(':status', $status, PDO::PARAM_STR);
$stmt->bindValue(':listing_id', $listing_id, PDO::PARAM_INT);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update listing']);
}
?>
