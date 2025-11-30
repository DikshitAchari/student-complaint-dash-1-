<?php
// Test login API
$url = 'http://localhost:8000/backend/api/auth/login.php';

// Test data
$data = array(
    'usn' => 'ADMIN01',
    'password' => 'admin123',
    'loginType' => 'admin'
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ),
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    echo "Error occurred";
} else {
    echo "Response: " . $result;
}
?>