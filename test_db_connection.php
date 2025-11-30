<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=student_complaints_db', 'root', '');
    echo 'Database connection successful';
} catch (Exception $e) {
    echo 'Database connection failed: ' . $e->getMessage();
}
?>