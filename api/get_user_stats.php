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
$queryListings = 'SELECT COUNT(*) as total_listings FROM listings WHERE seller_id = :user_id';
$stmtListings = $conn->prepare($queryListings);
$stmtListings->bindValue(':user_id', $user_id, PDO::PARAM_INT);
$stmtListings->execute();
$total_listings = 0;
if ($row = $stmtListings->fetch(PDO::FETCH_ASSOC)) {
    $total_listings = intval($row['total_listings']);
}

// Get total wishlist count
$queryWishlist = "SELECT COUNT(*) as total_wishlist FROM wishlists WHERE user_id = :user_id";
$stmtWishlist = $conn->prepare($queryWishlist);
$stmtWishlist->bindValue(':user_id', $user_id, PDO::PARAM_INT);
$stmtWishlist->execute();
$total_wishlist = 0;
if ($row = $stmtWishlist->fetch(PDO::FETCH_ASSOC)) {
    $total_wishlist = intval($row['total_wishlist']);
}

// Get total reviews count (ratings where user is seller or buyer)
$queryReviews = "SELECT COUNT(*) as total_reviews FROM ratings WHERE seller_id = :user_id1 OR buyer_id = :user_id2";
$stmtReviews = $conn->prepare($queryReviews);
$stmtReviews->bindValue(':user_id1', $user_id, PDO::PARAM_INT);
$stmtReviews->bindValue(':user_id2', $user_id, PDO::PARAM_INT);
$stmtReviews->execute();
$total_reviews = 0;
if ($row = $stmtReviews->fetch(PDO::FETCH_ASSOC)) {
    $total_reviews = intval($row['total_reviews']);
}

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
