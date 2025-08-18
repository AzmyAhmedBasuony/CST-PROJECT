// Register Page JavaScript for TECHHORA

// Toggle password visibility
function togglePassword(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(fieldId === 'password' ? 'password-toggle-icon' : 'confirm-password-toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// Check password strength
function checkPasswordStrength(password) {
    const strengthElement = document.getElementById('password-strength');
    if (!strengthElement) return;
    
    let strength = 0;
    let feedback = '';
    
    // Check length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Check for different character types
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Determine strength level
    let strengthClass = '';
    let strengthText = '';
    
    if (strength <= 2) {
        strengthClass = 'text-danger';
        strengthText = 'Weak';
    } else if (strength <= 4) {
        strengthClass = 'text-warning';
        strengthText = 'Fair';
    } else if (strength <= 5) {
        strengthClass = 'text-info';
        strengthText = 'Good';
    } else {
        strengthClass = 'text-success';
        strengthText = 'Strong';
    }
    
    // Create strength indicator
    const strengthBar = '█'.repeat(strength) + '░'.repeat(6 - strength);
    strengthElement.innerHTML = `
        <div class="password-strength-indicator">
            <small class="${strengthClass}">${strengthText}: ${strengthBar}</small>
        </div>
    `;
    
    return strength;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmField = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(confirmField, 'Passwords do not match');
        return false;
    } else {
        clearFieldError(confirmField);
        return true;
    }
}

// Show/hide seller fields based on role selection
function toggleSellerFields() {
    const roleSelect = document.getElementById('role');
    const sellerFields = document.getElementById('seller-fields');
    
    if (roleSelect.value === 'seller') {
        sellerFields.style.display = 'block';
        document.getElementById('storeName').required = true;
    } else {
        sellerFields.style.display = 'none';
        document.getElementById('storeName').required = false;
    }
}

// Enhanced registration form handler
function handleRegistrationForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        role: document.getElementById('role').value,
        storeName: document.getElementById('storeName').value.trim(),
        newsletter: document.getElementById('newsletter').checked
    };
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitButton.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        if (validateRegistrationForm(formData)) {
            if (register(formData)) {
                // Redirect based on user role
                setTimeout(() => {
                    if (formData.role === 'admin') {
                        window.location.href = 'dashboard/admin.html';
                    } else if (formData.role === 'seller') {
                        window.location.href = 'dashboard/seller.html';
                    } else {
                        window.location.href = '/index.html';
                    }
                }, 1000);
            }
        }
        
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 1000);
}

// Initialize register page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('register.html')) {
        initializeRegisterPage();
    }
});

// Initialize register page functionality
function initializeRegisterPage() {
    // Check if user is already logged in
    if (isLoggedIn()) {
        showNotification('You are already logged in!', 'info');
        setTimeout(() => {
            if (isAdmin()) {
                window.location.href = 'dashboard/admin.html';
            } else if (isSeller()) {
                window.location.href = 'dashboard/seller.html';
            } else {
                window.location.href = '/index.html';
            }
        }, 2000);
    }
    
    // Setup form validation
    setupRegisterFormValidation();
}

// Setup register form validation
function setupRegisterFormValidation() {
    const form = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const roleSelect = document.getElementById('role');
    
    // Real-time password strength checking
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
    
    // Real-time password match validation
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    // Role selection handler
    roleSelect.addEventListener('change', function() {
        toggleSellerFields();
    });
    
    // Real-time field validation
    const fields = ['name', 'email', 'phone', 'address'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        }
    });
    
    // Form submission validation
    form.addEventListener('submit', function(event) {
        if (!validateRegisterForm()) {
            event.preventDefault();
        }
    });
}

// Validate individual field
function validateField(field) {
    const fieldType = field.type;
    const value = field.value.trim();
    
    switch (fieldType) {
        case 'text':
            if (field.id === 'name') {
                if (!value) {
                    showFieldError(field, 'Name is required');
                    return false;
                } else if (value.length < 2) {
                    showFieldError(field, 'Name must be at least 2 characters');
                    return false;
                } else {
                    clearFieldError(field);
                    return true;
                }
            }
            break;
            
        case 'email':
            if (!value) {
                showFieldError(field, 'Email is required');
                return false;
            } else if (!isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            } else {
                clearFieldError(field);
                return true;
            }
            
            
            
        case 'tel':
            if (!value) {
                showFieldError(field, 'Phone number is required');
                return false;
            } else if (!isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            } else {
                clearFieldError(field);
                return true;
            }
            
            
        default:
            if (!value) {
                showFieldError(field, 'This field is required');
                return false;
            } else {
                clearFieldError(field);
                return true;
            }
    }
}

// Validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^(\+20|0)?[1-9][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
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

// Validate entire registration form
function validateRegisterForm() {
    const fields = ['name', 'email', 'password', 'confirmPassword', 'phone', 'address', 'role'];
    let isValid = true;
    
    // Validate all required fields
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate password strength
    const password = document.getElementById('password').value;
    const strength = checkPasswordStrength(password);
    if (strength < 3) {
        showNotification('Password is too weak. Please choose a stronger password.', 'error');
        isValid = false;
    }
    
    // Validate password match
    if (!validatePasswordMatch()) {
        isValid = false;
    }
    
    // Validate terms acceptance
    const termsCheckbox = document.getElementById('terms');
    if (!termsCheckbox.checked) {
        showNotification('Please accept the Terms of Service and Privacy Policy.', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Export functions for use in other files
window.Register = {
    togglePassword,
    checkPasswordStrength,
    validatePasswordMatch,
    toggleSellerFields,
    handleRegistrationForm,
    validateField,
    isValidPhone,
    showFieldError,
    clearFieldError,
    validateRegisterForm
}; 