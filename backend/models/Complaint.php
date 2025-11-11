<?php
class Complaint {
    private $conn;
    private $table_name = "complaints";

    public $id;
    public $complaint_id;
    public $student_id;
    public $student_name;
    public $usn;
    public $room_number;
    public $location;
    public $category;
    public $description;
    public $priority;
    public $status;
    public $images;
    public $admin_comments;
    public $submitted_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Generate unique complaint ID
    private function generateComplaintId() {
        $date = date('Ymd');
        $random = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);
        return "CMP-" . $date . "-" . $random;
    }

    // Create complaint
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET complaint_id=:complaint_id, student_id=:student_id, 
                      student_name=:student_name, usn=:usn, room_number=:room_number, 
                      location=:location, category=:category, description=:description, 
                      priority=:priority, status='Open', images=:images";

        $stmt = $this->conn->prepare($query);

        $this->complaint_id = $this->generateComplaintId();
        
        // Sanitize
        $this->student_name = htmlspecialchars(strip_tags($this->student_name));
        $this->usn = htmlspecialchars(strip_tags($this->usn));
        $this->room_number = htmlspecialchars(strip_tags($this->room_number));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->priority = htmlspecialchars(strip_tags($this->priority));

        // Bind values
        $stmt->bindParam(":complaint_id", $this->complaint_id);
        $stmt->bindParam(":student_id", $this->student_id);
        $stmt->bindParam(":student_name", $this->student_name);
        $stmt->bindParam(":usn", $this->usn);
        $stmt->bindParam(":room_number", $this->room_number);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":priority", $this->priority);
        $stmt->bindParam(":images", $this->images);

        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            
            // Add timeline entry
            $this->addTimelineEntry($this->id, 'Complaint Submitted');
            
            return true;
        }
        return false;
    }

    // Get complaints by student ID
    public function getByStudentId($student_id) {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE student_id = :student_id 
                  ORDER BY submitted_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":student_id", $student_id);
        $stmt->execute();

        return $stmt;
    }

    // Get all complaints (for admin)
    public function getAll() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY submitted_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Get complaint by ID
    public function getById() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->complaint_id = $row['complaint_id'];
            $this->student_id = $row['student_id'];
            $this->student_name = $row['student_name'];
            $this->usn = $row['usn'];
            $this->room_number = $row['room_number'];
            $this->location = $row['location'];
            $this->category = $row['category'];
            $this->description = $row['description'];
            $this->priority = $row['priority'];
            $this->status = $row['status'];
            $this->images = $row['images'];
            $this->admin_comments = $row['admin_comments'];
            $this->submitted_at = $row['submitted_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }

    // Update status
    public function updateStatus() {
        $query = "UPDATE " . $this->table_name . " 
                  SET status=:status, updated_at=CURRENT_TIMESTAMP 
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            $this->addTimelineEntry($this->id, "Status changed to " . $this->status);
            return true;
        }
        return false;
    }

    // Update admin comments
    public function updateAdminComments() {
        $query = "UPDATE " . $this->table_name . " 
                  SET admin_comments=:admin_comments, updated_at=CURRENT_TIMESTAMP 
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":admin_comments", $this->admin_comments);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            $this->addTimelineEntry($this->id, "Admin commented");
            return true;
        }
        return false;
    }

    // Add timeline entry
    private function addTimelineEntry($complaint_id, $event) {
        $query = "INSERT INTO complaint_timeline (complaint_id, event) VALUES (:complaint_id, :event)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":complaint_id", $complaint_id);
        $stmt->bindParam(":event", $event);
        $stmt->execute();
    }

    // Get timeline
    public function getTimeline($complaint_id) {
        $query = "SELECT * FROM complaint_timeline WHERE complaint_id = :complaint_id ORDER BY timestamp ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":complaint_id", $complaint_id);
        $stmt->execute();
        return $stmt;
    }

    // Get statistics for student
    public function getStatsByStudent($student_id) {
        $query = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
                    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as resolved
                  FROM " . $this->table_name . " 
                  WHERE student_id = :student_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":student_id", $student_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
