<?php
// Fix admin account
include_once 'backend/config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    // First, delete the duplicate admin account (ID: 5)
    $delete_query = "DELETE FROM users WHERE id = 5 AND role = 'admin'";
    $db->exec($delete_query);
    echo "✓ Removed duplicate admin account (ID: 5)\n";
    
    // Update ADMIN01 password to 'admin123'
    $correct_hash = password_hash('admin123', PASSWORD_BCRYPT);
    $update_query = "UPDATE users SET password = :password WHERE usn = 'ADMIN01'";
    $stmt = $db->prepare($update_query);
    $stmt->bindParam(':password', $correct_hash);
    
    if ($stmt->execute()) {
        echo "✓ Updated ADMIN01 password to 'admin123'\n\n";
        
        // Verify the update
        $verify_query = "SELECT password FROM users WHERE usn = 'ADMIN01'";
        $verify_stmt = $db->prepare($verify_query);
        $verify_stmt->execute();
        $row = $verify_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (password_verify('admin123', $row['password'])) {
            echo "✓ Password verification: SUCCESS\n";
            echo "\nYou can now login with:\n";
            echo "  Username: ADMIN01\n";
            echo "  Password: admin123\n";
        } else {
            echo "✗ Password verification failed\n";
        }
    } else {
        echo "✗ Failed to update password\n";
    }
} else {
    echo "✗ Database connection failed\n";
}
?>
