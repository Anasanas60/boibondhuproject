<?php
// api/get_user_stats.php

// Enable error reporting for debugging in development only
if ((getenv('APP_ENV') ?? '') === 'development') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

require_once 'cors.php';
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

try {
    // Get total listings count
    $queryListings = "SELECT COUNT(*) as total_listings FROM listings WHERE seller_id = :uid";
    $stmtListings = $conn->prepare($queryListings);
    $stmtListings->execute([':uid' => $user_id]);
    $total_listings = (int)$stmtListings->fetchColumn();

    // Get total wishlist count
    $queryWishlist = "SELECT COUNT(*) as total_wishlist FROM wishlists WHERE user_id = :uid";
    $stmtWishlist = $conn->prepare($queryWishlist);
    $stmtWishlist->execute([':uid' => $user_id]);
    $total_wishlist = (int)$stmtWishlist->fetchColumn();

    // Get total reviews count (ratings where user is seller or buyer)
    $queryReviews = "SELECT COUNT(*) as total_reviews FROM ratings WHERE seller_id = :uid OR buyer_id = :uid";
    $stmtReviews = $conn->prepare($queryReviews);
    $stmtReviews->execute([':uid' => $user_id]);
    $total_reviews = (int)$stmtReviews->fetchColumn();

    echo json_encode([
        'success' => true,
        'stats' => [
            'listings' => $total_listings,
            'wishlist' => $total_wishlist,
            'reviews' => $total_reviews
        ],
        'profilePicUrl' => null // Placeholder
    ]);
} catch (PDOException $e) {
    error_log('[get_user_stats] DB error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to fetch stats']);
}

?>
