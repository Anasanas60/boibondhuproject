<?php
// api/register.php

require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$required_fields = ['name', 'email', 'password'];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];
$campus = isset($data['campus']) ? $data['campus'] : null;
$year = isset($data['year']) ? $data['year'] : null;

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['error' => 'Invalid email format.']);
    exit;
}

try {
    // Check if email already exists
    $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = :email LIMIT 1");
    $stmt->execute([':email' => $email]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        echo json_encode(['error' => 'Email already registered.']);
        exit;
    }

    // Hash password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $sql = "INSERT INTO users (name, email, password, campus, year) VALUES (:name, :email, :password, :campus, :year)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':password' => $password_hash,
        ':campus' => $campus,
        ':year' => $year,
    ]);

    echo json_encode(['success' => 'Registration successful.']);
} catch (PDOException $e) {
    error_log('[register] DB error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to register user']);
}

?>