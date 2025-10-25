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

$query = "UPDATE listings SET
    title = ?,
    author = ?,
    course_code = ?,
    edition = ?,
    price = ?,
    `condition` = ?,
    description = ?,
    status = ?,
    updated_at = NOW()
    WHERE listing_id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("ssssdsssi", $title, $author, $course_code, $edition, $price, $condition, $description, $status, $listing_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to update listing']);
}

$stmt->close();
$conn->close();
?>
