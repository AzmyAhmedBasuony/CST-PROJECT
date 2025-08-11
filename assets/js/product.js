// Product Page JavaScript for ElectroMart

let currentProduct = null;
let quantity = 1;

// Initialize product page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product.html')) {
        initializeProductPage();
    }
});

// Initialize product page functionality
function initializeProductPage() {
    loadProductsFromStorage();
    loadProductDetails();
    loadRelatedProducts();
    setupProductEventListeners();
}

// Load product details from URL parameter
function loadProductDetails() {
    const productId = parseInt(getUrlParameter('id'));
    if (!productId) {
        showProductNotFound();
        return;
    }
    
    currentProduct = getProductById(productId);
    if (!currentProduct) {
        showProductNotFound();
        return;
    }
    
    displayProductDetails();
    updatePageTitle();
}

// Display product details
function displayProductDetails() {
    const container = document.getElementById('product-details');
    if (!container || !currentProduct) return;
    
    container.innerHTML = `
        <div class="row">
            <!-- Breadcrumb -->
            <div class="col-12 mb-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
                        <li class="breadcrumb-item"><a href="catalog.html">Products</a></li>
                        <li class="breadcrumb-item"><a href="catalog.html?category=${currentProduct.category}">${currentProduct.category}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">${currentProduct.name}</li>
                    </ol>
                </nav>
            </div>
            
            <!-- Product Images -->
            <div class="col-md-6 mb-4">
                <div class="product-image-container">
                    <img src="${currentProduct.image}" class="img-fluid rounded" alt="${currentProduct.name}" onerror="this.src='../assets/images/placeholder.jpg'">
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="col-md-6">
                <div class="product-info">
                    <h1 class="product-title mb-3">${currentProduct.name}</h1>
                    
                    <div class="product-rating mb-3">
                        ${generateStarRating(currentProduct.rating)}
                        <span class="ms-2">(${currentProduct.rating})</span>
                        <span class="text-muted ms-2">• ${currentProduct.stock} in stock</span>
                    </div>
                    
                    <div class="product-price mb-4">
                        <span class="price-main">$${currentProduct.price.toFixed(2)}</span>
                        <span class="price-original text-muted text-decoration-line-through ms-2">$${(currentProduct.price * 1.2).toFixed(2)}</span>
                        <span class="badge bg-danger ms-2">20% OFF</span>
                    </div>
                    
                    <div class="product-description mb-4">
                        <h6>Description</h6>
                        <p>${currentProduct.description}</p>
                    </div>
                    
                    <div class="product-details mb-4">
                        <div class="row">
                            <div class="col-6">
                                <strong>Category:</strong> ${currentProduct.category}
                            </div>
                            <div class="col-6">
                                <strong>Seller:</strong> ${currentProduct.seller}
                            </div>
                            <div class="col-6">
                                <strong>Stock:</strong> ${currentProduct.stock} units
                            </div>
                            <div class="col-6">
                                <strong>SKU:</strong> ${currentProduct.id.toString().padStart(6, '0')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label for="quantity" class="form-label">Quantity</label>
                                <div class="input-group">
                                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(-1)">-</button>
                                    <input type="number" class="form-control text-center" id="quantity" value="1" min="1" max="${currentProduct.stock}" onchange="updateQuantity(0)">
                                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(1)">+</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-lg" onclick="addToCartFromProduct()">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline-primary" onclick="buyNow()">
                                <i class="fas fa-bolt"></i> Buy Now
                            </button>
                        </div>
                        
                        <div class="mt-3">
                            <button class="btn btn-outline-secondary btn-sm me-2" onclick="addToWishlist()">
                                <i class="far fa-heart"></i> Add to Wishlist
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="shareProduct()">
                                <i class="fas fa-share"></i> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Product Features -->
        <div class="row mt-5">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Product Features</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-check text-success me-2"></i>High-quality materials</li>
                                    <li><i class="fas fa-check text-success me-2"></i>1-year warranty</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Free shipping</li>
                                    <li><i class="fas fa-check text-success me-2"></i>30-day returns</li>
                                </ul>
                            </div>
                            <div class="col-md-6">
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-check text-success me-2"></i>24/7 customer support</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Secure payment</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Fast delivery</li>
                                    <li><i class="fas fa-check text-success me-2"></i>Genuine product</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Update quantity
function updateQuantity(change) {
    const quantityInput = document.getElementById('quantity');
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > currentProduct.stock) newQuantity = currentProduct.stock;
    
    quantityInput.value = newQuantity;
    quantity = newQuantity;
}

// Add to cart from product page
function addToCartFromProduct() {
    if (!currentProduct) return;
    
    const quantityInput = document.getElementById('quantity');
    const selectedQuantity = parseInt(quantityInput.value);
    
    if (addToCart(currentProduct.id, selectedQuantity)) {
        showNotification(`${currentProduct.name} added to cart!`, 'success');
    }
}

// Buy now functionality
function buyNow() {
    if (!currentProduct) return;
    
    const quantityInput = document.getElementById('quantity');
    const selectedQuantity = parseInt(quantityInput.value);
    
    // Add to cart first
    addToCart(currentProduct.id, selectedQuantity);
    
    // Redirect to checkout
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
}

// Add to wishlist
function addToWishlist() {
    if (!currentProduct) return;
    
    // Get existing wishlist
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Check if product already in wishlist
    if (!wishlist.find(item => item.id === currentProduct.id)) {
        wishlist.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification(`${currentProduct.name} added to wishlist!`, 'success');
    } else {
        showNotification('Product already in wishlist!', 'info');
    }
}

// Share product
function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: currentProduct.name,
            text: `Check out this amazing product: ${currentProduct.name}`,
            url: window.location.href
        });
    } else {
        // Fallback: copy URL to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Product link copied to clipboard!', 'success');
        });
    }
}

// Load related products
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer || !currentProduct) return;
    
    // Get products from same category, excluding current product
    const relatedProducts = products
        .filter(product => product.category === currentProduct.category && product.id !== currentProduct.id)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        relatedContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No related products available.</p>
            </div>
        `;
        return;
    }
    
    relatedContainer.innerHTML = relatedProducts.map(product => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.src='../assets/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${product.name}</h6>
                    <p class="card-text text-muted small">${product.description.substring(0, 60)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <small class="text-muted">(${product.rating})</small>
                    </div>
                    <div class="product-price mb-3">$${product.price.toFixed(2)}</div>
                    <div class="mt-auto">
                        <button class="btn btn-primary btn-sm w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Show product not found
function showProductNotFound() {
    const container = document.getElementById('product-details');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h3 class="text-muted">Product Not Found</h3>
            <p class="text-muted">The product you're looking for doesn't exist or has been removed.</p>
            <a href="catalog.html" class="btn btn-primary">Browse Products</a>
        </div>
    `;
}

// Update page title
function updatePageTitle() {
    if (currentProduct) {
        document.title = `${currentProduct.name}- TECHHORA`;
    }
}

// Setup product page event listeners
function setupProductEventListeners() {
    // Quantity input validation
    document.addEventListener('input', function(event) {
        if (event.target.id === 'quantity') {
            const value = parseInt(event.target.value);
            const max = currentProduct ? currentProduct.stock : 1;
            
            if (value < 1) event.target.value = 1;
            if (value > max) event.target.value = max;
            
            quantity = parseInt(event.target.value);
        }
    });
}

// Export functions for use in other files
window.Product = {
    loadProductDetails,
    displayProductDetails,
    updateQuantity,
    addToCartFromProduct,
    buyNow,
    addToWishlist,
    shareProduct,
    loadRelatedProducts
}; 