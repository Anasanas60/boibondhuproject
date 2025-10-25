<?php
// api/get_conversations.php

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

if (!isset($_GET['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Missing user_id parameter.']);
    exit;
}

$user_id = intval($_GET['user_id']);

if ($user_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid user ID.']);
    exit;
}

$sql = "SELECT
            CASE
                WHEN m.sender_id = :uid1 THEN m.receiver_id
                ELSE m.sender_id
            END as other_user_id,
            u.name as other_user_name,
            u.email as other_user_email,
            MAX(m.created_at) as last_message_time,
            COUNT(*) as total_messages,
            SUM(CASE WHEN m.is_read = 0 AND m.receiver_id = :uid2 THEN 1 ELSE 0 END) as unread_count,
            (SELECT message_text FROM messages
             WHERE (sender_id = :uid3 AND receiver_id = other_user_id) OR (sender_id = other_user_id AND receiver_id = :uid4)
             ORDER BY created_at DESC LIMIT 1) as last_message
        FROM messages m
        JOIN users u ON u.user_id = CASE
            WHEN m.sender_id = :uid5 THEN m.receiver_id
            ELSE m.sender_id
        END
        WHERE m.sender_id = :uid6 OR m.receiver_id = :uid7
        GROUP BY other_user_id, u.name, u.email
        ORDER BY last_message_time DESC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database prepare failed.']);
    exit;
}

$stmt->bindValue(':uid1', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':uid2', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':uid3', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':uid4', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':uid5', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':uid6', $user_id, PDO::PARAM_INT);
$stmt->bindValue(':uid7', $user_id, PDO::PARAM_INT);

if ($stmt->execute()) {
    $conversations = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $conversations[] = [
            'other_user_id' => $row['other_user_id'],
            'other_user_name' => $row['other_user_name'],
            'other_user_email' => $row['other_user_email'],
            'last_message_time' => $row['last_message_time'],
            'total_messages' => $row['total_messages'],
            'unread_count' => $row['unread_count'],
            'last_message' => $row['last_message']
        ];
    }

    echo json_encode(['success' => true, 'conversations' => $conversations]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to fetch conversations.']);
}
?>
