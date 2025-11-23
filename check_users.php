<?php
include_once 'backend/config/database.php';

$database = new Database();
$db = $database->getConnection();

$stmt = $db->prepare('SELECT * FROM users');
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Users in database:\n";
print_r($users);
?>