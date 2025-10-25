<?php
// api/get_messages.php

require_once 'cors.php';
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

try {
    $sql = "SELECT message_id, sender_id, receiver_id, message_text, is_read, created_at FROM messages
            WHERE ((sender_id = :u1 AND receiver_id = :u2) OR (sender_id = :u2 AND receiver_id = :u1))
            ORDER BY created_at ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':u1' => $user_id, ':u2' => $conversation_with]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $messages = [];
    foreach ($rows as $row) {
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
} catch (PDOException $e) {
    error_log('[get_messages] DB error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to fetch messages']);
}

?>
