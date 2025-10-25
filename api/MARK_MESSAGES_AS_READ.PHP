<?php
// api/mark_messages_as_read.php

require_once 'cors.php';
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
    // Postgres-style UPDATE with FROM
    $sql = "UPDATE messages m
        SET is_read = TRUE
        FROM message_threads mt
        WHERE m.thread_id = mt.id
        AND ((mt.buyer_id = :u1 AND mt.seller_id = :u2) OR (mt.buyer_id = :u2 AND mt.seller_id = :u1))
        AND m.sender_id = :sender
        AND m.is_read = FALSE";

    $stmt = $conn->prepare($sql);
    $stmt->execute([':u1' => $user_id, ':u2' => $other_user_id, ':sender' => $other_user_id]);
    $affected_rows = $stmt->rowCount();

    echo json_encode([
        'success' => true,
        'message' => "Marked $affected_rows messages as read",
        'affected_rows' => $affected_rows
    ]);
} catch (PDOException $e) {
    error_log('[MARK_MESSAGES_AS_READ] DB error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Database error'
    ]);
}

?>