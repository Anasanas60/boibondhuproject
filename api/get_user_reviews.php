<?php
// api/get_user_reviews.php

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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Invalid request method. Use GET.']);
    exit;
}

if (!isset($_GET['user_id'])) {
    echo json_encode(['error' => 'Missing user_id parameter']);
    exit;
}

$user_id = intval($_GET['user_id']);

$query = "SELECT rating_id, seller_id, buyer_id, rating, review, created_at 
          FROM ratings 
          WHERE seller_id = :user_id1 OR buyer_id = :user_id2";

$stmt = $conn->prepare($query);
$stmt->bindValue(':user_id1', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':user_id2', $user_id, PDO::PARAM_INT);
$stmt->execute();

$reviews = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $reviews[] = $row;
}

echo json_encode(['success' => true, 'reviews' => $reviews]);
?>
