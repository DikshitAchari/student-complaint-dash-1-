<?php
class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $full_name;
    public $usn;
    public $email;
    public $password;
    public $role;
    public $department;
    public $year;
    public $contact;
    public $email_verified;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create user
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET full_name=:full_name, usn=:usn, email=:email, 
                      password=:password, role=:role, email_verified=1, 
                      department=:department, year=:year, contact=:contact";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->full_name = htmlspecialchars(strip_tags($this->full_name));
        $this->usn = htmlspecialchars(strip_tags($this->usn));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));
        $this->role = htmlspecialchars(strip_tags($this->role));

        // Bind values
        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":usn", $this->usn);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", password_hash($this->password, PASSWORD_BCRYPT));
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":department", $this->department);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":contact", $this->contact);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Login user
    public function login() {
        $query = "SELECT id, full_name, usn, email, password, role, department, year, contact 
                  FROM " . $this->table_name . " 
                  WHERE usn = :usn LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":usn", $this->usn);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if(password_verify($this->password, $row['password'])) {
                $this->id = $row['id'];
                $this->full_name = $row['full_name'];
                $this->email = $row['email'];
                $this->role = $row['role'];
                $this->department = $row['department'];
                $this->year = $row['year'];
                $this->contact = $row['contact'];
                return true;
            }
        }
        return false;
    }

    // Check if USN exists
    public function usnExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE usn = :usn LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":usn", $this->usn);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Check if email exists
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Update user profile
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET full_name=:full_name, contact=:contact, 
                      department=:department, year=:year 
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":full_name", $this->full_name);
        $stmt->bindParam(":contact", $this->contact);
        $stmt->bindParam(":department", $this->department);
        $stmt->bindParam(":year", $this->year);
        $stmt->bindParam(":id", $this->id);

        return $stmt->execute();
    }

    // Change password
    public function changePassword($current_password, $new_password) {
        $query = "SELECT password FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($current_password, $row['password'])) {
                $update_query = "UPDATE " . $this->table_name . " SET password=:password WHERE id=:id";
                $update_stmt = $this->conn->prepare($update_query);
                $hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
                $update_stmt->bindParam(":password", $hashed_password);
                $update_stmt->bindParam(":id", $this->id);
                return $update_stmt->execute();
            }
        }
        return false;
    }

    // Get user by ID
    public function getById() {
        $query = "SELECT id, full_name, usn, email, role, department, year, contact 
                  FROM " . $this->table_name . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->full_name = $row['full_name'];
            $this->usn = $row['usn'];
            $this->email = $row['email'];
            $this->role = $row['role'];
            $this->department = $row['department'];
            $this->year = $row['year'];
            $this->contact = $row['contact'];
            return true;
        }
        return false;
    }
}
?>
