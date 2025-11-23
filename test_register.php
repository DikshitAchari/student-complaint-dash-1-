<?php
// Test registration script
$data = array(
    "full_name" => "Test User",
    "usn" => "TEST001",
    "email" => "test@example.com",
    "password" => "password123",
    "role" => "student"
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ),
);

$context  = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/backend/api/auth/register.php', false, $context);

if ($result === FALSE) {
    echo "Error occurred during registration\n";
} else {
    echo "Registration response:\n";
    echo $result . "\n";
}
?>