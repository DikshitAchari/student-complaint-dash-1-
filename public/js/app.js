// Current user and session data
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let generatedOTP = null;
let otpTimerInterval = null;
let uploadedImages = [];

// Helper Functions
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show toast-${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function generateComplaintId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `CMP-${year}${month}${day}-${random}`;
}

// Authentication Functions
function showLogin() {
  showStudentLogin();
}

function showStudentLogin() {
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('adminLoginPage').style.display = 'none';
  document.getElementById('registerPage').style.display = 'none';
}

function showAdminLogin() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminLoginPage').style.display = 'flex';
  document.getElementById('registerPage').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('adminLoginPage').style.display = 'none';
  document.getElementById('registerPage').style.display = 'flex';
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Student Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const usn = document.getElementById('loginUsn').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usn, password, loginType: 'student' })
    });

    const data = await response.json();

    if (data.success) {
      // Prevent admin from logging in through student portal
      if (data.user.role === 'admin') {
        showToast('Admin accounts cannot login through student portal. Use admin login.', 'error');
        return;
      }
      
      currentUser = data.user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      showToast('Login successful!', 'success');
      setTimeout(() => {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        initializeDashboard();
        loadDashboard();
      }, 500);
    } else {
      showToast(data.message || 'Invalid USN or password', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('Failed to connect to server', 'error');
  }
});

// Admin Login Form Handler
document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const usn = document.getElementById('adminLoginUsn').value.trim();
  const password = document.getElementById('adminLoginPassword').value;

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usn, password, loginType: 'admin' })
    });

    const data = await response.json();

    if (data.success) {
      // Only allow admin accounts
      if (data.user.role !== 'admin') {
        showToast('Invalid admin credentials', 'error');
        return;
      }
      
      currentUser = data.user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      showToast('Admin login successful!', 'success');
      setTimeout(() => {
        document.getElementById('adminLoginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        initializeDashboard();
        showAdminDashboard();
      }, 500);
    } else {
      showToast(data.message || 'Invalid admin credentials', 'error');
    }
  } catch (error) {
    console.error('Admin login error:', error);
    showToast('Failed to connect to server', 'error');
  }
});

// OTP Functions
// (Removed - Email verification no longer required)


// Password Strength Indicator
document.getElementById('regPassword').addEventListener('input', function(e) {
  const password = e.target.value;
  const strengthDiv = document.getElementById('passwordStrength');
  
  if (password.length === 0) {
    strengthDiv.innerHTML = '';
    return;
  }

  let strength = 'weak';
  if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
    strength = 'strong';
  } else if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    strength = 'medium';
  }

  strengthDiv.innerHTML = `<div class="password-strength-bar password-strength-${strength}"></div>`;
});

// Registration Form Handler
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('regFullName').value.trim();
  const usn = document.getElementById('regUsn').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const termsAccepted = document.getElementById('termsCheckbox').checked;
  const role = 'student'; // Force student role only

  if (!termsAccepted) {
    showToast('Please accept the terms and conditions', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        full_name: fullName,
        usn,
        email,
        password,
        role,
        department: '',
        year: '',
        contact: ''
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Registration successful! Please login.', 'success');
      setTimeout(() => {
        showLogin();
        document.getElementById('registerForm').reset();
      }, 1500);
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showToast('Failed to connect to server', 'error');
  }
});

// Dashboard Functions
function initializeDashboard() {
  // Show/hide navigation items based on user role
  const studentNavItems = document.querySelectorAll('.nav-item[data-role="student"]');
  const adminNavItems = document.querySelectorAll('.nav-item[data-role="admin"]');
  
  if (currentUser.role === 'admin') {
    // Hide student-specific nav items
    studentNavItems.forEach(item => {
      item.style.display = 'none';
    });
    // Show admin nav items
    adminNavItems.forEach(item => {
      item.style.display = 'flex';
    });
  } else {
    // Show student nav items
    studentNavItems.forEach(item => {
      item.style.display = 'flex';
    });
    // Hide admin nav items
    adminNavItems.forEach(item => {
      item.style.display = 'none';
    });
  }
}

function loadDashboard() {
  document.getElementById('headerUserName').textContent = currentUser.fullName;
  document.getElementById('headerUserUsn').textContent = currentUser.usn;
  
  // Set header title based on user role
  const headerTitle = document.querySelector('.dashboard-header h1');
  if (headerTitle) {
    headerTitle.textContent = currentUser.role === 'admin' ? 'Admin Dashboard' : 'Student Complaint Dashboard';
  }
  
  showDashboardHome();
}

