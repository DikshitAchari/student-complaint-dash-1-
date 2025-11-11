<?php
// Test admin credentials
include_once 'backend/config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    echo "✓ Database connected successfully\n\n";
    
    // Check if admin exists
    $query = "SELECT id, full_name, usn, email, role FROM users WHERE role = 'admin'";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    echo "Admin accounts found: " . $stmt->rowCount() . "\n\n";
    
    if ($stmt->rowCount() > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo "Admin Details:\n";
            echo "  ID: " . $row['id'] . "\n";
            echo "  Name: " . $row['full_name'] . "\n";
            echo "  Username (USN): " . $row['usn'] . "\n";
            echo "  Email: " . $row['email'] . "\n";
            echo "  Role: " . $row['role'] . "\n\n";
        }
        
        // Test password verification
        $test_usn = 'ADMIN01';
        $test_password = 'admin123';
        
        $query2 = "SELECT password FROM users WHERE usn = :usn";
        $stmt2 = $db->prepare($query2);
        $stmt2->bindParam(':usn', $test_usn);
        $stmt2->execute();
        
        if ($stmt2->rowCount() > 0) {
            $row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
            if (password_verify($test_password, $row2['password'])) {
                echo "✓ Password verification: SUCCESS\n";
                echo "  Username: ADMIN01\n";
                echo "  Password: admin123\n";
            } else {
                echo "✗ Password verification: FAILED\n";
                echo "  The stored password hash doesn't match 'admin123'\n";
            }
        } else {
            echo "✗ Admin user 'ADMIN01' not found in database\n";
        }
    } else {
        echo "✗ No admin accounts found in database\n";
        echo "\nPlease import the schema.sql file:\n";
        echo "  1. Open http://localhost/phpmyadmin\n";
        echo "  2. Select 'student_complaints_db' database\n";
        echo "  3. Click Import tab\n";
        echo "  4. Choose backend/database/schema.sql\n";
        echo "  5. Click Go\n";
    }
} else {
    echo "✗ Database connection failed\n";
    echo "Please make sure MySQL is running in XAMPP\n";
}
?>
