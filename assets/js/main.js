// Main JavaScript for ElectroMart E-commerce

// Global variables
let currentUser = null;
let products = [];
let cart = [];
window.addEventListener('load', function() {
         loadFeaturedProducts(); 
})
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
            name: "Wireless Bluetooth Headphones",
            category:"audio",
            price:7999,
            description: "Experience superior sound quality with these wireless Bluetooth headphones, designed for comfort and portability for everyday use.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/wireless-headphones.jpg",
            rating: 4.7,
            stock: 50,
            seller: "Apple Store",
            featured: true
        },
        {
            id: 2,
            name: "Smartphone - 128GB",
            category: "Smartphones",
            price: 45000,
            description: "  Stay connected with this high-performance smartphone featuring 128GB storage, perfect for apps, photos, and multimedia.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/smartphone.jpg",
            rating: 4.6,
            stock: 25,
            seller: "Apple Store",
            featured: true
        },
        {
            id: 3,
            name: "Portable Bluetooth Speaker",
            category: "audio",
            price:5000,
            description: "Take your music anywhere with this portable Bluetooth speaker, delivering powerful sound in a compact design, perfect for outdoor use",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/bluetooth-speaker.jpg",
            rating: 4.7,
            stock: 100,
            seller: "Sony Electronics",
            featured: false
        },
        {
            id: 4,
            name: "smartwatch",
            category: "Smartphones",
            price: 2400,
            description: "Monitor your health and stay connected with this feature-rich smartwatch, perfect for tracking fitness and receiving notifications.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/smartwatch.jpg",
            rating: 4.6,
            stock: 75,
            seller: "Samsung Store",
            featured: false
        },
        {
            id: 5,
            name: "Dell XPS 13",
            category: "laptops",
            price: 30000,
            description: "Unleash your gaming potential with this powerful gaming laptop featuring 16GB RAM and 512GB SSD for speed and performance.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/laptop.jpg",
            rating: 4.9,
            stock: 30,
            seller: "Dell Store",
            featured: false
        },
        {
            id: 6,
            name: "10.1-Inch Android Tablet",
            category: "smartphones",
            price: 8000,
            description: "Enjoy your favorite apps and media on this sleek 10.1-inch Android tablet, offering portability and a vibrant display for on-the-go.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/tablet.jpg",
            rating: 4.4,
            stock: 60,
            seller: "summsung Store",
            featured: true
        },
        {
            id: 7,
            name: "USB Drive - 64GB",
            category: "smart-home",
            price: 220,
            description: "Store and transfer your files easily with this 64GB USB drive, offering ample space and portability for your data needs.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/usb-drive.jpg",
            rating: 4.3,
            stock: 200,
            seller: "Google Store",
            featured: false
        },
        {
            id: 8,
            name: "55-Inch 4K Ultra HD TV",
            category: "smart-home",
            price:25000,
            description: "Enjoy breathtaking visuals with this 55-inch 4K Ultra HD TV, delivering stunning detail and vibrant colors for your favorite shows.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/4k-tv.jpg",
            rating: 4.6,
            stock: 150,
            seller: "Amazon Store",
            featured: false
        }
        ,
        {
             id: 9,
            name: "4K Action Camera",
            category: "smart-home",
            price: 11200,
            description: "Record your adventures in stunning detail with this 4K action camera, built to withstand tough conditions and capture high-quality footage.",
            image: "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/images/products/action-camera.jpg",
            rating: 4.5,
            stock: 60,
            seller: "sony Store",
            featured: false

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

document.getElementById('homeproduct').innerHTML= products.filter(p=>p.featured).map(product => `
       
         <div  class="col-lg-4 col-md-6 ">
            <div class="card product-card h-100">
                <img src='${product.image} 'class="card-img-top img-fluid w-50 text-aline-center d-block mt-5"  alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="product-rating mb-2">
                    ${generateStarRating(product.rating)}
                        <small class="text-muted">(${product.rating})</small>
                    </div>
                    <div class="product-price mb-3">EGP${product.price.toFixed(1)}</div>
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
          `
    )
    
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
     const dropdownMenu = document.querySelector('.dropdown-menu')[0];
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