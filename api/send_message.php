<?php
// api/send_message.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['sender_id'], $data['receiver_id'], $data['message_text'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields.']);
    exit;
}

$sender_id = intval($data['sender_id']);
$receiver_id = intval($data['receiver_id']);
$message_text = trim($data['message_text']);

// Basic validation
if ($sender_id <= 0 || $receiver_id <= 0 || empty($message_text)) {
    echo json_encode(['success' => false, 'error' => 'Invalid input data.']);
    exit;
}

// Sanitize message text to prevent XSS
$message_text = htmlspecialchars($message_text, ENT_QUOTES, 'UTF-8');

try {
    $sql = "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (:sender, :receiver, :msg)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':sender' => $sender_id, ':receiver' => $receiver_id, ':msg' => $message_text]);

    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
} catch (PDOException $e) {
    error_log('[send_message] DB error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to send message']);
}

?>
