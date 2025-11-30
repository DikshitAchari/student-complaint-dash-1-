// Forgot Password Functions
document.addEventListener('DOMContentLoaded', function() {
    // Setup OTP inputs
    setupOTPInputs();
    
    // Password strength indicator
    const newPasswordInput = document.getElementById('newPassword');
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
    }
    
    // Forgot Password Email Form
    const forgotPasswordEmailForm = document.getElementById('forgotPasswordEmailForm');
    if (forgotPasswordEmailForm) {
        forgotPasswordEmailForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotPasswordEmail').value;
            
            console.log('Sending request to:', API_ENDPOINTS.RESET_PASSWORD);
            console.log('Request data:', { action: 'send_reset_otp', email: email });
            
            try {
                const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ action: 'send_reset_otp', email: email })
                });

                console.log('Response status:', response.status);
                console.log('Response headers:', [...response.headers.entries()]);
                
                const data = await response.json();
                console.log('Response data:', data);

                if (data.success) {
                    showToast(data.message, 'success');
                    document.getElementById('userEmailDisplay').textContent = email;
                    showForgotPasswordStep(2);
                } else {
                    showToast(data.message || 'Failed to send reset code.', 'error');
                }
            } catch (error) {
                console.error('Error details:', error);
                showToast('Failed to connect to the server. Please check your internet connection and try again.', 'error');
            }
        });
    }
    
    // OTP Verification Form
    const otpVerificationForm = document.getElementById('otpVerificationForm');
    if (otpVerificationForm) {
        otpVerificationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get email from the first step
            const email = document.getElementById('forgotPasswordEmail').value;
            
            // Get OTP from the input fields
            const otpInputs = document.querySelectorAll('.otp-input');
            let otp = '';
            otpInputs.forEach(input => {
                otp += input.value;
            });
            
            if (otp.length !== 6) {
                showToast('Please enter a valid 6-digit code', 'error');
                return;
            }
            
            try {
                const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'verify_otp',
                        email: email,
                        otp: otp
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showForgotPasswordStep(3);
                } else {
                    showToast(data.message || 'Invalid verification code', 'error');
                }
            } catch (error) {
                showToast('Failed to connect to the server.', 'error');
            }
        });
    }
    
    // Reset Password Form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmNewPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            // Get email from the first step
            const email = document.getElementById('forgotPasswordEmail').value;
            
            // Get OTP from the input fields
            const otpInputs = document.querySelectorAll('.otp-input');
            let otp = '';
            otpInputs.forEach(input => {
                otp += input.value;
            });
            
            try {
                const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        action: 'reset_password',
                        email: email,
                        otp: otp,
                        new_password: newPassword
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showToast(data.message, 'success');
                    // Hide all steps and show success message
                    document.querySelectorAll('.forgot-password-step').forEach(step => {
                        step.style.display = 'none';
                    });
                    document.getElementById('forgotPasswordSuccess').style.display = 'block';
                } else {
                    showToast(data.message || 'Failed to reset password.', 'error');
                }
            } catch (error) {
                showToast('Failed to connect to the server.', 'error');
            }
        });
    }
});

// Show specific step of the forgot password process
function showForgotPasswordStep(step) {
    // Hide all steps
    document.querySelectorAll('.forgot-password-step').forEach(step => {
        step.style.display = 'none';
    });
    document.getElementById('forgotPasswordSuccess').style.display = 'none';
    
    // Show the requested step
    switch(step) {
        case 1:
            document.getElementById('forgotPasswordStep1').style.display = 'block';
            break;
        case 2:
            document.getElementById('forgotPasswordStep2').style.display = 'block';
            break;
        case 3:
            document.getElementById('forgotPasswordStep3').style.display = 'block';
            break;
    }
}

// OTP Input Navigation
function setupOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            const currentInput = input;
            const nextInput = input.nextElementSibling;
            const prevInput = input.previousElementSibling;
            
            if (currentInput.value.length > 1) {
                currentInput.value = "";
                return;
            }
            
            if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
                nextInput.removeAttribute("disabled");
                nextInput.focus();
            }
            
            if (e.key === "Backspace") {
                if (prevInput) {
                    currentInput.value = "";
                    prevInput.focus();
                }
            } else if (nextInput && currentInput.value) {
                nextInput.focus();
            }
        });
    });
}

// Password Strength Indicator
function updatePasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const strengthBar = document.getElementById('resetPasswordStrength');
    
    if (password.length === 0) {
        strengthBar.innerHTML = '';
        return;
    }
    
    let strength = 'weak';
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
        strength = 'strong';
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'medium';
    }
    
    strengthBar.innerHTML = `<div class="password-strength-bar password-strength-${strength}"></div>`;
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Resend OTP function
async function resendForgotPasswordOTP() {
    const email = document.getElementById('forgotPasswordEmail').value;
    
    try {
        const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'send_reset_otp', email: email })
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message, 'success');
        } else {
            showToast(data.message || 'Failed to resend verification code.', 'error');
        }
    } catch (error) {
        showToast('Failed to connect to the server.', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show toast-${type}`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}