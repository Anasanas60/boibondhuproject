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
                  LIMIT :limit OFFSET :offset";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    } else {
        // IMPROVED: Better search with partial matches and relevance scoring
        $searchTerm = "%$searchTerm%";
        $query = "SELECT l.*, u.name as seller_name,
                         CASE 
                            WHEN l.title ILIKE :st1 THEN 3
                            WHEN l.author ILIKE :st2 THEN 2
                            WHEN l.course_code ILIKE :st3 THEN 1
                            ELSE 0
                         END as relevance
                  FROM listings l 
                  JOIN users u ON l.seller_id = u.user_id 
                  WHERE l.title ILIKE :st4 OR l.author ILIKE :st5 OR l.course_code ILIKE :st6
                  ORDER BY relevance DESC, l.created_at DESC 
                  LIMIT :limit OFFSET :offset";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':st1', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':st2', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':st3', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':st4', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':st5', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':st6', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    }
    
    $stmt->execute();
    
    $listings = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $listings[] = $row;
    }
    
    // Get total count for pagination
    if (empty($searchTerm)) {
        $countQuery = "SELECT COUNT(*) as total FROM listings";
        $countStmt = $conn->prepare($countQuery);
    } else {
        $countQuery = "SELECT COUNT(*) as total FROM listings 
                      WHERE title ILIKE :st1 OR author ILIKE :st2 OR course_code ILIKE :st3";
        $countStmt = $conn->prepare($countQuery);
        $countStmt->bindValue(':st1', $searchTerm, PDO::PARAM_STR);
        $countStmt->bindValue(':st2', $searchTerm, PDO::PARAM_STR);
        $countStmt->bindValue(':st3', $searchTerm, PDO::PARAM_STR);
    }
    
    $countStmt->execute();
    $countResult = $countStmt->fetch(PDO::FETCH_ASSOC);
    $total = $countResult['total'];
    
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
?>