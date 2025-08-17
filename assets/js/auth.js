// Authentication JavaScript for ElectroMart

// Sample users for demonstration
const sampleUsers = [
    {
        id: 1,
        name: "John Customer",
        email: "customer@example.com",
        password: "password123",
        role: "customer",
        phone: "+1-555-0123",
        address: "123 Main St, City, State 12345",
        status: "active",
        createdAt: "2025-01-01T00:00:00.000Z",
        verified: true
    },
    {
        id: 2,
        name: "Sarah Seller",
        email: "seller@example.com",
        password: "password123",
        role: "seller",
        phone: "+1-555-0456",
        address: "456 Business Ave, City, State 12345",
        storeName: "Tech Haven",
        status: "active",
        createdAt: "2025-01-02T00:00:00.000Z",
        verified: true
    },
    {
        id: 3,
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
        phone: "+1-555-0789",
        address: "789 Admin Blvd, City, State 12345",
        status: "active",
        createdAt: "2025-01-03T00:00:00.000Z",
        verified: true
    }
];

// Initialize users in localStorage if not exists
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    } else {
        // Ensure existing users have required fields
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = existingUsers.map(user => ({
            ...user,
            status: user.status || 'active',
            createdAt: user.createdAt || new Date().toISOString(),
            verified: user.verified !== undefined ? user.verified : true
        }));
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
}

// Initialize users on load
initializeUsers();

// Login function
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        // Update global currentUser if it exists
        if (typeof currentUser !== 'undefined') {
            currentUser = userWithoutPassword;
        }
        
        updateUserInterface();
        showNotification('Login successful!', 'success');
        return true;
    } else {
        showNotification('Invalid email or password.', 'error');
        return false;
    }
}

// Register function
function register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        showNotification('Email already registered.', 'error');
        return false;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        ...userData,
        role: userData.role || 'customer',
        status: 'active',
        createdAt: new Date().toISOString(),
        verified: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const { password, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    // Update global currentUser if it exists
    if (typeof currentUser !== 'undefined') {
        currentUser = userWithoutPassword;
    }
    
    updateUserInterface();
    
    showNotification('Registration successful! Welcome to ElectroMart!', 'success');
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    
    // Update global currentUser if it exists
    if (typeof currentUser !== 'undefined') {
        currentUser = null;
    }
    
    updateUserInterface();
    showNotification('Logged out successfully.', 'info');
    
    // Redirect to home page based on current page
    setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('dashboard/')) {
            window.location.href = '../../index.html';
        } else if (currentPath.includes('pages/')) {
            window.location.href = '../index.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 1000);
}

// Check if user is logged in
function isLoggedIn() {
    const userData = localStorage.getItem('currentUser');
    return userData !== null;
}

// Check user role
function hasRole(role) {
    const userData = localStorage.getItem('currentUser');
    if (!userData) return false;
    const user = JSON.parse(userData);
    return user && user.role === role;
}

// Check if user is admin
function isAdmin() {
    return hasRole('admin');
}

// Check if user is seller
function isSeller() {
    return hasRole('seller');
}

// Check if user is customer
function isCustomer() {
    return hasRole('customer');
}

// Get current user
function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Update user profile
function updateProfile(updatedData) {
    if (!currentUser) {
        showNotification('Please login to update your profile.', 'error');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Update user data
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user
        const { password, ...userWithoutPassword } = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        // Update global currentUser if it exists
        if (typeof currentUser !== 'undefined') {
            currentUser = userWithoutPassword;
        }
        
        showNotification('Profile updated successfully!', 'success');
        return true;
    }
    
    showNotification('Failed to update profile.', 'error');
    return false;
}

// Change password
function changePassword(currentPassword, newPassword) {
    if (!currentUser) {
        showNotification('Please login to change your password.', 'error');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1 && users[userIndex].password === currentPassword) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        showNotification('Password changed successfully!', 'success');
        return true;
    }
    
    showNotification('Current password is incorrect.', 'error');
    return false;
}

// Get all users (admin only)
function getAllUsers() {
    if (!isAdmin()) {
        showNotification('Access denied. Admin privileges required.', 'error');
        return [];
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
}

// Delete user (admin only)
function deleteUser(userId) {
    if (!isAdmin()) {
        showNotification('Access denied. Admin privileges required.', 'error');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length < users.length) {
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        showNotification('User deleted successfully.', 'success');
        return true;
    }
    
    showNotification('User not found.', 'error');
    return false;
}

// Reset user password (admin only)
function resetUserPassword(userId, newPassword) {
    if (!isAdmin()) {
        showNotification('Access denied. Admin privileges required.', 'error');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('Password reset successfully.', 'success');
        return true;
    }
    
    showNotification('User not found.', 'error');
    return false;
}

// Validate login form
function validateLoginForm(email, password) {
    if (!email || !password) {
        showNotification('Please fill in all fields.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

// Validate registration form
function validateRegistrationForm(userData) {
    const { name, email, password, confirmPassword, phone } = userData;
    
    
    if (!name || !email || !password || !confirmPassword || !phone) {
        showNotification('Please fill in all fields.', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long.', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return false;
    }
    
    return true;
}

// Handle login form submission
function handleLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (validateLoginForm(email, password)) {
        if (login(email, password)) {
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
}

// Handle registration form submission
function handleRegistrationForm(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        role: document.getElementById('role')?.value || 'customer'
    };
    
    if (validateRegistrationForm(userData)) {
        if (register(userData)) {
            // Redirect based on user role
            setTimeout(() => {
                if (userData.role === 'admin') {
                    window.location.href = 'dashboard/admin.html';
                } else if (userData.role === 'seller') {
                    window.location.href = 'dashboard/seller.html';
                } else {
                    window.location.href = 'dashboard/customer.html';
                }
            }, 1000);
        }
    }
}

// Export functions for use in other files
window.Auth = {
    login,
    register,
    logout,
    isLoggedIn,
    hasRole,
    isAdmin,
    isSeller,
    isCustomer,
    getCurrentUser,
    updateProfile,
    changePassword,
    getAllUsers,
    deleteUser,
    resetUserPassword,
    validateLoginForm,
    validateRegistrationForm,
    handleLoginForm,
    handleRegistrationForm
}; 