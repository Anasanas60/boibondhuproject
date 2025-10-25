<?php
// api/get_wishlist.php

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

$query = 'SELECT w.wishlist_id, w.listing_id, l.title, l.author, l.course_code, l.edition, l.price, l.condition, l.description 
          FROM wishlists w 
          JOIN listings l ON w.listing_id = l.listing_id 
          WHERE w.user_id = :user_id';

$stmt = $conn->prepare($query);
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
$stmt->execute();

$wishlist = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $wishlist[] = $row;
}

echo json_encode(['wishlist' => $wishlist]);
?>
