// Login Page JavaScript for ElectroMart

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('password-toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Fill demo account credentials
function fillDemoAccount(role) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    switch (role) {
        case 'customer':
            emailField.value = 'customer@example.com';
            break;
        case 'seller':
            emailField.value = 'seller@example.com';
            break;
        case 'admin':
            emailField.value = 'admin@example.com';
            break;
    }
    
    passwordField.value = 'password123';
    
    // Show notification
    showNotification(`Demo ${role} account credentials filled!`, 'info');
}

// Enhanced login form handler
function handleLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitButton.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        if (validateLoginForm(email, password)) {
            if (login(email, password)) {
                // Save remember me preference
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Redirect based on user role
                setTimeout(() => {
                    if (isAdmin()) {
                        window.location.href = 'dashboard/admin.html';
                    } else if (isSeller()) {
                        window.location.href = 'dashboard/seller.html';
                    } else {
                        window.location.href = 'dashboard/customer.html';
                    }
                }, 1000);
            }
        }
        
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 1000);
}

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('login.html')) {
        initializeLoginPage();
    }
});

// Initialize login page functionality
function initializeLoginPage() {
    // Check for remembered email
    const rememberMe = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    
    if (rememberMe === 'true' && rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('remember-me').checked = true;
    }
    
    // Check if user is already logged in
    if (isLoggedIn()) {
        showNotification('You are already logged in!', 'info');
        setTimeout(() => {
            if (isAdmin()) {
                window.location.href = 'dashboard/admin.html';
            } else if (isSeller()) {
                window.location.href = 'dashboard/seller.html';
            } else {
                window.location.href = 'dashboard/customer.html';
            }
        }, 2000);
    }
    
    // Setup form validation
    setupFormValidation();
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Real-time email validation
    emailInput.addEventListener('blur', function() {
        validateEmailField(this);
    });
    
    // Real-time password validation
    passwordInput.addEventListener('blur', function() {
        validatePasswordField(this);
    });
    
    // Form submission validation
    form.addEventListener('submit', function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });
}

// Validate email field
function validateEmailField(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showFieldError(field, 'Email is required');
        return false;
    } else if (!emailRegex.test(email)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

// Validate password field
function validatePasswordField(field) {
    const password = field.value;
    
    if (!password) {
        showFieldError(field, 'Password is required');
        return false;
    } else if (password.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters');
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('is-invalid');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    // Insert error message after field
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate entire form
function validateForm() {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    const isEmailValid = validateEmailField(emailField);
    const isPasswordValid = validatePasswordField(passwordField);
    
    return isEmailValid && isPasswordValid;
}

// Handle forgot password
function handleForgotPassword() {
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        showNotification('Please enter your email address first.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate password reset
    showNotification('Password reset link sent to your email!', 'success');
    
    // In a real application, this would send an email
    setTimeout(() => {
        showNotification('Check your email for password reset instructions.', 'info');
    }, 2000);
}

// Export functions for use in other files
window.Login = {
    togglePassword,
    fillDemoAccount,
    handleLoginForm,
    validateEmailField,
    validatePasswordField,
    showFieldError,
    clearFieldError,
    validateForm,
    handleForgotPassword
}; 