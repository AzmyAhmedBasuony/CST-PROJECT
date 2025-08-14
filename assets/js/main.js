// Main JavaScript for ElectroMart E-commerce

// Global variables
let currentUser = null;
let products = [];
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize application
function initializeApp() {
    loadUserFromStorage();
    loadProductsFromStorage();
    loadCartFromStorage();
    updateCartCount();
    loadFeaturedProducts();
    setupEventListeners();
}

// Load user data from localStorage
function loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUserInterface();
    }
}

// Load products from localStorage
function loadProductsFromStorage() {
    const productsData = localStorage.getItem('products');
    if (productsData) {
        products = JSON.parse(productsData);
    } else {
        // Initialize with sample products if none exist
        initializeSampleProducts();
    }
}

// Initialize sample products
function initializeSampleProducts() {
    products = [
        {
            id: 1,
            name: "iPhone 15 Pro",
            category: "smartphones",
            price: 999.99,
            description: "Latest iPhone with advanced camera system and A17 Pro chip",
            image: "assets/images/iphone15.jpg",
            rating: 4.8,
            stock: 50,
            seller: "Apple Store",
            featured: true
        },
        {
            id: 2,
            name: "MacBook Pro 16\"",
            category: "laptops",
            price: 2499.99,
            description: "Powerful laptop for professionals with M3 Pro chip",
            image: "assets/images/macbook-pro.jpg",
            rating: 4.9,
            stock: 25,
            seller: "Apple Store",
            featured: true
        },
        {
            id: 3,
            name: "Sony WH-1000XM5",
            category: "audio",
            price: 399.99,
            description: "Premium noise-cancelling headphones with exceptional sound quality",
            image: "assets/images/sony-headphones.jpg",
            rating: 4.7,
            stock: 100,
            seller: "Sony Electronics",
            featured: true
        },
        {
            id: 4,
            name: "Samsung Galaxy S24",
            category: "smartphones",
            price: 899.99,
            description: "Android flagship with AI features and excellent camera",
            image: "assets/images/samsung-s24.jpg",
            rating: 4.6,
            stock: 75,
            seller: "Samsung Store",
            featured: true
        },
        {
            id: 5,
            name: "Dell XPS 13",
            category: "laptops",
            price: 1299.99,
            description: "Ultra-thin laptop with InfinityEdge display",
            image: "assets/images/dell-xps.jpg",
            rating: 4.5,
            stock: 30,
            seller: "Dell Store",
            featured: false
        },
        {
            id: 6,
            name: "Bose QuietComfort 45",
            category: "audio",
            price: 329.99,
            description: "Comfortable headphones with world-class noise cancellation",
            image: "assets/images/bose-headphones.jpg",
            rating: 4.4,
            stock: 60,
            seller: "Bose Store",
            featured: false
        },
        {
            id: 7,
            name: "Google Nest Hub",
            category: "smart-home",
            price: 99.99,
            description: "Smart display with Google Assistant for your home",
            image: "assets/images/nest-hub.jpg",
            rating: 4.3,
            stock: 200,
            seller: "Google Store",
            featured: true
        },
        {
            id: 8,
            name: "Amazon Echo Dot",
            category: "smart-home",
            price: 49.99,
            description: "Smart speaker with Alexa voice assistant",
            image: "assets/images/echo-dot.jpg",
            rating: 4.2,
            stock: 150,
            seller: "Amazon Store",
            featured: false
        },
        {
            id: 9,
            name: "LG OLED C3 55\"",
            category: "televisions",
            price: 1799.99,
            description: "Stunning 4K OLED TV with perfect blacks and vibrant colors",
            image: "assets/images/lg-oled.jpg",
            rating: 4.7,
            stock: 40,
            seller: "LG Store",
            featured: true
        },
        {
            id: 10,
            name: "ASUS ROG Strix",
            category: "laptops",
            price: 1899.99,
            description: "High-performance gaming laptop with RTX 4080",
            image: "assets/images/asus-rog.jpg",
            rating: 4.6,
            stock: 20,
            seller: "ASUS Store",
            featured: true
        },
        {
            id: 11,
            name: "JBL Charge 5",
            category: "audio",
            price: 149.99,
            description: "Portable Bluetooth speaker with powerful sound",
            image: "assets/images/jbl-charge5.jpg",
            rating: 4.5,
            stock: 80,
            seller: "JBL Store",
            featured: false
        },
        {
            id: 12,
            name: "OnePlus 12",
            category: "smartphones",
            price: 799.99,
            description: "Flagship killer with fast charging and smooth display",
            image: "assets/images/oneplus12.jpg",
            rating: 4.4,
            stock: 60,
            seller: "OnePlus Store",
            featured: true
        },
        {
            id: 13,
            name: "Lenovo Legion 5",
            category: "laptops",
            price: 1299.99,
            description: "Gaming laptop with AMD Ryzen 7 and RTX 3060",
            image: "assets/images/lenovo-legion.jpg",
            rating: 4.3,
            stock: 35,
            seller: "Lenovo Store",
            featured: false
        },
        {
            id: 14,
            name: "Sony PlayStation 5",
            category: "gaming",
            price: 499.99,
            description: "Next-gen console with ultra-fast SSD and 4K gaming",
            image: "assets/images/ps5.jpg",
            rating: 4.8,
            stock: 30,
            seller: "Sony Store",
            featured: true
        },
        {
            id: 15,
            name: "Microsoft Surface Pro 9",
            category: "tablets",
            price: 1099.99,
            description: "2-in-1 tablet with detachable keyboard and great performance",
            image: "assets/images/surface-pro.jpg",
            rating: 4.6,
            stock: 45,
            seller: "Microsoft Store",
            featured: true
        }
    ];
    saveProductsToStorage();
}

