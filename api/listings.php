<?php
// api/listings.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Invalid request method. Use GET.']);
    exit;
}

// Fetch all listings with seller information
$query = 'SELECT l.listing_id, l.seller_id, l.title, l.author, l.course_code, l.edition, l.price, l.condition, l.description, u.name as seller_name FROM listings l JOIN users u ON l.seller_id = u.user_id';
$stmt = $conn->prepare($query);
$stmt->execute();

$listings = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $listings[] = $row;
}

echo json_encode(['success' => true, 'listings' => $listings]);
?>
