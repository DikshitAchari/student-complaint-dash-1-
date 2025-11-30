<?php
include_once 'backend/config/database.php';
include_once 'backend/models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Try to get a user by USN
$user->usn = "test";
if($user->getByUsn()) {
    echo "User found: " . $user->full_name;
} else {
    echo "User not found";
}
?>