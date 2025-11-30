<?php
// Initialize database and tables
try {
    // Connect to MySQL server without specifying database
    $pdo = new PDO("mysql:host=localhost", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS student_complaints_db");
    echo "Database 'student_complaints_db' created successfully.\n";
    
    // Use the database
    $pdo->exec("USE student_complaints_db");
    
    // Read schema file
    $schema = file_get_contents('backend/database/schema.sql');
    
    // Split by semicolon and execute each statement
    $statements = explode(';', $schema);
    
    foreach ($statements as $statement) {
        $statement = trim($statement);
        // Skip empty statements, comments, and the problematic trigger
        if (!empty($statement) && 
            !preg_match('/^--/', $statement) && 
            !preg_match('/CREATE TRIGGER/', $statement) &&
            !preg_match('/prevent_multiple_admins/', $statement)) {
            
            // Skip CREATE DATABASE and USE statements as we already handled them
            if (!preg_match('/CREATE DATABASE|USE /i', $statement)) {
                try {
                    $pdo->exec($statement);
                    if (strlen($statement) > 50) {
                        echo "Executed: " . substr($statement, 0, 50) . "...\n";
                    } else {
                        echo "Executed: " . $statement . "\n";
                    }
                } catch (PDOException $e) {
                    echo "Warning (ignored): " . $e->getMessage() . "\n";
                }
            }
        }
    }
    
    echo "Database initialization completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>