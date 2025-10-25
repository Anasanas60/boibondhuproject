<?php
// api/get_user_analytics.php

require_once 'cors.php';
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

try {
    // Fetch user info
    $user_stmt = $conn->prepare("SELECT user_id, name, email FROM users WHERE user_id = :uid");
    $user_stmt->execute([':uid' => $user_id]);
    $user = $user_stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    // Count books listed by user
    $books_stmt = $conn->prepare("SELECT COUNT(*) as books_listed FROM listings WHERE seller_id = :uid");
    $books_stmt->execute([':uid' => $user_id]);
    $books_count = (int)$books_stmt->fetchColumn();

    // Count wishlist items
    $wishlist_stmt = $conn->prepare("SELECT COUNT(*) as wishlist_count FROM wishlists WHERE user_id = :uid");
    $wishlist_stmt->execute([':uid' => $user_id]);
    $wishlist_count = (int)$wishlist_stmt->fetchColumn();

    // Mock achievements and rating (since ratings table may be missing)
    $achievements = [
        ['title' => 'Eco-Friendly Seller', 'icon' => 'leaf', 'hint' => 'Awarded for donating a book to a campus charity.'],
        ['title' => 'Fast Seller', 'icon' => 'zap', 'hint' => 'Awarded for selling 5+ books in a month.'],
    ];

    echo json_encode([
        'user_id' => $user['user_id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'books_listed' => $books_count,
        'wishlist_count' => $wishlist_count,
        'avg_rating' => 4.5,
        'achievements' => $achievements,
    ]);

} catch (PDOException $e) {
    error_log('[get_user_analytics] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Server error']);
}

?>