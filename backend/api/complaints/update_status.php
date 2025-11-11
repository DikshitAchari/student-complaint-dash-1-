<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/Complaint.php';

$database = new Database();
$db = $database->getConnection();
$complaint = new Complaint($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->status)) {
    $complaint->id = $data->id;
    $complaint->status = $data->status;

    if($complaint->updateStatus()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Status updated successfully"));
    } else {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "Unable to update status"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
