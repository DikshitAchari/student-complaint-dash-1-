<?php
// Comprehensive database test
include_once 'backend/config/database.php';
include_once 'backend/models/Complaint.php';

try {
    echo "Testing database connection...\n";
    
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "✓ Database connection successful!\n";
        
        // Test creating a Complaint object
        $complaint = new Complaint($db);
        echo "✓ Complaint object created successfully!\n";
        
        // Test a simple query
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM users");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "✓ Database query successful! Found " . $result['count'] . " users.\n";
        
        // Test Complaint model method
        $stats = $complaint->getStatsByStudent(1);
        echo "✓ Complaint model method executed successfully!\n";
        
        echo "\nAll tests passed! Database connection is working properly.\n";
    } else {
        echo "✗ Database connection failed!\n";
        echo "Connection object is null.\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>