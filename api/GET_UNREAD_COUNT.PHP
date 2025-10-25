<?php
// api/get_unread_count.php

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
            WHERE (mt.buyer_id = ? OR mt.seller_id = ?) 
            AND m.sender_id != ? 
            AND m.is_read = 0";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $user_id, $user_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    $unread_count = $row['unread_count'] ?? 0;
    
    echo json_encode([
        'success' => true,
        'unread_count' => $unread_count
    ]);
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
        'unread_count' => 0
    ]);
}

$conn->close();
?>