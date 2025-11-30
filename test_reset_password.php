<?php
// Test script for reset password functionality
include_once 'backend/config/database.php';
include_once 'backend/models/User.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "Database connection successful!\n";
        
        // Test user lookup
        $user = new User($db);
        $user->email = "test@example.com";
        
        if ($user->getUserByEmail()) {
            echo "User found: " . $user->full_name . "\n";
        } else {
            echo "User not found with email: test@example.com\n";
        }
    } else {
        echo "Database connection failed!\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>