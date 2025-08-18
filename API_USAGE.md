# TECHHORA API Service Usage Guide

## Overview

The TECHHORA e-commerce platform now includes a comprehensive API service that allows you to fetch products from external APIs and map them to fit your existing product structure. The service provides fallback mechanisms to ensure your application continues to work even when external APIs are unavailable.

## Files Added

1. **`assets/js/api-service.js`** - Main API service class
2. **`assets/js/api-demo.js`** - Demo and example usage
3. **Updated `assets/js/main.js`** - Integrated API functions
4. **Updated `index.html`** - Includes API service script

## API Service Features

### Core Functions

- **`fetchProducts()`** - Get all products from API
- **`fetchProductsByCategory(category)`** - Get products by specific category
- **`fetchProductById(id)`** - Get single product by ID
- **`fetchCategories()`** - Get available product categories
- **`searchProducts(query)`** - Search products by text query
- **`getFeaturedProducts()`** - Get featured products
- **`updateLocalProducts()`** - Update local storage with API data
- **`checkApiHealth()`** - Check if API is available

### Data Mapping

The API service automatically maps external API data to match your existing product structure:

```javascript
// External API structure (e.g., FakeStore API)
{
    id: 1,
    title: "Product Name",
    price: 99.99,
    description: "Product description",
    category: "electronics",
    image: "https://example.com/image.jpg",
    rating: { rate: 4.5 }
}

// Mapped to your structure
{
    id: 1,
    name: "Product Name",
    price: 99.99,
    description: "Product description",
    category: "electronics",
    image: "https://example.com/image.jpg",
    rating: 4.5,
    stock: 45, // Generated randomly
    seller: "Tech Hub", // Generated based on category
    featured: true // 30% chance
}
```

## Usage Examples

### 1. Basic Product Fetching

```javascript
// Fetch all products from API
try {
    const products = await apiService.fetchProducts();
    console.log(`Fetched ${products.length} products`);
} catch (error) {
    console.error('Failed to fetch products:', error);
    // Fallback to local products
    const localProducts = apiService.getLocalProducts();
}
```

### 2. Category-based Fetching

```javascript
// Get products by category
const electronicsProducts = await apiService.fetchProductsByCategory('electronics');
console.log(`Found ${electronicsProducts.length} electronics products`);
```

### 3. Product Search

```javascript
// Search for products
const searchResults = await apiService.searchProducts('phone');
console.log(`Found ${searchResults.length} products matching "phone"`);
```

### 4. Featured Products

```javascript
// Get featured products
const featuredProducts = await apiService.getFeaturedProducts();
console.log(`Found ${featuredProducts.length} featured products`);
```

### 5. Update Local Storage

```javascript
// Refresh products from API and update local storage
await apiService.updateLocalProducts();
console.log('Local storage updated with latest API data');
```

## Integration with Existing Code

### Using TECHHORA Global Object

The API functions are available through the global `TECHHORA` object:

```javascript
// Get products by category from API
const products = await TECHHORA.getProductsByCategoryFromAPI('smartphones');

// Search products from API
const searchResults = await TECHHORA.searchProductsFromAPI('laptop');

// Refresh products from API
const updatedProducts = await TECHHORA.refreshProductsFromAPI();

// Get featured products from API
const featuredProducts = await TECHHORA.getFeaturedProductsFromAPI();
```

### Automatic Fallback

All API functions include automatic fallback to local data:

```javascript
// This will try API first, then fallback to local
const products = await TECHHORA.getProductsByCategoryFromAPI('smartphones');
```

## Configuration

### Changing API Endpoint

To use a different API, modify the `baseUrl` in `api-service.js`:

```javascript
class ApiService {
    constructor() {
        this.baseUrl = 'https://your-api-endpoint.com'; // Change this
        // ... rest of the code
    }
}
```

### Custom Data Mapping

To customize how API data is mapped, modify the `mapApiProductToLocal` method:

```javascript
mapApiProductToLocal(apiProduct) {
    return {
        id: apiProduct.id,
        name: apiProduct.title || apiProduct.name,
        // Add your custom mapping logic here
        customField: apiProduct.customField || 'default',
        // ... rest of the mapping
    };
}
```

## Error Handling

The API service includes comprehensive error handling:

```javascript
try {
    const products = await apiService.fetchProducts();
    // Use products
} catch (error) {
    if (error.name === 'TypeError') {
        // Network error or API unavailable
        console.log('API unavailable, using local data');
        const localProducts = apiService.getLocalProducts();
    } else {
        // Other errors
        console.error('API error:', error);
    }
}
```

## Performance Considerations

- **Caching**: Products are cached in localStorage after first fetch
- **Lazy Loading**: API calls are made only when needed
- **Fallback**: Local data is used when API is unavailable
- **Health Checks**: API availability is checked before making calls

## Browser Compatibility

The API service uses modern JavaScript features:
- `async/await` (ES2017+)
- `fetch` API (ES2015+)
- `class` syntax (ES2015+)

For older browsers, consider using polyfills or transpiling the code.

## Testing

To test the API functionality:

1. Open your browser's developer console
2. Navigate to a page with the API service loaded
3. Check for console logs from the API demo
4. Test API functions manually in the console

## Troubleshooting

### Common Issues

1. **API not loading**: Check if `api-service.js` is included before `main.js`
2. **CORS errors**: The service uses a public API (FakeStore) that should work
3. **Network errors**: Check your internet connection
4. **Local fallback not working**: Ensure localStorage is available

### Debug Mode

Enable debug logging by checking the browser console for detailed API operation logs.

## Future Enhancements

Potential improvements for the API service:
- Rate limiting and request throttling
- Offline support with service workers
- Real-time product updates
- Multiple API endpoint support
- Advanced caching strategies
- WebSocket integration for live updates

## Support

For issues or questions about the API service, check the browser console for error messages and refer to the demo file (`api-demo.js`) for usage examples.
