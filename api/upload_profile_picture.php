<?php
// api/upload_profile_picture.php

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
    exit;
}

if (!isset($_POST['user_id']) || !isset($_FILES['profile_picture'])) {
    echo json_encode(['success' => false, 'error' => 'Missing parameters']);
    exit;
}

$user_id = intval($_POST['user_id']);
$file = $_FILES['profile_picture'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'File upload error: ' . $file['error']]);
    exit;
}

// Validate file type and size
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime_type, $allowedTypes)) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type: ' . $mime_type]);
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
    echo json_encode(['success' => false, 'error' => 'File size exceeds limit']);
    exit;
}

// FIXED: Save file to XAMPP uploads directory directly
$uploadDir = 'E:/xamp/htdocs/boibondhu/uploads/profile_pictures/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename to prevent overwrites
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'user_' . $user_id . '_' . uniqid() . '.' . $ext;
$filepath = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
    exit;
}

// Use absolute URL path for the frontend
$profilePicUrl = 'http://localhost/boibondhu/uploads/profile_pictures/' . $filename;

$query = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'Database prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $profilePicUrl, $user_id);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'profilePicUrl' => $profilePicUrl,
        'message' => 'Profile picture updated successfully'
    ]);
} else {
    // Delete the file if database update fails
    unlink($filepath);
    echo json_encode(['success' => false, 'error' => 'Failed to update profile picture in database: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>