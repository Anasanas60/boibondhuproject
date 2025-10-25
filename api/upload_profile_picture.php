<?php
// api/upload_profile_picture.php

// Enable error reporting for debugging in development only
if ((getenv('APP_ENV') ?? '') === 'development') {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

require_once 'cors.php';
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
    echo json_encode(['success' => false, 'error' => 'File upload error']);
    exit;
}

// Validate file type and size
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime_type, $allowedTypes)) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type']);
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) { // 5MB limit
    echo json_encode(['success' => false, 'error' => 'File size exceeds limit']);
    exit;
}

// Upload directory from env (or default to project uploads)
$uploadDir = getenv('UPLOADS_DIR') ?: __DIR__ . '/../uploads/profile_pictures/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename to prevent overwrites
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'user_' . $user_id . '_' . uniqid() . '.' . $ext;
$filepath = rtrim($uploadDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $filename;

if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
    exit;
}

// Build profile picture URL for frontend
// Use environment-provided API base. Do NOT fall back to localhost here.
$apiBase = getenv('VITE_API_BASE_URL') ?: getenv('API_BASE_URL') ?: '';
if ($apiBase) {
    // If an absolute API base is provided, construct an absolute URL to the public uploads path
    $profilePicUrl = rtrim($apiBase, '/') . '/uploads/profile_pictures/' . $filename;
} else {
    // No API base configured: return a relative URL (served from the same host)
    $profilePicUrl = '/uploads/profile_pictures/' . $filename;
}

try {
    $query = "UPDATE users SET profile_picture = :url WHERE user_id = :uid";
    $stmt = $conn->prepare($query);
    $stmt->execute([':url' => $profilePicUrl, ':uid' => $user_id]);

    echo json_encode([
        'success' => true,
        'profilePicUrl' => $profilePicUrl,
        'message' => 'Profile picture updated successfully'
    ]);
} catch (PDOException $e) {
    // Delete the file if database update fails
    @unlink($filepath);
    error_log('[upload_profile_picture] DB error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Failed to update profile picture in database']);
}

?>