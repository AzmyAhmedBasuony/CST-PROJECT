// Catalog JavaScript for ElectroMart

let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let currentViewMode = 'grid';

// Initialize catalog page
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('catalog.html')) {
        initializeCatalog();
    }
});

// Initialize catalog functionality
function initializeCatalog() {
    loadProductsFromStorage();
    filteredProducts = products.slice();
    setupFilterEventListeners();
    setupPriceFilterEventListeners();
    loadProductsFromURL();
    displayProducts();
    updateProductCount();
    updatePagination();
}

// Setup filter event listeners
function setupFilterEventListeners() {
    // Category filter
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', filterProducts);
    });

    // Price filter inputs
    document.getElementById('min-price').addEventListener('input', filterProducts);
    document.getElementById('max-price').addEventListener('input', filterProducts);

    // Rating filter
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Sort select
    document.getElementById('sort-select').addEventListener('change', filterProducts);

    // Search input
    document.getElementById('search-input').addEventListener('input', filterProducts);
}

// Setup price filter slider event listeners
function setupPriceFilterEventListeners() {
    const minPriceSlider = document.getElementById('range-min');
    const maxPriceSlider = document.getElementById('range-max');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    minPriceSlider.min = 0;
    minPriceSlider.max = 165000;
    maxPriceSlider.min = 0;
    maxPriceSlider.max = 165000;

    minPriceSlider.addEventListener('input', function () {
        minPriceInput.value = minPriceSlider.value;
        updatePriceRangeText(minPriceSlider.value, maxPriceSlider.value);
        filterProducts();
    });

    maxPriceSlider.addEventListener('input', function () {
        maxPriceInput.value = maxPriceSlider.value;
        updatePriceRangeText(minPriceSlider.value, maxPriceSlider.value);
        filterProducts();
    });

    updatePriceRangeText(minPriceSlider.value, maxPriceSlider.value);
}

// Update price range text dynamically
function updatePriceRangeText(minValue, maxValue) {
    const priceRangeText = document.getElementById('price-range-text');
    priceRangeText.textContent = `EGP ${minValue} – EGP ${maxValue}`;
}

// Load products from URL parameters
function loadProductsFromURL() {
    const category = getUrlParameter('category');
    if (category) {
        const categoryInput = document.querySelector(`input[value="${category}"]`);
        if (categoryInput) {
            categoryInput.checked = true;
        }
    }
}

// Get parameter from URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Filter products based on selected criteria
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedCategoryElement = document.querySelector('input[name="category"]:checked');
    const selectedCategory = selectedCategoryElement ? selectedCategoryElement.value : '';
    const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
    const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
    const selectedRatings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => parseInt(cb.value));
    const sortBy = document.getElementById('sort-select').value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        const matchesCategory = !selectedCategory || product.category === selectedCategory;

        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        const matchesRating = selectedRatings.length === 0 ||
            selectedRatings.some(rating => product.rating >= rating);

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    sortProducts(sortBy);
    currentPage = 1;
    displayProducts();
    updateProductCount();
    updatePagination();
}

// Sort products
function sortProducts(sortBy) {
    switch (sortBy) {
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }
}

// Display products
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">No products found</h5>
                <p class="text-muted">Try adjusting your filters or search terms.</p>
                <button class="btn btn-primary" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    if (currentViewMode === 'grid') {
        displayGridProducts(productsToShow, container);
    } else {
        displayListProducts(productsToShow, container);
    }
}

// Display products in grid view
function displayGridProducts(productsToShow, container) {
    container.className = 'row g-4';
    container.innerHTML = productsToShow.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.src='../assets/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description.substring(0, 80)}...</p>
                    <div class="product-rating mb-2">
                        ${generateStarRating(product.rating)}
                        <small class="text-muted">(${product.rating})</small>
                    </div>
                    <div class="product-price mb-3">EGP ${product.price.toFixed(2)}</div>
                    <div class="mt-auto">
                        <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="product.html?id=${product.id}" class="btn btn-outline-primary w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Display products in list view
function displayListProducts(productsToShow, container) {
    container.className = 'row';
    container.innerHTML = productsToShow.map(product => `
        <div class="col-12 mb-4">
            <div class="card product-card">
                <div class="row g-0">
                    <div class="col-md-3">
                        <img src="${product.image}" class="img-fluid rounded-start h-100" alt="${product.name}" style="object-fit: cover;" onerror="this.src='../assets/images/placeholder.jpg'">
                    </div>
                    <div class="col-md-9">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">${product.description}</p>
                                    <div class="product-rating mb-2">
                                        ${generateStarRating(product.rating)}
                                        <small class="text-muted">(${product.rating})</small>
                                    </div>
                                    <p class="card-text">
                                        <small class="text-muted">Category: ${product.category}</small><br>
                                        <small class="text-muted">Seller: ${product.seller}</small>
                                    </p>
                                </div>
                                <div class="col-md-4 text-end">
                                    <div class="product-price mb-3">EGP ${product.price.toFixed(2)}</div>
                                    <button class="btn btn-primary mb-2" onclick="addToCart(${product.id})">
                                        <i class="fas fa-shopping-cart"></i> Add to Cart
                                    </button>
                                    <a href="product.html?id=${product.id}" class="btn btn-outline-primary">
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Set view mode (grid or list)
function setViewMode(mode, event) {
    currentViewMode = mode;
    document.querySelectorAll('.btn-group .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    displayProducts();
}

// Update product count
function updateProductCount() {
    const countElement = document.getElementById('product-count');
    if (countElement) {
        const total = filteredProducts.length;
        const start = (currentPage - 1) * productsPerPage + 1;
        const end = Math.min(currentPage * productsPerPage, total);

        if (total === 0) {
            countElement.textContent = 'No products found';
        } else {
            countElement.textContent = `Showing ${start}-${end} of ${total} products`;
        }
    }
}

// Update pagination
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage - 1})">Previous</a>
        </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="goToPage(${i})">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${currentPage + 1})">Next</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Go to specific page
function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayProducts();
        updateProductCount();
        updatePagination();
        document.getElementById('products-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Clear all filters
function clearFilters() {
    document.getElementById('search-input').value = '';
    const allCategory = document.getElementById('all');
    if (allCategory) allCategory.checked = true;
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('sort-select').value = 'name';
    filterProducts();
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

// Export functions for use in other files
window.Catalog = {
    filterProducts,
    setViewMode,
    clearFilters,
    goToPage,
    generateStarRating
};
