<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/Complaint.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $complaint = new Complaint($db);

    // Get overall statistics for admin
    $query = "SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as resolved
              FROM complaints";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Ensure all values are integers, not NULL
    $stats['total'] = (int)($stats['total'] ?? 0);
    $stats['open'] = (int)($stats['open'] ?? 0);
    $stats['in_progress'] = (int)($stats['in_progress'] ?? 0);
    $stats['resolved'] = (int)($stats['resolved'] ?? 0);

    http_response_code(200);
    echo json_encode($stats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage(),
        'total' => 0,
        'open' => 0,
        'in_progress' => 0,
        'resolved' => 0
    ]);
}
?>
