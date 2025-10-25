<?php
// api/get_unread_count.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

// Get user_id from query parameters
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id <= 0) {
    echo json_encode(['error' => 'Invalid user ID']);
    exit;
}

try {
    // Count unread messages where the current user is the recipient
    $sql = "SELECT COUNT(*) as unread_count
            FROM messages m
            INNER JOIN message_threads mt ON m.thread_id = mt.id
            WHERE (mt.buyer_id = :uid OR mt.seller_id = :uid)
            AND m.sender_id != :uid
            AND m.is_read = 0";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':uid' => $user_id]);
    $unread_count = (int)$stmt->fetchColumn();

    echo json_encode([
        'success' => true,
        'unread_count' => $unread_count
    ]);
} catch (PDOException $e) {
    error_log('[GET_UNREAD_COUNT] DB error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Database error',
        'unread_count' => 0
    ]);
}

?>