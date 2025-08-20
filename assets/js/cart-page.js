// Cart Page JavaScript for TECHHORA

let appliedCoupon = null;
let shippingCost = 10; // Default standard shipping

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        initializeCartPage();
    }
});

// Initialize cart page functionality
function initializeCartPage() {
    loadCartFromStorage();
    updateCartDisplay();
    loadRelatedProducts();
    setupShippingEventListeners();
}

// Setup shipping event listeners
function setupShippingEventListeners() {
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateShippingCost);
    });
}

// Update shipping cost based on selection
function updateShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked').value;
    
    switch (selectedShipping) {
        case 'standard':
            shippingCost = 10;
            break;
        case 'express':
            shippingCost = 20;
            break;
        case 'overnight':
            shippingCost = 30;
            break;
    }
    
    updateCartSummary();
}

// Apply coupon code
function applyCouponCode() {
    const couponCode = document.getElementById('coupon-code').value.trim().toUpperCase();
    const messageElement = document.getElementById('coupon-message');
    
    if (!couponCode) {
        showCouponMessage('Please enter a coupon code.', 'error');
        return;
    }
    
    const discount = applyCoupon(couponCode);
    
    if (discount > 0) {
        appliedCoupon = {
            code: couponCode,
            discount: discount
        };
        showCouponMessage(`Coupon "${couponCode}" applied successfully! You saved $${discount.toFixed(2)}`, 'success');
        updateCartSummary();
    } else {
        appliedCoupon = null;
        showCouponMessage('Invalid coupon code. Please try again.', 'error');
    }
}

// Show coupon message
function showCouponMessage(message, type) {
    const messageElement = document.getElementById('coupon-message');
    const alertClass = type === 'error' ? 'alert-danger' : 'alert-success';
    
    messageElement.innerHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function updateCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    if (!cartSummary) return;
    
    const subtotal = getCartTotal();
    const discount = appliedCoupon ? appliedCoupon.discount : 0;
    const tax = (subtotal - discount) * 0.08; // 8% tax on subtotal minus discount
    const total = subtotal - discount + shippingCost + tax;
    
    cartSummary.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Order Summary</h5>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal (${getCartItemCount()} items):</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                ${appliedCoupon ? `
                <div class="d-flex justify-content-between mb-2 text-success">
                    <span>Coupon (${appliedCoupon.code}):</span>
                    <span>-$${discount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>$${shippingCost.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between mb-3">
                    <strong>Total:</strong>
                    <strong>$${total.toFixed(2)}</strong>
                </div>

                <!-- الأزرار تحت التوتال -->
                <div class="d-grid gap-2">
                    <button class="btn btn-success custom-btn" onclick="proceedToCheckout()">
                        <i class="fas fa-credit-card me-2"></i> Proceed to Checkout
                    </button>
                    <button class="btn btn-danger custom-btn" onclick="clearCart()">
                        <i class="fas fa-trash-alt me-2"></i> Clear Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}


// Load related products
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;
    
    // Get random products that are not in cart
    const cartProductIds = cart.map(item => item.id);
    const availableProducts = products.filter(product => !cartProductIds.includes(product.id));
    const randomProducts = availableProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    if (randomProducts.length === 0) {
        relatedContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No related products available.</p>
            </div>
        `;
        return;
    }
    
    relatedContainer.innerHTML = randomProducts.map(product => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                     onerror="this.src='../assets/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${product.name}</h6>
                    <p class="card-text text-muted small">${product.description.substring(0, 60)}...</p>
                    <div class="product-price mb-3">$${product.price.toFixed(2)}</div>
                    <div class="mt-auto">
                        <button class="btn btn-add-cart btn-sm w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="product.html?id=${product.id}" class="btn btn-view-details btn-sm w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}


// Enhanced display cart items for cart page
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const itemCountElement = document.getElementById('item-count');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Your cart is empty</h5>
                <p class="text-muted">Add some products to get started!</p>
                <a href="catalog.html" class="btn btn-add-cart">Continue Shopping</a>
            </div>
        `;
        if (itemCountElement) itemCountElement.textContent = '0';
        return;
    }
    
    if (itemCountElement) {
        itemCountElement.textContent = getCartItemCount();
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="card mb-3 shadow-sm border-0 rounded-3 cart-item" data-id="${item.id}">
            <div class="row g-0 align-items-center">
                <div class="col-md-2 text-center p-2">
                    <img src="${item.image}" class="img-fluid rounded" alt="${item.name}" style="max-height: 100px; object-fit: contain;" onerror="this.src='../assets/images/placeholder.jpg'">
                </div>
                <div class="col-md-7">
                    <div class="card-body py-2">
                        <h5 class="card-title mb-2">${item.name}</h5>
                        <p class="card-text small mb-1">
                            <strong>Price:</strong> $${item.price.toFixed(2)}
                        </p>
                        <div class="d-flex align-items-center mb-2">
                            <strong class="me-2">Quantity:</strong>
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary" type="button" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                                <button class="btn btn-outline-secondary" type="button" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <p class="card-text small">
                            <strong>Subtotal:</strong> $${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
                <div class="col-md-3 text-end pe-3">
                    <button class="btn btn-danger btn-sm custom-btn w-100 mb-2" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash-alt me-1"></i> Remove
                    </button>
                    <a href="product.html?id=${item.id}" class="btn btn-view-details btn-sm w-100">
                        <i class="fas fa-eye me-1"></i> View Details
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}


// Update cart display for cart page
function updateCartDisplay() {
    displayCartItems();
    updateCartSummary();
}

// Proceed to checkout with enhanced validation
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'error');
        return;
    }
    
    if (!isLoggedIn()) {
        showNotification('Please login to proceed with checkout.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Save cart and checkout data to session
    const checkoutData = {
        cart: cart,
        coupon: appliedCoupon,
        shipping: {
            method: document.querySelector('input[name="shipping"]:checked').value,
            cost: shippingCost
        }
    };
    
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    window.location.href = 'checkout.html';
}

// Export functions for use in other files
window.CartPage = {
    applyCouponCode,
    updateShippingCost,
    loadRelatedProducts,
    displayCartItems,
    updateCartDisplay,
    proceedToCheckout
}; 