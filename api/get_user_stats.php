<?php
// api/get_user_stats.php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

if (!isset($_GET['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing user_id parameter']);
    exit;
}

$user_id = intval($_GET['user_id']);

// Get total listings count
$queryListings = "SELECT COUNT(*) as total_listings FROM Listings WHERE seller_id = ?";
$stmtListings = $conn->prepare($queryListings);
$stmtListings->bind_param("i", $user_id);
$stmtListings->execute();
$resultListings = $stmtListings->get_result();
$total_listings = 0;
if ($row = $resultListings->fetch_assoc()) {
    $total_listings = intval($row['total_listings']);
}
$stmtListings->close();

// Get total wishlist count
$queryWishlist = "SELECT COUNT(*) as total_wishlist FROM wishlists WHERE user_id = ?";
$stmtWishlist = $conn->prepare($queryWishlist);
$stmtWishlist->bind_param("i", $user_id);
$stmtWishlist->execute();
$resultWishlist = $stmtWishlist->get_result();
$total_wishlist = 0;
if ($row = $resultWishlist->fetch_assoc()) {
    $total_wishlist = intval($row['total_wishlist']);
}
$stmtWishlist->close();

// Get total reviews count (ratings where user is seller or buyer)
$queryReviews = "SELECT COUNT(*) as total_reviews FROM ratings WHERE seller_id = ? OR buyer_id = ?";
$stmtReviews = $conn->prepare($queryReviews);
$stmtReviews->bind_param("ii", $user_id, $user_id);
$stmtReviews->execute();
$resultReviews = $stmtReviews->get_result();
$total_reviews = 0;
if ($row = $resultReviews->fetch_assoc()) {
    $total_reviews = intval($row['total_reviews']);
}
$stmtReviews->close();

$conn->close();

echo json_encode([
    'success' => true,
    'stats' => [
        'listings' => $total_listings,
        'wishlist' => $total_wishlist,
        'reviews' => $total_reviews
    ],
    'profilePicUrl' => null // Placeholder, update if profile pic URL is stored
]);
?>