function showDashboardHome() {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('dashboardHome').style.display = 'block';
  
  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item')[0].classList.add('active');
  
  // Update header title for student
  const headerTitle = document.querySelector('.dashboard-header h1');
  if (headerTitle) {
    headerTitle.textContent = 'Student Complaint Dashboard';
  }
  
  // Update statistics
  updateDashboardStats();
  loadRecentComplaints();
}

function updateDashboardStats() {
  if (!currentUser || !currentUser.id) return;
  
  fetch(`${API_ENDPOINTS.GET_STATS}?student_id=${currentUser.id}`)
    .then(response => response.json())
    .then(stats => {
      document.getElementById('statTotal').textContent = stats.total || 0;
      document.getElementById('statOpen').textContent = stats.open || 0;
      document.getElementById('statInProgress').textContent = stats.in_progress || 0;
      document.getElementById('statResolved').textContent = stats.resolved || 0;
    })
    .catch(error => {
      console.error('Error fetching stats:', error);
    });
}

function loadRecentComplaints() {
  if (!currentUser || !currentUser.id) return;
  
  fetch(`${API_ENDPOINTS.GET_COMPLAINTS_BY_STUDENT}?student_id=${currentUser.id}`)
    .then(response => response.json())
    .then(data => {
      const userComplaints = (data.complaints || []).slice(0, 5);
      const container = document.getElementById('recentComplaintsList');
      
      if (userComplaints.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 20px;">No complaints yet. Submit your first complaint!</p>';
        return;
      }
      
      container.innerHTML = userComplaints.map(complaint => `
        <div class="complaint-card">
          <div class="complaint-header">
            <span class="complaint-id">${complaint.complaintId}</span>
            <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
          </div>
          <div class="complaint-details">
            <div class="detail-item">
              <span class="detail-label">Location</span>
              <span class="detail-value">${complaint.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Category</span>
              <span class="detail-value">${complaint.category}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Submitted</span>
              <span class="detail-value">${formatDateTime(complaint.submittedAt)}</span>
            </div>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading complaints:', error);
    });
}

function showNewComplaint() {
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('newComplaint').style.display = 'block';
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item')[1].classList.add('active');
}

// Character counter for description
document.getElementById('description').addEventListener('input', function(e) {
  document.getElementById('charCount').textContent = e.target.value.length;
});

// Photo Upload Handler
function handlePhotoUpload(event) {
  const files = Array.from(event.target.files);
  
  if (uploadedImages.length + files.length > 3) {
    showToast('Maximum 3 images allowed', 'error');
    return;
  }
  
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      showToast(`${file.name} is too large. Maximum 5MB allowed.`, 'error');
      return;
    }
    
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast(`${file.name} is not a valid image format.`, 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImages.push(e.target.result);
      displayPhotoPreview();
    };
    reader.readAsDataURL(file);
  });
  
  event.target.value = '';
}

function displayPhotoPreview() {
  const container = document.getElementById('photoPreviewContainer');
  container.innerHTML = uploadedImages.map((img, index) => `
    <div class="photo-preview">
      <img src="${img}" alt="Preview ${index + 1}">
      <button type="button" class="photo-remove" onclick="removePhoto(${index})">×</button>
    </div>
  `).join('');
}

function removePhoto(index) {
  uploadedImages.splice(index, 1);
  displayPhotoPreview();
}

function clearComplaintForm() {
  document.getElementById('complaintForm').reset();
  uploadedImages = [];
  displayPhotoPreview();
  document.getElementById('charCount').textContent = '0';
}

// Complaint Form Submit
document.getElementById('complaintForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!currentUser || !currentUser.id) {
    showToast('Please login first', 'error');
    return;
  }

  const complaintData = {
    student_id: currentUser.id,
    student_name: currentUser.fullName,
    usn: currentUser.usn,
    room_number: document.getElementById('roomNumber').value.trim(),
    location: document.getElementById('location').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value.trim(),
    priority: document.getElementById('priority').value,
    images: uploadedImages
  };

  try {
    const response = await fetch(API_ENDPOINTS.CREATE_COMPLAINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(complaintData)
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById('generatedComplaintId').textContent = data.complaint_id;
      document.getElementById('successModal').style.display = 'flex';
      
      clearComplaintForm();
      updateDashboardStats();
    } else {
      showToast(data.message || 'Failed to submit complaint', 'error');
    }
  } catch (error) {
    console.error('Error submitting complaint:', error);
    showToast('Failed to connect to server', 'error');
  }
});

function closeSuccessModal() {
  document.getElementById('successModal').style.display = 'none';
}

function viewMyComplaints() {
  closeSuccessModal();
  showMyComplaints();
}

function showMyComplaints() {
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('myComplaints').style.display = 'block';
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item')[2].classList.add('active');
  
  filterComplaints();
}

function filterComplaints() {
  if (!currentUser || !currentUser.id) return;
  
  const statusFilter = document.getElementById('statusFilter').value;
  const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
  
  fetch(`${API_ENDPOINTS.GET_COMPLAINTS_BY_STUDENT}?student_id=${currentUser.id}`)
    .then(response => response.json())
    .then(data => {
      let filtered = data.complaints || [];
      
      if (statusFilter !== 'All') {
        filtered = filtered.filter(c => c.status === statusFilter);
      }
      
      if (searchFilter) {
        filtered = filtered.filter(c => 
          c.complaintId.toLowerCase().includes(searchFilter) ||
          c.roomNumber.toLowerCase().includes(searchFilter)
        );
      }
      
      const container = document.getElementById('complaintsListContainer');
      
      if (filtered.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 40px;">No complaints found.</p>';
        return;
      }
      
      container.innerHTML = filtered.map(complaint => `
        <div class="complaint-card">
          <div class="complaint-header">
            <span class="complaint-id">${complaint.complaintId}</span>
            <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
          </div>
          <div class="complaint-details">
            <div class="detail-item">
              <span class="detail-label">Room Number</span>
              <span class="detail-value">${complaint.roomNumber}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Location</span>
              <span class="detail-value">${complaint.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Category</span>
              <span class="detail-value">${complaint.category}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Priority</span>
              <span class="detail-value priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Submitted</span>
              <span class="detail-value">${formatDateTime(complaint.submittedAt)}</span>
            </div>
          </div>
          <button class="btn btn--outline btn--sm" style="margin-top: 12px;" onclick="viewComplaintDetails(${complaint.id})">View Details</button>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error filtering complaints:', error);
    });
}

function viewComplaintDetails(complaintId) {
  fetch(`${API_ENDPOINTS.GET_COMPLAINTS_BY_STUDENT}?student_id=${currentUser.id}`)
    .then(response => response.json())
    .then(data => {
      const complaint = (data.complaints || []).find(c => c.id === complaintId);
      if (!complaint) {
        showToast('Complaint not found', 'error');
        return;
      }
      
      const modalBody = document.getElementById('detailsModalBody');
      
      modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px;">${complaint.complaintId}</h4>
          <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div class="detail-item">
            <span class="detail-label">Room Number</span>
            <span class="detail-value">${complaint.roomNumber}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location</span>
            <span class="detail-value">${complaint.location}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category</span>
            <span class="detail-value">${complaint.category}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Priority</span>
            <span class="detail-value priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 8px; font-size: var(--font-size-base);">Description</h4>
          <p style="color: var(--color-text-secondary);">${complaint.description}</p>
        </div>
        
        ${complaint.images && complaint.images.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 12px; font-size: var(--font-size-base);">Photos</h4>
            <div class="image-gallery">
              ${complaint.images.map(img => `<img src="${img}" class="gallery-image" alt="Complaint photo">`).join('')}
            </div>
          </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px; font-size: var(--font-size-base);">Timeline</h4>
          <div class="timeline">
            ${(complaint.timeline || []).map(item => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-event">${item.event}</div>
                  <div class="timeline-time">${formatDateTime(item.timestamp)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${complaint.adminComments ? `
          <div>
            <h4 style="margin-bottom: 8px; font-size: var(--font-size-base);">Admin Comments</h4>
            <div style="background: var(--color-secondary); padding: 12px; border-radius: var(--radius-base); color: var(--color-text-secondary);">
              ${complaint.adminComments}
            </div>
          </div>
        ` : ''}
      `;
      
      document.getElementById('detailsModal').style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching complaint details:', error);
      showToast('Failed to load complaint details', 'error');
    });
}

function closeDetailsModal() {
  document.getElementById('detailsModal').style.display = 'none';
}

function showProfile() {
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('profile').style.display = 'block';
  
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.nav-item')[3].classList.add('active');
  
  loadProfile();
}

function loadProfile() {
  if (!currentUser) return;
  
  document.getElementById('profileName').textContent = currentUser.fullName;
  document.getElementById('profileUsn').textContent = currentUser.usn;
  document.getElementById('profileFullName').value = currentUser.fullName;
  document.getElementById('profileUsnInput').value = currentUser.usn;
  document.getElementById('profileEmail').value = currentUser.email;
  document.getElementById('profileContact').value = currentUser.contact || '';
  document.getElementById('profileDepartment').value = currentUser.department || '';
  document.getElementById('profileYear').value = currentUser.year || '';
  
  fetch(`${API_ENDPOINTS.GET_STATS}?student_id=${currentUser.id}`)
    .then(response => response.json())
    .then(stats => {
      document.getElementById('profileStatTotal').textContent = stats.total || 0;
      document.getElementById('profileStatResolved').textContent = stats.resolved || 0;
      document.getElementById('profileStatPending').textContent = (stats.open || 0) + (stats.in_progress || 0);
    })
    .catch(error => {
      console.error('Error fetching profile stats:', error);
    });
}

// Profile Form Submit
document.getElementById('profileForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!currentUser || !currentUser.id) return;

  const profileData = {
    id: currentUser.id,
    full_name: document.getElementById('profileFullName').value.trim(),
    contact: document.getElementById('profileContact').value.trim(),
    department: document.getElementById('profileDepartment').value.trim(),
    year: document.getElementById('profileYear').value.trim()
  };

  try {
    const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (data.success) {
      currentUser.fullName = profileData.full_name;
      currentUser.contact = profileData.contact;
      currentUser.department = profileData.department;
      currentUser.year = profileData.year;
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      document.getElementById('headerUserName').textContent = currentUser.fullName;
      document.getElementById('profileName').textContent = currentUser.fullName;
      
      showToast('Profile updated successfully!', 'success');
    } else {
      showToast(data.message || 'Failed to update profile', 'error');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('Failed to connect to server', 'error');
  }
});

// Change Password Form Submit
document.getElementById('changePasswordForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!currentUser || !currentUser.id) return;
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  
  if (newPassword !== confirmNewPassword) {
    showToast('New passwords do not match', 'error');
    return;
  }

  try {
    const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: currentUser.id,
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Password changed successfully!', 'success');
      document.getElementById('changePasswordForm').reset();
    } else {
      showToast(data.message || 'Failed to change password', 'error');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    showToast('Failed to connect to server', 'error');
  }
});

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('loginForm').reset();
  showToast('Logged out successfully', 'success');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('active');
}

// --- Admin Portal Functions ---
function showAdminDashboard() {
  // Hide all content sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('adminDashboard').style.display = 'block';

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  const adminNavItem = document.querySelector('.nav-item[data-role="admin"]');
  if (adminNavItem) {
    adminNavItem.classList.add('active');
  }

  // Update header for admin
  const headerTitle = document.querySelector('.dashboard-header h1');
  if (headerTitle) {
    headerTitle.textContent = 'Admin Dashboard';
  }
  document.getElementById('headerUserName').textContent = currentUser.fullName;
  document.getElementById('headerUserUsn').textContent = currentUser.usn;

  // Load admin statistics and complaints
  loadAdminStats();
  loadAllComplaints();
}

function refreshAdminDashboard() {
  showToast('Refreshing dashboard...', 'info');
  loadAdminStats();
  loadAllComplaints();
}

function loadAdminStats() {
  console.log('Loading admin stats from:', API_ENDPOINTS.GET_ALL_STATS);
  
  fetch(API_ENDPOINTS.GET_ALL_STATS, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    cache: 'no-cache'
  })
    .then(response => {
      console.log('Admin stats response status:', response.status);
      console.log('Admin stats response headers:', response.headers);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      console.log('Admin stats raw response:', text);
      try {
        const stats = JSON.parse(text);
        console.log('Admin stats parsed:', stats);
        
        // Update the stat cards with explicit type conversion and validation
        const totalEl = document.getElementById('adminStatTotal');
        const openEl = document.getElementById('adminStatOpen');
        const inProgressEl = document.getElementById('adminStatInProgress');
        const resolvedEl = document.getElementById('adminStatResolved');
        
        console.log('Elements found:', { totalEl, openEl, inProgressEl, resolvedEl });
        
        if (totalEl) {
          totalEl.textContent = String(parseInt(stats.total) || 0);
          console.log('Updated adminStatTotal to:', totalEl.textContent);
        }
        if (openEl) {
          openEl.textContent = String(parseInt(stats.open) || 0);
          console.log('Updated adminStatOpen to:', openEl.textContent);
        }
        if (inProgressEl) {
          inProgressEl.textContent = String(parseInt(stats.in_progress) || 0);
          console.log('Updated adminStatInProgress to:', inProgressEl.textContent);
        }
        if (resolvedEl) {
          resolvedEl.textContent = String(parseInt(stats.resolved) || 0);
          console.log('Updated adminStatResolved to:', resolvedEl.textContent);
        }
        
        showToast('Statistics updated successfully', 'success');
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response text was:', text);
        throw new Error('Failed to parse JSON response');
      }
    })
    .catch(error => {
      console.error('Error fetching admin stats:', error);
      console.error('Error details:', error.message, error.stack);
      showToast('Failed to load statistics: ' + error.message, 'error');
      
      // Set to 0 if there's an error
      const totalEl = document.getElementById('adminStatTotal');
      const openEl = document.getElementById('adminStatOpen');
      const inProgressEl = document.getElementById('adminStatInProgress');
      const resolvedEl = document.getElementById('adminStatResolved');
      
      if (totalEl) totalEl.textContent = '0';
      if (openEl) openEl.textContent = '0';
      if (inProgressEl) inProgressEl.textContent = '0';
      if (resolvedEl) resolvedEl.textContent = '0';
    });
}

let allComplaintsData = [];

function loadAllComplaints() {
  fetch(API_ENDPOINTS.GET_ALL_COMPLAINTS)
    .then(response => response.json())
    .then(data => {
      allComplaintsData = data.complaints || [];
      filterAdminComplaints();
    })
    .catch(error => {
      console.error('Error loading all complaints:', error);
      showToast('Failed to load complaints', 'error');
    });
}

function filterAdminComplaints() {
  const statusFilter = document.getElementById('adminStatusFilter').value;
  const searchFilter = document.getElementById('adminSearchFilter').value.toLowerCase();
  
  let filtered = allComplaintsData;
  
  if (statusFilter !== 'All') {
    filtered = filtered.filter(c => c.status === statusFilter);
  }
  
  if (searchFilter) {
    filtered = filtered.filter(c => 
      c.complaintId.toLowerCase().includes(searchFilter) ||
      c.usn.toLowerCase().includes(searchFilter) ||
      c.studentName.toLowerCase().includes(searchFilter)
    );
  }
  
  displayAdminComplaints(filtered);
}

function displayAdminComplaints(complaints) {
  const container = document.getElementById('adminComplaintsListContainer');
  
  if (complaints.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center; padding: 40px;">No complaints found.</p>';
    return;
  }
  
  container.innerHTML = complaints.map(complaint => `
    <div class="complaint-card" style="margin-bottom: 16px;">
      <div class="complaint-header">
        <div>
          <span class="complaint-id">${complaint.complaintId}</span>
          <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}" style="margin-left: 12px;">${complaint.status}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          ${complaint.status !== 'In Progress' ? `<button class="btn btn--outline btn--sm" onclick="updateComplaintStatus(${complaint.id}, 'In Progress')">Mark In-Process</button>` : ''}
          ${complaint.status !== 'Resolved' ? `<button class="btn btn--primary btn--sm" onclick="updateComplaintStatus(${complaint.id}, 'Resolved')">Mark Resolved</button>` : ''}
        </div>
      </div>
      
      <div class="complaint-details" style="margin-top: 12px;">
        <div class="detail-item">
          <span class="detail-label">Student</span>
          <span class="detail-value">${complaint.studentName}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">USN</span>
          <span class="detail-value">${complaint.usn}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Room Number</span>
          <span class="detail-value">${complaint.roomNumber}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${complaint.location}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Category</span>
          <span class="detail-value">${complaint.category}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Priority</span>
          <span class="detail-value priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Submitted</span>
          <span class="detail-value">${formatDateTime(complaint.submittedAt)}</span>
        </div>
      </div>
      
      <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border);">
        <div class="detail-label" style="margin-bottom: 6px;">Description:</div>
        <p style="color: var(--color-text-secondary); margin: 0;">${complaint.description}</p>
      </div>
      
      ${complaint.adminComments ? `
        <div style="margin-top: 12px; padding: 12px; background: var(--color-secondary); border-radius: var(--radius-base);">
          <div class="detail-label" style="margin-bottom: 6px;">Admin Comments:</div>
          <p style="color: var(--color-text-secondary); margin: 0;">${complaint.adminComments}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 12px;">
        <button class="btn btn--outline btn--sm" onclick="viewComplaintDetailsAdmin(${complaint.id})">View Full Details</button>
      </div>
    </div>
  `).join('');
}

function updateComplaintStatus(complaintId, newStatus) {
  if (!confirm(`Are you sure you want to mark this complaint as "${newStatus}"?`)) {
    return;
  }
  
  fetch(API_ENDPOINTS.UPDATE_STATUS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: complaintId,
      status: newStatus
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(`Status updated to ${newStatus}`, 'success');
      // Reload admin stats and complaints
      loadAdminStats();
      loadAllComplaints();
    } else {
      showToast(data.message || 'Failed to update status', 'error');
    }
  })
  .catch(error => {
    console.error('Error updating status:', error);
    showToast('Failed to connect to server', 'error');
  });
}

// Admin view complaint details
function viewComplaintDetailsAdmin(complaintId) {
  fetch(API_ENDPOINTS.GET_ALL_COMPLAINTS)
    .then(response => response.json())
    .then(data => {
      const complaint = (data.complaints || []).find(c => c.id === complaintId);
      if (!complaint) {
        showToast('Complaint not found', 'error');
        return;
      }
      
      const modalBody = document.getElementById('detailsModalBody');
      
      modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px;">${complaint.complaintId}</h4>
          <span class="status-badge status-${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
          <div class="detail-item">
            <span class="detail-label">Student</span>
            <span class="detail-value">${complaint.studentName} (${complaint.usn})</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Room Number</span>
            <span class="detail-value">${complaint.roomNumber}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location</span>
            <span class="detail-value">${complaint.location}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Category</span>
            <span class="detail-value">${complaint.category}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Priority</span>
            <span class="detail-value priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 8px; font-size: var(--font-size-base);">Description</h4>
          <p style="color: var(--color-text-secondary);">${complaint.description}</p>
        </div>
        
        ${complaint.images && complaint.images.length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 12px; font-size: var(--font-size-base);">Photos</h4>
            <div class="image-gallery">
              ${complaint.images.map(img => `<img src="${img}" class="gallery-image" alt="Complaint photo">`).join('')}
            </div>
          </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px; font-size: var(--font-size-base);">Timeline</h4>
          <div class="timeline">
            ${(complaint.timeline || []).map(item => `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div class="timeline-event">${item.event}</div>
                  <div class="timeline-time">${formatDateTime(item.timestamp)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${complaint.adminComments ? `
          <div>
            <h4 style="margin-bottom: 8px; font-size: var(--font-size-base);">Admin Comments</h4>
            <div style="background: var(--color-secondary); padding: 12px; border-radius: var(--radius-base); color: var(--color-text-secondary);">
              ${complaint.adminComments}
            </div>
          </div>
        ` : ''}
      `;
      
      document.getElementById('detailsModal').style.display = 'flex';
    })
    .catch(error => {
      console.error('Error fetching complaint details:', error);
      showToast('Failed to load complaint details', 'error');
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Session Restoration - Check if user is already logged in on page load
window.addEventListener('DOMContentLoaded', function() {
  if (currentUser && currentUser.id) {
    console.log('Restoring session for user:', currentUser.fullName);
    
    // Hide all login pages
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminLoginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    
    // Show dashboard
    document.getElementById('dashboard').style.display = 'block';
    
    // Initialize dashboard based on user role
    initializeDashboard();
    
    if (currentUser.role === 'admin') {
      // Restore admin dashboard
      showAdminDashboard();
    } else {
      // Restore student dashboard
      loadDashboard();
    }
    
    showToast('Welcome back, ' + currentUser.fullName + '!', 'success');
  } else {
    // No session found, show login page
    console.log('No active session found');
    document.getElementById('loginPage').style.display = 'flex';
  }
});