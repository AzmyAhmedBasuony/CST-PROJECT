// Admin Panel JavaScript for TECHHORA
let allUsers = [];
let allProducts = [];
let supportTickets = [];
let currentEditingUser = null;
let currentTicket = null;
let userGrowthChart = null;
let revenueChart = null;

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initializeAdminPanel();
    }
});

function initializeAdminPanel() {
    // Check if user is logged in and is an admin
    if (!isLoggedIn()) {
        showNotification('Access denied. Please login as an admin.', 'error');
        setTimeout(() => {
            window.location.href = '../../pages/login.html';
        }, 2000);
        return;
    }
    
    if (!isAdmin()) {
        showNotification('Access denied. Please login as an admin.', 'error');
        setTimeout(() => {
            window.location.href = '../../pages/login.html';
        }, 2000);
        return;
    }

    loadAdminData();
    setupEventListeners();
    updateDashboardStats();
    loadUsersTable();
    loadProductsTable();
    loadTicketsTable();
    loadContactsTable();
    initializeCharts();
}

function loadAdminData() {
    // Load all users
    allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Load all products
    allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Load support tickets (simulate tickets for demo)
    supportTickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    if (supportTickets.length === 0) {
        // Create sample tickets for demo
        supportTickets = [
            {
                id: 'TKT001',
                customer: 'John Customer',
                customerEmail: 'customer@example.com',
                subject: 'Order not received',
                message: 'I placed an order 5 days ago but haven\'t received it yet.',
                priority: 'high',
                status: 'open',
                createdAt: '2025-01-15',
                category: 'order_issue'
            },
            {
                id: 'TKT002',
                customer: 'Jane Smith',
                customerEmail: 'jane@example.com',
                subject: 'Product quality issue',
                message: 'The product I received is damaged and not as described.',
                priority: 'medium',
                status: 'resolved',
                createdAt: '2025-01-14',
                category: 'product_issue'
            },
            {
                id: 'TKT003',
                customer: 'Mike Johnson',
                customerEmail: 'mike@example.com',
                subject: 'Payment problem',
                message: 'I was charged twice for the same order.',
                priority: 'high',
                status: 'open',
                createdAt: '2025-01-13',
                category: 'payment_issue'
            }
        ];
        localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
    }
}

function setupEventListeners() {
    // User search
    document.getElementById('user-search').addEventListener('input', function() {
        filterUsers(this.value);
    });

    // Tab change events
    document.getElementById('analytics-tab').addEventListener('click', function() {
        setTimeout(() => {
            updateCharts();
        }, 100);
    });
}

function updateDashboardStats() {
    const totalUsersElement = document.getElementById('total-users');
    const totalProductsElement = document.getElementById('total-products');
    const pendingReviewsElement = document.getElementById('pending-reviews');
    const totalSellersElement = document.getElementById('total-sellers');
    const userNameElement = document.getElementById('user-name');
    
    if (totalUsersElement) totalUsersElement.textContent = allUsers.length;
    if (totalProductsElement) totalProductsElement.textContent = allProducts.length;
    
    const pendingReviews = allProducts.filter(product => !product.approved && !product.rejected).length;
    if (pendingReviewsElement) pendingReviewsElement.textContent = pendingReviews;
    
    const activeSellers = allUsers.filter(user => user.role === 'seller' && user.status !== 'suspended').length;
    if (totalSellersElement) totalSellersElement.textContent = activeSellers;
    
    // Update user name
    const currentUser = getCurrentUser();
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }
}

