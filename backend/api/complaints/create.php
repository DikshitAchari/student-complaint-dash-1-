<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/Complaint.php';

$database = new Database();
$db = $database->getConnection();
$complaint = new Complaint($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->student_id) &&
    !empty($data->student_name) &&
    !empty($data->usn) &&
    !empty($data->room_number) &&
    !empty($data->location) &&
    !empty($data->category) &&
    !empty($data->description) &&
    !empty($data->priority)
) {
    $complaint->student_id = $data->student_id;
    $complaint->student_name = $data->student_name;
    $complaint->usn = $data->usn;
    $complaint->room_number = $data->room_number;
    $complaint->location = $data->location;
    $complaint->category = $data->category;
    $complaint->description = $data->description;
    $complaint->priority = $data->priority;
    $complaint->images = isset($data->images) ? json_encode($data->images) : json_encode([]);

    if($complaint->create()) {
        http_response_code(201);
        echo json_encode(array(
            "success" => true, 
            "message" => "Complaint submitted successfully",
            "complaint_id" => $complaint->complaint_id,
            "id" => $complaint->id
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "Unable to submit complaint"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
