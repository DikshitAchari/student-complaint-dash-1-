<?php
// Test database query
try {
    $pdo = new PDO('mysql:host=localhost;dbname=student_complaints_db', 'root', '');
    $stmt = $pdo->prepare("SELECT id, full_name, usn, email, role FROM users WHERE usn = 'ADMIN01'");
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "User found:\n";
        print_r($user);
    } else {
        echo "User not found\n";
    }
} catch (Exception $e) {
    echo 'Database query failed: ' . $e->getMessage();
}
?>