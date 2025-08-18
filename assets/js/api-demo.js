// API Demo - Shows how to use the new API functions
// This file demonstrates the usage of the API service

// Example: Load products from API when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('API Demo loaded');
    
    // Example of how to use the API functions
    demonstrateApiUsage();
});

// Demonstrate various API usage patterns
async function demonstrateApiUsage() {
    try {
        console.log('=== API Demo Started ===');
        
        // 1. Check if API is available
        if (typeof apiService !== 'undefined') {
            const isHealthy = await apiService.checkApiHealth();
            console.log('API Health Check:', isHealthy ? '✅ Healthy' : '❌ Unhealthy');
            
            if (isHealthy) {
                // 2. Fetch all products from API
                console.log('Fetching products from API...');
                const apiProducts = await apiService.fetchProducts();
                console.log(`✅ Fetched ${apiProducts.length} products from API`);
                
                // 3. Show first few products
                console.log('First 3 products from API:');
                apiProducts.slice(0, 3).forEach(product => {
                    console.log(`- ${product.name} (${product.category}) - $${product.price}`);
                });
                
                // 4. Search products
                console.log('\nSearching for "phone"...');
                const searchResults = await apiService.searchProducts('phone');
                console.log(`✅ Found ${searchResults.length} products matching "phone"`);
                
                // 5. Get products by category
                console.log('\nFetching electronics products...');
                const electronicsProducts = await apiService.fetchProductsByCategory('electronics');
                console.log(`✅ Found ${electronicsProducts.length} electronics products`);
                
                // 6. Get featured products
                console.log('\nFetching featured products...');
                const featuredProducts = await apiService.getFeaturedProducts();
                console.log(`✅ Found ${featuredProducts.length} featured products`);
                
                // 7. Update local storage with API data
                console.log('\nUpdating local storage with API data...');
                await apiService.updateLocalProducts();
                console.log('✅ Local storage updated with API data');
                
            } else {
                console.log('❌ API is not healthy, using local products');
            }
        } else {
            console.log('❌ API service not available');
        }
        
        console.log('=== API Demo Completed ===');
        
    } catch (error) {
        console.error('❌ API Demo failed:', error);
    }
}

// Function to display products in a container
async function displayProductsFromAPI(containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        // Show loading
        container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
        
        // Fetch products from API
        const products = await apiService.fetchProducts();
        
        // Display products
        let html = '<div class="row">';
        products.forEach(product => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary">$${product.price}</span>
                                <span class="badge bg-secondary">${product.category}</span>
                            </div>
                            <div class="mt-2">
                                <small class="text-muted">Rating: ${product.rating}/5</small>
                                <small class="text-muted ms-3">Stock: ${product.stock}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to display products:', error);
        container.innerHTML = '<div class="alert alert-danger">Failed to load products from API</div>';
    }
}

// Function to search and display products
async function searchAndDisplayProducts(query, containerId) {
    try {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }
        
        // Show loading
        container.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Searching...</span></div></div>';
        
        // Search products
        const products = await apiService.searchProducts(query);
        
        if (products.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No products found matching your search.</div>';
            return;
        }
        
        // Display search results
        let html = `<h4>Search Results for "${query}" (${products.length} products)</h4><div class="row">`;
        products.forEach(product => {
            html += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h5 text-primary">$${product.price}</span>
                                <span class="badge bg-secondary">${product.category}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to search products:', error);
        container.innerHTML = '<div class="alert alert-danger">Failed to search products</div>';
    }
}

// Export functions for use in other files
window.ApiDemo = {
    demonstrateApiUsage,
    displayProductsFromAPI,
    searchAndDisplayProducts
};
