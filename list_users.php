<?php
// List all users in the database
include_once 'backend/config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        $query = "SELECT id, full_name, email FROM users";
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        echo "Users in database:\n";
        echo "ID\tName\t\tEmail\n";
        echo "----------------------------------------\n";
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['id'] . "\t" . $row['full_name'] . "\t\t" . $row['email'] . "\n";
        }
    } else {
        echo "Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>