function loadUsersTable() {
    const tbody = document.getElementById('users-table');
    tbody.innerHTML = '';

    allUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'seller' ? 'bg-warning' : 'bg-primary'}">
                    ${(user.role || 'customer').charAt(0).toUpperCase() + (user.role || 'customer').slice(1)}
                </span>
            </td>
            <td>
                <span class="badge ${(user.status || 'active') === 'active' ? 'bg-success' : (user.status || 'active') === 'suspended' ? 'bg-danger' : 'bg-warning'}">
                    ${(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" onclick="viewUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadProductsTable() {
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = '';

    allProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.image || 'https://via.placeholder.com/40'}" 
                         alt="${product.name}" class="img-thumbnail me-2" style="width: 40px; height: 40px;">
                    <div>
                        <strong>${product.name}</strong>
                        <br><small class="text-muted">${product.description.substring(0, 50)}...</small>
                    </div>
                </div>
            </td>
            <td>${product.seller || 'Unknown'}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>$${product.price}</td>
            <td>
                <span class="badge ${product.approved ? 'bg-success' : product.rejected ? 'bg-danger' : 'bg-warning'}">
                    ${product.approved ? 'Approved' : product.rejected ? 'Rejected' : 'Pending'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" onclick="approveProduct(${product.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="rejectProduct(${product.id})">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadTicketsTable() {
    const tbody = document.getElementById('tickets-table');
    tbody.innerHTML = '';

    supportTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.customer}</td>
            <td>${ticket.subject}</td>
            <td>
                <span class="badge ${ticket.priority === 'high' ? 'bg-danger' : ticket.priority === 'medium' ? 'bg-warning' : 'bg-info'}">
                    ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
            </td>
            <td>
                <span class="badge ${ticket.status === 'resolved' ? 'bg-success' : 'bg-warning'}">
                    ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
            </td>
            <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-outline-info btn-sm" onclick="viewTicketDetails('${ticket.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterUsers(searchTerm) {
    const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const tbody = document.getElementById('users-table');
    tbody.innerHTML = '';

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'seller' ? 'bg-warning' : 'bg-primary'}">
                    ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
            </td>
            <td>
                <span class="badge ${user.status === 'active' ? 'bg-success' : user.status === 'suspended' ? 'bg-danger' : 'bg-warning'}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" onclick="viewUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-primary" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterProducts(status) {
    let filteredProducts = allProducts;
    if (status !== 'all') {
        if (status === 'pending') {
            filteredProducts = allProducts.filter(product => !product.approved && !product.rejected);
        } else if (status === 'approved') {
            filteredProducts = allProducts.filter(product => product.approved);
        } else if (status === 'rejected') {
            filteredProducts = allProducts.filter(product => product.rejected);
        }
    }
    
    const tbody = document.getElementById('products-table');
    tbody.innerHTML = '';

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.image || 'https://via.placeholder.com/40'}" 
                         alt="${product.name}" class="img-thumbnail me-2" style="width: 40px; height: 40px;">
                    <div>
                        <strong>${product.name}</strong>
                        <br><small class="text-muted">${product.description.substring(0, 50)}...</small>
                    </div>
                </div>
            </td>
            <td>${product.seller || 'Unknown'}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>$${product.price}</td>
            <td>
                <span class="badge ${product.approved ? 'bg-success' : product.rejected ? 'bg-danger' : 'bg-warning'}">
                    ${product.approved ? 'Approved' : product.rejected ? 'Rejected' : 'Pending'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" onclick="approveProduct(${product.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="rejectProduct(${product.id})">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="btn btn-outline-info" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterTickets(status) {
    let filteredTickets = supportTickets;
    if (status !== 'all') {
        filteredTickets = supportTickets.filter(ticket => ticket.status === status);
    }
    
    const tbody = document.getElementById('tickets-table');
    tbody.innerHTML = '';

    filteredTickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${ticket.id}</strong></td>
            <td>${ticket.customer}</td>
            <td>${ticket.subject}</td>
            <td>
                <span class="badge ${ticket.priority === 'high' ? 'bg-danger' : ticket.priority === 'medium' ? 'bg-warning' : 'bg-info'}">
                    ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
            </td>
            <td>
                <span class="badge ${ticket.status === 'resolved' ? 'bg-success' : 'bg-warning'}">
                    ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
            </td>
            <td>${new Date(ticket.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-outline-info btn-sm" onclick="viewTicketDetails('${ticket.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAddUserModal() {
    currentEditingUser = null;
    document.getElementById('userModalTitle').textContent = 'Add New User';
    document.getElementById('user-form').reset();
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        showNotification('User not found.', 'error');
        return;
    }

    currentEditingUser = user;
    document.getElementById('userModalTitle').textContent = 'Edit User';
    
    // Fill form with user data
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-password').value = user.password;
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-phone').value = user.phone || '';
    document.getElementById('user-address').value = user.address || '';
    document.getElementById('user-status').value = user.status || 'active';
    document.getElementById('user-verified').checked = user.verified || false;
    
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

function saveUser() {
    const formData = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        password: document.getElementById('user-password').value,
        role: document.getElementById('user-role').value,
        phone: document.getElementById('user-phone').value,
        address: document.getElementById('user-address').value,
        status: document.getElementById('user-status').value,
        verified: document.getElementById('user-verified').checked
    };

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
        showNotification('Please fill all required fields.', 'error');
        return;
    }

    if (currentEditingUser) {
        // Update existing user
        Object.assign(currentEditingUser, formData);
        const userIndex = allUsers.findIndex(u => u.id === currentEditingUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = currentEditingUser;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }
        showNotification('User updated successfully!', 'success');
    } else {
        // Add new user
        const newUser = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString()
        };
        
        allUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(allUsers));
        
        showNotification('User added successfully!', 'success');
    }

    // Reload data
    loadAdminData();
    updateDashboardStats();
    loadUsersTable();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('userModal'));
    modal.hide();
}

function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    const updatedUsers = allUsers.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    showNotification('User deleted successfully!', 'success');
    
    // Reload data
    loadAdminData();
    updateDashboardStats();
    loadUsersTable();
}

function viewUserDetails(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
        showNotification('User not found.', 'error');
        return;
    }

    const modalBody = document.getElementById('user-details');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>User Information</h6>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> 
                    <span class="badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'seller' ? 'bg-warning' : 'bg-primary'}">
                        ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                </p>
                <p><strong>Status:</strong> 
                    <span class="badge ${user.status === 'active' ? 'bg-success' : user.status === 'suspended' ? 'bg-danger' : 'bg-warning'}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </p>
            </div>
            <div class="col-md-6">
                <h6>Contact Information</h6>
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${user.address || 'N/A'}</p>
                <p><strong>Email Verified:</strong> ${user.verified ? 'Yes' : 'No'}</p>
                <p><strong>Joined:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    modal.show();
}

function resetUserPassword() {
    if (!confirm('Are you sure you want to reset this user\'s password?')) {
        return;
    }

    // Generate a random password
    const newPassword = Math.random().toString(36).slice(-8);
    
    // In a real application, you would send this password to the user's email
    showNotification(`Password reset successfully! New password: ${newPassword}`, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
    modal.hide();
}

function approveProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found.', 'error');
        return;
    }

    product.approved = true;
    product.rejected = false;
    product.moderationDate = new Date().toISOString();
    
    localStorage.setItem('products', JSON.stringify(allProducts));
    showNotification('Product approved successfully!', 'success');
    
    // Reload data
    loadAdminData();
    updateDashboardStats();
    loadProductsTable();
}

function rejectProduct(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found.', 'error');
        return;
    }

    product.approved = false;
    product.rejected = true;
    product.moderationDate = new Date().toISOString();
    
    localStorage.setItem('products', JSON.stringify(allProducts));
    showNotification('Product rejected successfully!', 'success');
    
    // Reload data
    loadAdminData();
    updateDashboardStats();
    loadProductsTable();
}

function viewProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found.', 'error');
        return;
    }

    showNotification(`Product: ${product.name} - Price: $${product.price} - Status: ${product.approved ? 'Approved' : product.rejected ? 'Rejected' : 'Pending'}`, 'info');
}

