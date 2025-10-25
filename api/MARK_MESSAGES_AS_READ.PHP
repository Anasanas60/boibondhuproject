<?php
// api/mark_messages_as_read.php

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

// Get parameters from query string
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$other_user_id = isset($_GET['other_user_id']) ? intval($_GET['other_user_id']) : 0;

if ($user_id <= 0 || $other_user_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid user IDs']);
    exit;
}

try {
    // Mark messages as read where:
    // - The current user is the recipient (in the conversation thread)
    // - The other user is the sender
    // - Messages are currently unread
    $sql = "UPDATE messages m
            INNER JOIN message_threads mt ON m.thread_id = mt.id
            SET m.is_read = 1
            WHERE ((mt.buyer_id = ? AND mt.seller_id = ?) OR (mt.buyer_id = ? AND mt.seller_id = ?))
            AND m.sender_id = ?
            AND m.is_read = 0";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iiiii", $user_id, $other_user_id, $other_user_id, $user_id, $other_user_id);
    $stmt->execute();
    
    $affected_rows = $stmt->affected_rows;
    
    echo json_encode([
        'success' => true,
        'message' => "Marked $affected_rows messages as read",
        'affected_rows' => $affected_rows
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>