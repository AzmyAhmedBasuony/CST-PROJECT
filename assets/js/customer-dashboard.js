document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('customer.html')) {
        initializeCustomerDashboard();
    }
});

function initializeCustomerDashboard() {
    // Check if user is logged in and is a customer
    if (!isLoggedIn() || !isCustomer()) {
        showNotification('Access denied. Please login as a customer.', 'error');
        setTimeout(() => {
            window.location.href = '../../pages/login.html';
        }, 2000);
        return;
    }

    loadCustomerData();
    updateDashboardStats();
    loadOrders();
    loadProfile();
    loadWishlist();
}

function loadCustomerData() {
    // Load customer orders from the 'orders' key (same as checkout)
    customerOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Load wishlist
    wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
}

function updateDashboardStats() {
    const totalOrdersElement = document.getElementById('total-orders');
    const completedOrdersElement = document.getElementById('completed-orders');
    const pendingOrdersElement = document.getElementById('pending-orders');
    const totalSpentElement = document.getElementById('total-spent');
    const userNameElement = document.getElementById('user-name');
    
    if (totalOrdersElement) totalOrdersElement.textContent = customerOrders.length;
    
    const completedOrders = customerOrders.filter(order => order.status === 'completed').length;
    if (completedOrdersElement) completedOrdersElement.textContent = completedOrders;
    
    const pendingOrders = customerOrders.filter(order => order.status === 'pending').length;
    if (pendingOrdersElement) pendingOrdersElement.textContent = pendingOrders;
    
    const totalSpent = customerOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);
    if (totalSpentElement) totalSpentElement.textContent = `$${totalSpent.toFixed(2)}`;
    
    // Update user name
    const currentUser = getCurrentUser();
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }
}

function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    if (customerOrders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No orders yet</h5>
                <p class="text-muted">Start shopping to see your orders here!</p>
                <a href="../../pages/catalog.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    container.innerHTML = customerOrders.map(order => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6 class="mb-1">Order #${order.id}</h6>
                        <small class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="col-md-3">
                        <span class="badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                    <div class="col-md-3">
                        <strong>$${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        ${order.items.length} item(s) • Shipped to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.zipCode}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
}

function filterOrders(status) {
    let filteredOrders = customerOrders;
    if (status !== 'all') {
        filteredOrders = customerOrders.filter(order => order.status === status);
    }
    
    const container = document.getElementById('orders-container');
    if (!container) return;

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No ${status === 'all' ? '' : status} orders found</h5>
                <p class="text-muted">Try adjusting your filter or start shopping!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredOrders.map(order => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6 class="mb-1">Order #${order.id}</h6>
                        <small class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="col-md-3">
                        <span class="badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                    <div class="col-md-3">
                        <strong>$${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
                <div class="mt-3">
                    <small class="text-muted">
                        ${order.items.length} item(s) • Shipped to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.zipCode}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
}

function viewOrderDetails(orderId) {
    const order = customerOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Order not found.', 'error');
        return;
    }

    // Generate items list for display
    const itemsList = order.items.map(item => `
        ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
    `).join('<br>');

    showNotification(`
        Order #${order.id}<br>
        Status: ${order.status}<br>
        Items:<br>${itemsList}<br>
        Total: $${order.total.toFixed(2)}<br>
        Shipped to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.zipCode}
    `, 'info');
}

function loadProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-phone').textContent = currentUser.phone || 'Not provided';
    document.getElementById('profile-address').textContent = currentUser.address || 'Not provided';
    document.getElementById('profile-joined').textContent = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A';
    document.getElementById('profile-orders').textContent = customerOrders.length;
    
    const totalSpent = customerOrders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);
    document.getElementById('profile-spent').textContent = `$${totalSpent.toFixed(2)}`;
}

function showEditProfileModal() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    document.getElementById('edit-name').value = currentUser.name;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-phone').value = currentUser.phone || '';
    document.getElementById('edit-address').value = currentUser.address || '';
    
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function saveProfile() {
    const formData = {
        name: document.getElementById('edit-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        phone: document.getElementById('edit-phone').value.trim(),
        address: document.getElementById('edit-address').value.trim()
    };

    // Validation
    if (!formData.name || !formData.email) {
        showNotification('Please fill all required fields.', 'error');
        return;
    }

    // Update current user
    const currentUser = getCurrentUser();
    Object.assign(currentUser, formData);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...formData };
        localStorage.setItem('users', JSON.stringify(users));
    }

    showNotification('Profile updated successfully!', 'success');
    
    // Reload profile data
    loadProfile();
    initializeCustomerDashboard();
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    modal.hide();

}

function loadWishlist() {
    const container = document.getElementById('wishlist-container');
    if (!container) return;

    if (wishlistItems.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-heart fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Your wishlist is empty</h5>
                <p class="text-muted">Add products to your wishlist while shopping!</p>
                <a href="../../pages/catalog.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlistItems.map(item => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image || 'https://via.placeholder.com/60'}" 
                             alt="${item.name}" class="img-thumbnail" style="width: 60px; height: 60px;">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.category}</small>
                    </div>
                    <div class="col-md-2">
                        <strong>$${item.price}</strong>
                    </div>
                    <div class="col-md-2">
                        <span class="badge bg-secondary">${item.rating} ⭐</span>
                    </div>
                    <div class="col-md-2 text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="addToCartFromWishlist(${item.id})">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="removeFromWishlist(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCartFromWishlist(productId) {
    const product = wishlistItems.find(item => item.id === productId);
    if (!product) {
        showNotification('Product not found in wishlist.', 'error');
        return;
    }

    addToCart(productId, 1);
    showNotification('Product added to cart!', 'success');
}

function removeFromWishlist(productId) {
    if (!confirm('Are you sure you want to remove this item from your wishlist?')) {
        return;
    }

    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    
    showNotification('Item removed from wishlist!', 'success');
    loadWishlist();
}

function logout() {
    Auth.logout();
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1000);
}

window.CustomerDashboard = {
    initializeCustomerDashboard, loadCustomerData, updateDashboardStats, loadOrders,
    filterOrders, viewOrderDetails, loadProfile, showEditProfileModal, saveProfile,
    loadWishlist, addToCartFromWishlist, removeFromWishlist, logout
};