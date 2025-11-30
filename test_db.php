<?php
// Test database connection
include_once 'backend/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "Database connection successful!\n";
        
        // Check if the database exists by listing tables
        $stmt = $db->prepare("SHOW TABLES");
        $stmt->execute();
        $tables = $stmt->fetchAll();
        
        echo "Tables in database:\n";
        foreach ($tables as $table) {
            // Get the first column value (table name)
            $tableName = reset($table);
            echo "- " . $tableName . "\n";
        }
    } else {
        echo "Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>