<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');
require_once 'db_connect.php';

$searchTerm = $_GET['q'] ?? '';
$page = $_GET['page'] ?? 1;
$limit = 12;
$offset = ($page - 1) * $limit;

try {
    if (empty($searchTerm)) {
        // If no search term, return all listings
        $query = "SELECT l.*, u.name as seller_name 
                  FROM listings l 
                  JOIN users u ON l.seller_id = u.user_id 
                  ORDER BY l.created_at DESC 
                  LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ii", $limit, $offset);
    } else {
        // IMPROVED: Better search with partial matches and relevance scoring
        $searchTerm = "%$searchTerm%";
        $query = "SELECT l.*, u.name as seller_name,
                         CASE 
                            WHEN l.title LIKE ? THEN 3
                            WHEN l.author LIKE ? THEN 2
                            WHEN l.course_code LIKE ? THEN 1
                            ELSE 0
                         END as relevance
                  FROM listings l 
                  JOIN users u ON l.seller_id = u.user_id 
                  WHERE l.title LIKE ? OR l.author LIKE ? OR l.course_code LIKE ?
                  ORDER BY relevance DESC, l.created_at DESC 
                  LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssssii", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $limit, $offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $listings = [];
    while ($row = $result->fetch_assoc()) {
        $listings[] = $row;
    }
    
    // Get total count for pagination
    if (empty($searchTerm)) {
        $countQuery = "SELECT COUNT(*) as total FROM listings";
        $countStmt = $conn->prepare($countQuery);
    } else {
        $countQuery = "SELECT COUNT(*) as total FROM listings 
                      WHERE title LIKE ? OR author LIKE ? OR course_code LIKE ?";
        $countStmt = $conn->prepare($countQuery);
        $countStmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
    }
    
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $total = $countResult->fetch_assoc()['total'];
    
    echo json_encode([
        'success' => true,
        'listings' => $listings,
        'total' => $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Search failed: ' . $e->getMessage()
    ]);
}

$conn->close();
?>