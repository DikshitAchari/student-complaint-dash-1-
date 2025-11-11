// In-memory data storage
let users = [
  {
    id: 1,
    fullName: 'Rahul Kumar',
    usn: '4NI21CS101',
    email: 'rahul.kumar@college.edu.in',
    password: 'password123',
    emailVerified: true,
    role: 'student',
    department: 'Computer Science',
    year: '3rd Year',
    contact: '+91 98765 43210'
  },
  {
    id: 2,
    fullName: 'Priya Sharma',
    usn: '4NI21EC045',
    email: 'priya.sharma@college.edu.in',
    password: 'pass456',
    emailVerified: true,
    role: 'student',
    department: 'Electronics',
    year: '2nd Year',
    contact: '+91 98765 43211'
  }
  ,{
    id: 3,
    fullName: 'Admin User',
    usn: 'ADMIN01',
    email: 'admin@college.edu.in',
    password: 'admin123',
    emailVerified: true,
    role: 'admin',
    department: '',
    year: '',
    contact: ''
  }
];

let complaints = [
  {
    id: 1,
    complaintId: 'CMP-20251109-0001',
    studentId: 1,
    studentName: 'Rahul Kumar',
    usn: '4NI21CS101',
    roomNumber: 'A-305',
    location: 'Hostel Block A',
    category: 'Electrical Issue',
    description: 'The ceiling fan in room A-305 is not working. It stopped working yesterday evening. Please fix it as soon as possible as the room gets very hot.',
    priority: 'High',
    status: 'In Progress',
    submittedAt: '2025-11-08T10:30:00',
    updatedAt: '2025-11-08T14:20:00',
    images: [],
    timeline: [
      { event: 'Complaint Submitted', timestamp: '2025-11-08T10:30:00' },
      { event: 'Viewed by Admin', timestamp: '2025-11-08T11:15:00' },
      { event: 'Status changed to In Progress', timestamp: '2025-11-08T14:20:00' }
    ],
    adminComments: 'Electrician has been assigned. Work will be completed by tomorrow.'
  },
  {
    id: 2,
    complaintId: 'CMP-20251109-0002',
    studentId: 1,
    studentName: 'Rahul Kumar',
    usn: '4NI21CS101',
    roomNumber: 'A-305',
    location: 'Hostel Block A',
    category: 'Internet/WiFi',
    description: 'WiFi connection is very slow in my room. Speed drops to almost zero after 8 PM. Unable to attend online classes properly.',
    priority: 'Medium',
    status: 'Open',
    submittedAt: '2025-11-07T09:15:00',
    updatedAt: '2025-11-07T09:15:00',
    images: [],
    timeline: [
      { event: 'Complaint Submitted', timestamp: '2025-11-07T09:15:00' }
    ],
    adminComments: null
  },
  {
    id: 3,
    complaintId: 'CMP-20251106-0015',
    studentId: 2,
    studentName: 'Priya Sharma',
    usn: '4NI21EC045',
    roomNumber: 'B-201',
    location: 'Hostel Block B',
    category: 'Plumbing/Water',
    description: 'Washroom tap is leaking continuously. Water is being wasted and floor is always wet.',
    priority: 'High',
    status: 'Resolved',
    submittedAt: '2025-11-06T08:45:00',
    updatedAt: '2025-11-07T16:30:00',
    images: [],
    timeline: [
      { event: 'Complaint Submitted', timestamp: '2025-11-06T08:45:00' },
      { event: 'Viewed by Admin', timestamp: '2025-11-06T09:30:00' },
      { event: 'Status changed to In Progress', timestamp: '2025-11-06T10:00:00' },
      { event: 'Status changed to Resolved', timestamp: '2025-11-07T16:30:00' }
    ],
    adminComments: 'Plumber fixed the leaking tap. Issue resolved.'
  },
  {
    id: 4,
    complaintId: 'CMP-20251105-0023',
    studentId: 1,
    studentName: 'Rahul Kumar',
    usn: '4NI21CS101',
    roomNumber: 'Lab-2A',
    location: 'Laboratory',
    category: 'Furniture Damage',
    description: 'Chair number 15 in Computer Lab 2A is broken. The backrest is completely detached and cannot be used safely.',
    priority: 'Low',
    status: 'Closed',
    submittedAt: '2025-11-05T11:20:00',
    updatedAt: '2025-11-06T15:45:00',
    images: [],
    timeline: [
      { event: 'Complaint Submitted', timestamp: '2025-11-05T11:20:00' },
      { event: 'Viewed by Admin', timestamp: '2025-11-05T14:00:00' },
      { event: 'Status changed to In Progress', timestamp: '2025-11-05T15:30:00' },
      { event: 'Status changed to Resolved', timestamp: '2025-11-06T10:00:00' },
      { event: 'Status changed to Closed', timestamp: '2025-11-06T15:45:00' }
    ],
    adminComments: 'Chair has been replaced with a new one.'
  },
  {
    id: 5,
    complaintId: 'CMP-20251104-0008',
    studentId: 2,
    studentName: 'Priya Sharma',
    usn: '4NI21EC045',
    roomNumber: 'N/A',
    location: 'Cafeteria',
    category: 'Cleanliness',
    description: 'Tables in the cafeteria are not cleaned properly after lunch hours. Food particles and spills remain on tables.',
    priority: 'Medium',
    status: 'In Progress',
    submittedAt: '2025-11-04T13:45:00',
    updatedAt: '2025-11-05T09:00:00',
    images: [],
    timeline: [
      { event: 'Complaint Submitted', timestamp: '2025-11-04T13:45:00' },
      { event: 'Viewed by Admin', timestamp: '2025-11-04T15:20:00' },
      { event: 'Status changed to In Progress', timestamp: '2025-11-05T09:00:00' }
    ],
    adminComments: 'Additional cleaning staff assigned during lunch hours.'
  }
];

