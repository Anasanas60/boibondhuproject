<?php
// api/add_wishlist.php

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

if (!isset($data['user_id']) || !isset($data['listing_id'])) {
    echo json_encode(['error' => 'Missing user_id or listing_id']);
    exit;
}

$user_id = intval($data['user_id']);
$listing_id = intval($data['listing_id']);

// Check if already in wishlist
$stmt = $conn->prepare("SELECT * FROM Wishlist WHERE user_id = ? AND listing_id = ?");
$stmt->bind_param("ii", $user_id, $listing_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['message' => 'Listing already in wishlist']);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Insert into wishlist
$stmt = $conn->prepare("INSERT INTO Wishlist (user_id, listing_id) VALUES (?, ?)");
$stmt->bind_param("ii", $user_id, $listing_id);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Added to wishlist']);
} else {
    echo json_encode(['error' => 'Failed to add to wishlist: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
