<?php
// api/update_listing.php

require_once 'cors.php';
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

try {
    $query = "UPDATE listings SET
        title = :title,
        author = :author,
        course_code = :course_code,
        edition = :edition,
        price = :price,
        \"condition\" = :condition,
        description = :description,
        status = :status,
    updated_at = CURRENT_TIMESTAMP
        WHERE listing_id = :listing_id";

    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':title' => $title,
        ':author' => $author,
        ':course_code' => $course_code,
        ':edition' => $edition,
        ':price' => $price,
        ':condition' => $condition,
        ':description' => $description,
        ':status' => $status,
        ':listing_id' => $listing_id,
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    error_log('[update_listing] DB error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to update listing']);
}

?>