function viewTicketDetails(ticketId) {
    const ticket = supportTickets.find(t => t.id === ticketId);
    if (!ticket) {
        showNotification('Ticket not found.', 'error');
        return;
    }

    currentTicket = ticket;
    const modalBody = document.getElementById('ticket-details');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Ticket Information</h6>
                <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                <p><strong>Subject:</strong> ${ticket.subject}</p>
                <p><strong>Priority:</strong> 
                    <span class="badge ${ticket.priority === 'high' ? 'bg-danger' : ticket.priority === 'medium' ? 'bg-warning' : 'bg-info'}">
                        ${ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                </p>
                <p><strong>Status:</strong> 
                    <span class="badge ${ticket.status === 'resolved' ? 'bg-success' : 'bg-warning'}">
                        ${ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                </p>
                <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="col-md-6">
                <h6>Customer Information</h6>
                <p><strong>Name:</strong> ${ticket.customer}</p>
                <p><strong>Email:</strong> ${ticket.customerEmail}</p>
                <p><strong>Category:</strong> ${ticket.category.replace('_', ' ').charAt(0).toUpperCase() + ticket.category.replace('_', ' ').slice(1)}</p>
            </div>
        </div>
        <hr>
        <h6>Message</h6>
        <div class="alert alert-info">
            ${ticket.message}
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('ticketModal'));
    modal.show();
}

function resolveTicket() {
    if (!currentTicket) {
        showNotification('No ticket selected.', 'error');
        return;
    }

    currentTicket.status = 'resolved';
    currentTicket.resolvedAt = new Date().toISOString();
    
    localStorage.setItem('supportTickets', JSON.stringify(supportTickets));
    showNotification('Ticket resolved successfully!', 'success');
    
    // Reload data
    loadAdminData();
    updateDashboardStats();
    loadTicketsTable();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('ticketModal'));
    modal.hide();
}