// Save products to localStorage
function saveProductsToStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Load featured products on homepage
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    const featuredProducts = products.filter(product => product.featured);
    const productsToShow = featuredProducts.slice(0, 4); // Show only 4 featured products

    featuredContainer.innerHTML = productsToShow.map(product => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description.substring(0, 60)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <small class="text-muted">(${product.rating})</small>
                    </div>
                    <div class="product-price mb-3">$${product.price.toFixed(2)}</div>
                    <div class="mt-auto">
                        <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="pages/product.html?id=${product.id}" class="btn btn-outline-primary w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('footer .input-group');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscription);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.card-title').textContent.toLowerCase();
        const productDesc = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.closest('.col-lg-3, .col-md-6').style.display = 'block';
        } else {
            card.closest('.col-lg-3, .col-md-6').style.display = 'none';
        }
    });
}

// Handle newsletter subscription
function handleNewsletterSubscription(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    
    if (email && isValidEmail(email)) {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        event.target.querySelector('input').value = '';
    } else {
        showNotification('Please enter a valid email address.', 'error');
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Update user interface based on login status
function updateUserInterface() {
    const userDropdown = document.getElementById('userDropdown');
    const cartCount = document.querySelector('.cart-count');
    
    if (currentUser && userDropdown) {
        // Update dropdown text
        userDropdown.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        
        // Show cart count for customers
        if (cartCount && isCustomer()) {
            cartCount.style.display = 'inline';
        }
        
        // Update navigation based on role
        updateNavigationByRole();
    } else if (userDropdown) {
        // Reset dropdown text
        userDropdown.innerHTML = `<i class="fas fa-user"></i> Account`;
        
        // Hide cart count
        if (cartCount) {
            cartCount.style.display = 'none';
        }
        
        // Reset navigation
        resetNavigation();
    }
}

// Get correct path for navigation
function getDashboardPath(page) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('dashboard/')) {
        return `../${page}`;
    } else if (currentPath.includes('pages/')) {
        return `dashboard/${page}`;
    } else {
        return `pages/dashboard/${page}`;
    }
}

// Update navigation based on user role
function updateNavigationByRole() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!dropdownMenu) return;
    
    // Clear existing items
    dropdownMenu.innerHTML = '';
    
    // Add logout option
    const logoutItem = document.createElement('li');
    logoutItem.innerHTML = '<a class="dropdown-item" href="#" onclick="logout()">Logout</a>';
    dropdownMenu.appendChild(logoutItem);
    
    // Add role-specific options
    if (isAdmin()) {
        const adminItem = document.createElement('li');
        adminItem.innerHTML = `<a class="dropdown-item" href="${getDashboardPath('admin.html')}">Admin Panel</a>`;
        dropdownMenu.appendChild(adminItem);
    }
    
    if (isSeller()) {
        const sellerItem = document.createElement('li');
        sellerItem.innerHTML = `<a class="dropdown-item" href="${getDashboardPath('seller.html')}">Seller Dashboard</a>`;
        dropdownMenu.appendChild(sellerItem);
    }
    
    if (isCustomer()) {
        const customerItem = document.createElement('li');
        customerItem.innerHTML = `<a class="dropdown-item" href="${getDashboardPath('customer.html')}">My Dashboard</a>`;
        dropdownMenu.appendChild(customerItem);
    }
}

// Get correct path for general navigation
function getGeneralPath(page) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('dashboard/')) {
        return `../${page}`;
    } else if (currentPath.includes('pages/')) {
        return page;
    } else {
        return `pages/${page}`;
    }
}

// Reset navigation to default
function resetNavigation() {
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (!dropdownMenu) return;
    
    dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="${getGeneralPath('login.html')}">Login</a></li>
        <li><a class="dropdown-item" href="${getGeneralPath('register.html')}">Register</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item" href="${getDashboardPath('customer.html')}">My Dashboard</a></li>
        <li><a class="dropdown-item" href="${getDashboardPath('seller.html')}">Seller Dashboard</a></li>
        <li><a class="dropdown-item" href="${getDashboardPath('admin.html')}">Admin Panel</a></li>
    `;
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Get products by category
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Add loading spinner
function showLoading(element) {
    element.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
}

// Remove loading spinner
function hideLoading(element) {
    element.innerHTML = '';
}

// Utility function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Utility function to set URL parameter
function setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.pushState({}, '', url);
}

// Export functions for use in other files
window.ElectroMart = {
    currentUser,
    products,
    cart,
    getProductById,
    getProductsByCategory,
    formatPrice,
    showNotification,
    showLoading,
    hideLoading,
    getUrlParameter,
    setUrlParameter
};