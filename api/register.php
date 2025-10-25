<?php
// api/register.php

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

// Check if email already exists
$stmt = $conn->prepare("SELECT user_id FROM users WHERE email = :email");
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->execute();
if ($stmt->rowCount() > 0) {
    echo json_encode(['error' => 'Email already registered.']);
    exit;
}

// Hash password
$password_hash = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$sql = "INSERT INTO users (name, email, password, campus, year) VALUES (:name, :email, :password, :campus, :year)";
$stmt = $conn->prepare($sql);
$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->bindValue(':password', $password_hash, PDO::PARAM_STR);
$stmt->bindValue(':campus', $campus, PDO::PARAM_STR);
$stmt->bindValue(':year', $year, PDO::PARAM_INT);

if ($stmt->execute()) {
    echo json_encode(['success' => 'Registration successful.']);
} else {
    echo json_encode(['error' => 'Failed to register user.']);
}
?>