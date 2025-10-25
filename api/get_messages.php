<?php
// api/get_messages.php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method. Use GET.']);
    exit;
}

if (!isset($_GET['user_id']) || !isset($_GET['conversation_with'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required query parameters.']);
    exit;
}

$user_id = intval($_GET['user_id']);
$conversation_with = intval($_GET['conversation_with']);

if ($user_id <= 0 || $conversation_with <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid user IDs.']);
    exit;
}

$sql = "SELECT message_id, sender_id, receiver_id, message_text, is_read, created_at FROM messages
        WHERE ((sender_id = :user_id1 AND receiver_id = :conv_with1) OR (sender_id = :conv_with2 AND receiver_id = :user_id2))
        ORDER BY created_at ASC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database prepare failed.']);
    exit;
}

$stmt->bindValue(':user_id1', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':conv_with1', $conversation_with, PDO::PARAM_INT);
$stmt->bindValue(':conv_with2', $conversation_with, PDO::PARAM_INT);
$stmt->bindValue(':user_id2', $user_id, PDO::PARAM_INT);

if ($stmt->execute()) {
    $messages = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $messages[] = [
            'message_id' => $row['message_id'],
            'sender_id' => $row['sender_id'],
            'receiver_id' => $row['receiver_id'],
            'message_text' => $row['message_text'],
            'is_read' => (bool)$row['is_read'],
            'created_at' => $row['created_at']
        ];
    }

    echo json_encode(['success' => true, 'messages' => $messages]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch messages.']);
}
?>