function initializeCharts() {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart');
    if (userGrowthCtx) {
        userGrowthChart = new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'New Users',
                    data: [50, 80, 120, 150, 200, 250],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [5000, 8000, 12000, 15000, 20000, 25000],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function updateCharts() {
    // Update charts with real data
    if (userGrowthChart) {
        const monthlyUsers = calculateMonthlyUsers();
        userGrowthChart.data.datasets[0].data = monthlyUsers;
        userGrowthChart.update();
    }

    if (revenueChart) {
        const monthlyRevenue = calculateMonthlyRevenue();
        revenueChart.data.datasets[0].data = monthlyRevenue;
        revenueChart.update();
    }

    // Update system overview
    updateSystemOverview();
}

function calculateMonthlyUsers() {
    // Calculate user growth for last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(() => Math.floor(Math.random() * 200) + 50);
}

function calculateMonthlyRevenue() {
    // Calculate revenue for last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(() => Math.floor(Math.random() * 20000) + 5000);
}

function updateSystemOverview() {
    document.getElementById('active-users').textContent = allUsers.filter(u => u.status === 'active').length;
    document.getElementById('total-orders').textContent = '1,234'; // Mock data
    document.getElementById('avg-rating').textContent = '4.5'; // Mock data
    document.getElementById('conversion-rate').textContent = '3.2%'; // Mock data
}

function logout() {
    Auth.logout();
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1000);
}

// Contact Form Management Functions
let currentContact = null;

function loadContactsTable() {
    const tbody = document.getElementById('contacts-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const contacts = getAllContactSubmissions();
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        const formattedContact = formatContactSubmission(contact);
        
        row.innerHTML = `
            <td>${formattedContact.name}</td>
            <td>${formattedContact.email}</td>
            <td>${formattedContact.subject}</td>
            <td>
                <span class="badge ${formattedContact.status === 'new' ? 'bg-warning' : 
                    formattedContact.status === 'in-progress' ? 'bg-info' : 'bg-success'}">
                    ${formattedContact.status.charAt(0).toUpperCase() + formattedContact.status.slice(1)}
                </span>
            </td>
            <td>${formattedContact.createdAt}</td>
            <td>
                <span class="badge ${formattedContact.newsletter === 'Yes' ? 'bg-success' : 'bg-secondary'}">
                    ${formattedContact.newsletter}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" onclick="viewContactDetails(${contact.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteContact(${contact.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterContacts(status) {
    const contacts = filterContactSubmissions(status);
    const tbody = document.getElementById('contacts-table');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    contacts.forEach(contact => {
        const row = document.createElement('tr');
        const formattedContact = formatContactSubmission(contact);
        
        row.innerHTML = `
            <td>${formattedContact.name}</td>
            <td>${formattedContact.email}</td>
            <td>${formattedContact.subject}</td>
            <td>
                <span class="badge ${formattedContact.status === 'new' ? 'bg-warning' : 
                    formattedContact.status === 'in-progress' ? 'bg-info' : 'bg-success'}">
                    ${formattedContact.status.charAt(0).toUpperCase() + formattedContact.status.slice(1)}
                </span>
            </td>
            <td>${formattedContact.createdAt}</td>
            <td>
                <span class="badge ${formattedContact.newsletter === 'Yes' ? 'bg-success' : 'bg-secondary'}">
                    ${formattedContact.newsletter}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" onclick="viewContactDetails(${contact.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteContact(${contact.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewContactDetails(contactId) {
    const contact = getContactSubmissionById(contactId);
    if (!contact) {
        showNotification('Contact submission not found.', 'error');
        return;
    }
    
    currentContact = contact;
    const modal = document.getElementById('contact-details');
    
    modal.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Contact Information</h6>
                <p><strong>Name:</strong> ${contact.firstName} ${contact.lastName}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Subject:</strong> ${contact.subject}</p>
                <p><strong>Newsletter:</strong> ${contact.newsletter ? 'Yes' : 'No'}</p>
                <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> 
                    <span class="badge ${contact.status === 'new' ? 'bg-warning' : 
                        contact.status === 'in-progress' ? 'bg-info' : 'bg-success'}">
                        ${contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                </p>
            </div>
            <div class="col-md-6">
                <h6>Message</h6>
                <div class="border rounded p-3 bg-light">
                    <p>${contact.message}</p>
                </div>
            </div>
        </div>
    `;
    
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
    contactModal.show();
}

function updateContactStatus(status) {
    if (!currentContact) {
        showNotification('No contact selected.', 'error');
        return;
    }
    
    if (updateContactSubmissionStatus(currentContact.id, status)) {
        showNotification(`Contact status updated to ${status}.`, 'success');
        loadContactsTable();
        const contactModal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
        contactModal.hide();
    } else {
        showNotification('Failed to update contact status.', 'error');
    }
}

function deleteContact(contactId) {
    if (confirm('Are you sure you want to delete this contact submission?')) {
        deleteContactSubmission(contactId);
        showNotification('Contact submission deleted successfully.', 'success');
        loadContactsTable();
    }
}

window.AdminPanel = {
    initializeAdminPanel, loadAdminData, updateDashboardStats, loadUsersTable,
    loadProductsTable, loadTicketsTable, loadContactsTable, filterUsers, filterProducts, 
    filterTickets, filterContacts, showAddUserModal, editUser, saveUser, deleteUser, 
    viewUserDetails, resetUserPassword, approveProduct, rejectProduct, viewProductDetails, 
    viewTicketDetails, viewContactDetails, resolveTicket, updateContactStatus, deleteContact,
    initializeCharts, updateCharts, logout
}; 