<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/Complaint.php';

$database = new Database();
$db = $database->getConnection();
$complaint = new Complaint($db);

$stmt = $complaint->getAll();
$num = $stmt->rowCount();

if($num > 0) {
    $complaints_arr = array();
    $complaints_arr["complaints"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        
        // Get timeline
        $timeline_stmt = $complaint->getTimeline($id);
        $timeline = array();
        while($timeline_row = $timeline_stmt->fetch(PDO::FETCH_ASSOC)) {
            $timeline[] = array(
                "event" => $timeline_row['event'],
                "timestamp" => $timeline_row['timestamp']
            );
        }

        $complaint_item = array(
            "id" => $id,
            "complaintId" => $complaint_id,
            "studentId" => $student_id,
            "studentName" => $student_name,
            "usn" => $usn,
            "roomNumber" => $room_number,
            "location" => $location,
            "category" => $category,
            "description" => $description,
            "priority" => $priority,
            "status" => $status,
            "images" => json_decode($images),
            "adminComments" => $admin_comments,
            "submittedAt" => $submitted_at,
            "updatedAt" => $updated_at,
            "timeline" => $timeline
        );

        array_push($complaints_arr["complaints"], $complaint_item);
    }

    http_response_code(200);
    echo json_encode($complaints_arr);
} else {
    http_response_code(200);
    echo json_encode(array("complaints" => array()));
}
?>
