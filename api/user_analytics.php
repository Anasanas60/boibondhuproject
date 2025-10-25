<?php
// api/user_analytics.php

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
    $user_stmt = $conn->prepare("SELECT user_id, name, email FROM users WHERE user_id = ?");
    $user_stmt->bind_param("i", $user_id);
    $user_stmt->execute();
    $user_result = $user_stmt->get_result();
    $user = $user_result->fetch_assoc();

    if (!$user) {
        echo json_encode(['error' => 'User not found']);
        exit;
    }

    // Count books listed by user
    $books_stmt = $conn->prepare("SELECT COUNT(*) as books_listed FROM Listings WHERE seller_id = ?");
    $books_stmt->bind_param("i", $user_id);
    $books_stmt->execute();
    $books_result = $books_stmt->get_result();
    $books_count = $books_result->fetch_assoc()['books_listed'];

    // Count wishlist items
    $wishlist_stmt = $conn->prepare("SELECT COUNT(*) as wishlist_count FROM Wishlist WHERE user_id = ?");
    $wishlist_stmt->bind_param("i", $user_id);
    $wishlist_stmt->execute();
    $wishlist_result = $wishlist_stmt->get_result();
    $wishlist_count = $wishlist_result->fetch_assoc()['wishlist_count'];

    // Mock achievements and rating
    $achievements = [
        ['title' => 'Eco-Friendly Seller', 'icon' => 'leaf', 'hint' => 'Awarded for donating a book to a campus charity.'],
        ['title' => 'Fast Seller', 'icon' => 'zap', 'hint' => 'Awarded for selling 5+ books in a month.'],
    ];

    echo json_encode([
        'user_id' => $user['user_id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'books_listed' => intval($books_count),
        'wishlist_count' => intval($wishlist_count),
        'avg_rating' => 4.5, // Mock data
        'achievements' => $achievements,
    ]);

    // Close statements
    $user_stmt->close();
    $books_stmt->close();
    $wishlist_stmt->close();

} catch (Exception $e) {
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

$conn->close();
?>