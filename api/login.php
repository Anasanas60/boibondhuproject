<?php
// api/login.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Missing email or password.']);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Invalid email format.']);
    exit;
}

try {
    // Prepare and execute query to find user by email
    $sql = "SELECT user_id, name, password, email FROM users WHERE email = :email LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['error' => 'Invalid email or password.']);
        exit;
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        echo json_encode(['error' => 'Invalid email or password.']);
        exit;
    }

    // Successful login
    echo json_encode([
        'success' => 'Login successful.',
        'user' => [
            'user_id' => $user['user_id'],
            'name' => $user['name'],
            'email' => $user['email']
        ]
    ]);
} catch (PDOException $e) {
    error_log('[login] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Internal server error']);
}

?>