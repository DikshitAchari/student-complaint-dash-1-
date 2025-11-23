// Test frontend registration
const data = {
    full_name: "Frontend Test User",
    usn: "FRONTEND01",
    email: "frontend@example.com",
    password: "password123",
    role: "student"
};

fetch('http://localhost:8000/backend/api/auth/register.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
.then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    return response.text();
})
.then(text => {
    console.log('Response text:', text);
    try {
        const data = JSON.parse(text);
        console.log('Parsed JSON:', data);
    } catch (e) {
        console.error('Failed to parse JSON:', e);
        console.log('Raw response:', text);
    }
})
.catch(error => {
    console.error('Fetch error:', error);
});