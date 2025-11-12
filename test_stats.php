<?php
// Test script to check complaint statistics
include_once 'backend/config/database.php';

$database = new Database();
$db = $database->getConnection();

echo "<h2>Testing Complaint Statistics</h2>";

// Check if we have any complaints
$query = "SELECT COUNT(*) as count FROM complaints";
$stmt = $db->prepare($query);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);
echo "<p>Total complaints in database: " . $result['count'] . "</p>";

// Get detailed stats
$query = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
            SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as resolved
          FROM complaints";

$stmt = $db->prepare($query);
$stmt->execute();
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo "<h3>Statistics Breakdown:</h3>";
echo "<ul>";
echo "<li>Total: " . ($stats['total'] ?? 0) . "</li>";
echo "<li>Open: " . ($stats['open'] ?? 0) . "</li>";
echo "<li>In Progress: " . ($stats['in_progress'] ?? 0) . "</li>";
echo "<li>Resolved: " . ($stats['resolved'] ?? 0) . "</li>";
echo "</ul>";

// Show all complaints
$query = "SELECT id, complaint_id, student_name, usn, status, submitted_at FROM complaints ORDER BY submitted_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();

echo "<h3>All Complaints:</h3>";
echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
echo "<tr><th>ID</th><th>Complaint ID</th><th>Student</th><th>USN</th><th>Status</th><th>Submitted</th></tr>";

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo "<tr>";
    echo "<td>" . $row['id'] . "</td>";
    echo "<td>" . $row['complaint_id'] . "</td>";
    echo "<td>" . $row['student_name'] . "</td>";
    echo "<td>" . $row['usn'] . "</td>";
    echo "<td>" . $row['status'] . "</td>";
    echo "<td>" . $row['submitted_at'] . "</td>";
    echo "</tr>";
}
echo "</table>";

echo "<hr>";
echo "<h3>Testing API Endpoint Response:</h3>";

// Ensure all values are integers, not NULL
$stats['total'] = (int)($stats['total'] ?? 0);
$stats['open'] = (int)($stats['open'] ?? 0);
$stats['in_progress'] = (int)($stats['in_progress'] ?? 0);
$stats['resolved'] = (int)($stats['resolved'] ?? 0);

echo "<pre>";
echo json_encode($stats, JSON_PRETTY_PRINT);
echo "</pre>";
?>