let currentUser = null;
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
  document.getElementById('loginPage').style.display = 'flex';
  document.getElementById('registerPage').style.display = 'none';
}

function showRegister() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('registerPage').style.display = 'flex';
}

function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const usn = document.getElementById('loginUsn').value.trim();
  const password = document.getElementById('loginPassword').value;

  const user = users.find(u => u.usn === usn && u.password === password);
  
  if (user) {
    currentUser = user;
    showToast('Login successful!', 'success');
    setTimeout(() => {
      document.getElementById('loginPage').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      // Route based on role
      if (currentUser.role === 'admin') {
        showAdminDashboard();
      } else {
        loadDashboard();
      }
    }, 500);
  } else {
    showToast('Invalid USN or password', 'error');
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
document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('regFullName').value.trim();
  const usn = document.getElementById('regUsn').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const termsAccepted = document.getElementById('termsCheckbox').checked;

  if (!termsAccepted) {
    showToast('Please accept the terms and conditions', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  if (users.find(u => u.usn === usn)) {
    showToast('USN already registered', 'error');
    return;
  }

  if (users.find(u => u.email === email)) {
    showToast('Email already registered', 'error');
    return;
  }

  const newUser = {
    id: users.length + 1,
    fullName,
    usn,
    email,
    password,
    emailVerified: true,
    role: document.getElementById('regRole') ? document.getElementById('regRole').value : 'student',
    department: '',
    year: '',
    contact: ''
  };

  users.push(newUser);
  showToast('Registration successful! Please login.', 'success');
  
  setTimeout(() => {
    showLogin();
    document.getElementById('registerForm').reset();
  }, 1500);
});

// Dashboard Functions
function loadDashboard() {
  document.getElementById('headerUserName').textContent = currentUser.fullName;
  document.getElementById('headerUserUsn').textContent = currentUser.usn;
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
  
  // Update statistics
  updateDashboardStats();
  loadRecentComplaints();
}

function updateDashboardStats() {
  const userComplaints = complaints.filter(c => c.studentId === currentUser.id);
  
  document.getElementById('statTotal').textContent = userComplaints.length;
  document.getElementById('statOpen').textContent = userComplaints.filter(c => c.status === 'Open').length;
  document.getElementById('statInProgress').textContent = userComplaints.filter(c => c.status === 'In Progress').length;
  document.getElementById('statResolved').textContent = userComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
}

function loadRecentComplaints() {
  const userComplaints = complaints
    .filter(c => c.studentId === currentUser.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);
  
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
document.getElementById('complaintForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const newComplaint = {
    id: complaints.length + 1,
    complaintId: generateComplaintId(),
    studentId: currentUser.id,
    studentName: currentUser.fullName,
    usn: currentUser.usn,
    roomNumber: document.getElementById('roomNumber').value.trim(),
    location: document.getElementById('location').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value.trim(),
    priority: document.getElementById('priority').value,
    status: 'Open',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    images: [...uploadedImages],
    timeline: [
      {
        event: 'Complaint Submitted',
        timestamp: new Date().toISOString()
      }
    ],
    adminComments: null
  };
  
  complaints.push(newComplaint);
  
  document.getElementById('generatedComplaintId').textContent = newComplaint.complaintId;
  document.getElementById('successModal').style.display = 'flex';
  
  clearComplaintForm();
  updateDashboardStats();
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
  const statusFilter = document.getElementById('statusFilter').value;
  const searchFilter = document.getElementById('searchFilter').value.toLowerCase();
  
  let filtered = complaints.filter(c => c.studentId === currentUser.id);
  
  if (statusFilter !== 'All') {
    filtered = filtered.filter(c => c.status === statusFilter);
  }
  
  if (searchFilter) {
    filtered = filtered.filter(c => 
      c.complaintId.toLowerCase().includes(searchFilter) ||
      c.roomNumber.toLowerCase().includes(searchFilter)
    );
  }
  
  filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  
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
}

function viewComplaintDetails(complaintId) {
  const complaint = complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
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
        ${complaint.timeline.map(item => `
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
  document.getElementById('profileName').textContent = currentUser.fullName;
  document.getElementById('profileUsn').textContent = currentUser.usn;
  document.getElementById('profileFullName').value = currentUser.fullName;
  document.getElementById('profileUsnInput').value = currentUser.usn;
  document.getElementById('profileEmail').value = currentUser.email;
  document.getElementById('profileContact').value = currentUser.contact || '';
  document.getElementById('profileDepartment').value = currentUser.department || '';
  document.getElementById('profileYear').value = currentUser.year || '';
  
  const userComplaints = complaints.filter(c => c.studentId === currentUser.id);
  document.getElementById('profileStatTotal').textContent = userComplaints.length;
  document.getElementById('profileStatResolved').textContent = userComplaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  document.getElementById('profileStatPending').textContent = userComplaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
}

// Profile Form Submit
document.getElementById('profileForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  currentUser.fullName = document.getElementById('profileFullName').value.trim();
  currentUser.contact = document.getElementById('profileContact').value.trim();
  currentUser.department = document.getElementById('profileDepartment').value.trim();
  currentUser.year = document.getElementById('profileYear').value.trim();
  
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = {...currentUser};
  }
  
  document.getElementById('headerUserName').textContent = currentUser.fullName;
  document.getElementById('profileName').textContent = currentUser.fullName;
  
  showToast('Profile updated successfully!', 'success');
});

// Change Password Form Submit
document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;
  
  if (currentPassword !== currentUser.password) {
    showToast('Current password is incorrect', 'error');
    return;
  }
  
  if (newPassword !== confirmNewPassword) {
    showToast('New passwords do not match', 'error');
    return;
  }
  
  currentUser.password = newPassword;
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex].password = newPassword;
  }
  
  showToast('Password changed successfully!', 'success');
  document.getElementById('changePasswordForm').reset();
});

function logout() {
  currentUser = null;
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
  // Hide student sections and show admin dashboard
  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });
  document.getElementById('adminDashboard').style.display = 'block';

  // Update header
  document.getElementById('headerUserName').textContent = currentUser.fullName;
  document.getElementById('headerUserUsn').textContent = currentUser.usn;

  // Load complaints for admin
  loadAdminComplaints();
}

function loadAdminComplaints() {
  const container = document.getElementById('adminComplaintsContainer');
  if (!container) return;

  if (complaints.length === 0) {
    container.innerHTML = '<p style="color: var(--color-text-secondary);">No complaints submitted yet.</p>';
    return;
  }

  // Render table
  const rows = complaints.map(c => {
    const adminComment = c.adminComments ? c.adminComments : '';
    return `
      <div class="complaint-card" style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${c.complaintId}</strong> — ${c.studentName} (${c.usn})
            <div style="color: var(--color-text-secondary); font-size: 13px;">${c.location} • ${c.category} • ${formatDateTime(c.submittedAt)}</div>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <select onchange="changeComplaintStatus(${c.id}, this)" style="padding:6px; border-radius:6px;">
              <option value="Open" ${c.status === 'Open' ? 'selected' : ''}>Open</option>
              <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
              <option value="Closed" ${c.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
          </div>
        </div>
        <div style="margin-top:10px;">
          <div style="margin-bottom:8px; color: var(--color-text-secondary);">${c.description}</div>
          <textarea id="adminCommentInput-${c.id}" rows="2" style="width:100%; padding:8px; border-radius:6px; border:1px solid var(--color-border);">${adminComment}</textarea>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
            <button class="btn btn--outline btn--sm" onclick="viewComplaintDetails(${c.id})">View</button>
            <button class="btn btn--primary btn--sm" onclick="saveAdminComment(${c.id})">Save Comment</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = rows;
}

function changeComplaintStatus(id, selectEl) {
  const complaint = complaints.find(c => c.id === id);
  if (!complaint) return;
  const prev = complaint.status;
  complaint.status = selectEl.value;
  complaint.updatedAt = new Date().toISOString();
  complaint.timeline.push({ event: `Status changed to ${complaint.status}`, timestamp: complaint.updatedAt });
  showToast(`Status updated: ${prev} → ${complaint.status}`, 'success');
  // refresh admin list
  loadAdminComplaints();
}

function saveAdminComment(id) {
  const input = document.getElementById(`adminCommentInput-${id}`);
  if (!input) return;
  const complaint = complaints.find(c => c.id === id);
  if (!complaint) return;
  complaint.adminComments = input.value.trim() || null;
  complaint.updatedAt = new Date().toISOString();
  complaint.timeline.push({ event: 'Admin commented', timestamp: complaint.updatedAt });
  showToast('Admin comment saved', 'success');
  loadAdminComplaints();
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});