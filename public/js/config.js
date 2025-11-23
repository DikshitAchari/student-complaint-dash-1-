// API Configuration
const API_BASE_URL = 'http://localhost:8000/backend/api';

const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/auth/login.php`,
    REGISTER: `${API_BASE_URL}/auth/register.php`,
    SEND_VERIFICATION: `${API_BASE_URL}/auth/sendVerification.php`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verifyEmail.php`,
    
    // Complaint endpoints
    CREATE_COMPLAINT: `${API_BASE_URL}/complaints/create.php`,
    GET_COMPLAINTS_BY_STUDENT: `${API_BASE_URL}/complaints/get_by_student.php`,
    GET_ALL_COMPLAINTS: `${API_BASE_URL}/complaints/get_all.php`,
    UPDATE_STATUS: `${API_BASE_URL}/complaints/update_status.php`,
    UPDATE_ADMIN_COMMENTS: `${API_BASE_URL}/complaints/update_admin_comments.php`,
    GET_STATS: `${API_BASE_URL}/complaints/get_stats.php`,
    GET_ALL_STATS: `${API_BASE_URL}/complaints/get_all_stats.php`,
    
    // User endpoints
    UPDATE_PROFILE: `${API_BASE_URL}/users/update_profile.php`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/change_password.php`
};