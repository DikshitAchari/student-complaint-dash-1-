<?php
// Test database connection and packet settings
include_once 'backend/config/database.php';

try {
    echo "Testing database connection...\n";
    
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "✓ Database connection successful!\n";
        
        // Check current max_allowed_packet setting
        $stmt = $db->prepare("SHOW VARIABLES LIKE 'max_allowed_packet'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Current max_allowed_packet: " . $result['Value'] . "\n";
        
        // Try to set it
        $db->exec("SET SESSION max_allowed_packet=64M");
        
        // Check again
        $stmt = $db->prepare("SHOW VARIABLES LIKE 'max_allowed_packet'");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "After setting, max_allowed_packet: " . $result['Value'] . "\n";
        
        echo "Database connection test completed successfully!\n";
    } else {
        echo "✗ Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>