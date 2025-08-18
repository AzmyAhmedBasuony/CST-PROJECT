// Cart JavaScript for TECHHORA

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        showNotification('Product not found.', 'error');
        return false;
    }
    
    if (product.stock < quantity) {
        showNotification('Not enough stock available.', 'error');
        return false;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        if (existingItem.quantity > product.stock) {
            existingItem.quantity = product.stock;
            showNotification('Added maximum available stock to cart.', 'warning');
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    displayCartItems();
    updateCartSummary();
    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        saveCartToStorage();
        updateCartCount();
        showNotification(`${removedItem.name} removed from cart.`, 'info');
        displayCartItems();
        updateCartSummary();

        return true;
    }
    
    showNotification('Item not found in cart.', 'error');
    return false;
}

// Update item quantity in cart
function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    const product = getProductById(productId);
    
    if (!item) {
        showNotification('Item not found in cart.', 'error');
        return false;
    }
    
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    
    if (product && quantity > product.stock) {
        showNotification('Not enough stock available.', 'error');
        return false;
    }
    
    item.quantity = quantity;
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    return true;
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Clear cart
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCount();
    updateCartDisplay();
    showNotification('Cart cleared.', 'info');
}

// Display cart items
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">Your cart is empty</h5>
                <p class="text-muted">Add some products to get started!</p>
                <a href="catalog.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        if (itemCountElement) itemCountElement.textContent = '0';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="card mb-3 cart-item" data-id="${item.id}">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}" onerror="this.src='../assets/images/placeholder.jpg'">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">
                            <strong>Price:</strong> $${item.price.toFixed(2)}<br>
                            <strong>Quantity:</strong> 
                            <div class="input-group input-group-sm" style="width: 120px;">
                                <button class="btn btn-outline-secondary" type="button" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${item.id}, parseInt(this.value))">
                                <button class="btn btn-outline-secondary" type="button" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                        </p>
                        <p class="card-text">
                            <strong>Subtotal:</strong> $${(item.price * item.quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
                <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update cart display
function updateCartDisplay() {
    displayCartItems();
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    if (!cartSummary) return;
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
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
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
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
                <button class="btn btn-primary w-100 mb-2" onclick="proceedToCheckout()">
                    Proceed to Checkout
                </button>
                <button class="btn btn-outline-secondary w-100" onclick="clearCart()">
                    Clear Cart
                </button>
            </div>
        </div>
    `;
}

// Proceed to checkout
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
    
    // Save cart to session for checkout
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Apply coupon code
function applyCoupon(couponCode) {
    const coupons = {
        'WELCOME10': 0.10,
        'SAVE20': 0.20,
        'FREESHIP': 0.05
    };
    
    const discount = coupons[couponCode];
    if (discount) {
        const discountAmount = getCartTotal() * discount;
        showNotification(`Coupon applied! You saved $${discountAmount.toFixed(2)}`, 'success');
        return discountAmount;
    } else {
        showNotification('Invalid coupon code.', 'error');
        return 0;
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
        cart = JSON.parse(cartData);
    }
}

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = getCartItemCount();
    }
}

// Initialize cart functionality
function initializeCart() {
    loadCartFromStorage();
    updateCartCount();
    updateCartDisplay();
}

// Handle cart page initialization
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('cart.html')) {
        initializeCart();
    }
});

// Export functions for use in other files
window.Cart = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartTotal,
    getCartItemCount,
    clearCart,
    displayCartItems,
    updateCartDisplay,
    updateCartSummary,
    proceedToCheckout,
    applyCoupon,
    saveCartToStorage,
    loadCartFromStorage,
    updateCartCount,
    initializeCart
}; 