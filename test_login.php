<?php
// Test login script
$data = array(
    "usn" => "TEST003",
    "password" => "password123",
    "loginType" => "student"
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ),
);

$context  = stream_context_create($options);
$result = file_get_contents('http://localhost:8000/backend/api/auth/login.php', false, $context);

if ($result === FALSE) {
    echo "Error occurred during login\n";
} else {
    echo "Login response:\n";
    echo $result . "\n";
}
?>