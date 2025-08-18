// API Service for TECHHORA E-commerce
// Handles external API calls and data mapping

class ApiService {
  constructor() {
    this.baseUrl = "https://fakestoreapi.com"; // Using FakeStore API as example
    this.endpoints = {
      products: "/products",
      categories: "/products/categories",
      product: "/products",
    };
  }

  // Fetch all products from API
  async fetchProducts() {
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoints.products}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProducts = await response.json();
      console.log(
        "Products after map = ",
        this.mapApiProductsToLocal(apiProducts)
      );
      return this.mapApiProductsToLocal(apiProducts);
    } catch (error) {
      console.error("Error fetching products from API:", error);
      throw error;
    }
  }

  // Fetch products by category
  async fetchProductsByCategory(category) {
    try {
      const response = await fetch(
        `${this.baseUrl}${this.endpoints.products}/category/${category}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProducts = await response.json();
      console.log("apiProducts = ", this.mapApiProductsToLocal(apiProducts));
      return this.mapApiProductsToLocal(apiProducts);
    } catch (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      throw error;
    }
  }

  // Fetch single product by ID
  async fetchProductById(id) {
    try {
      const response = await fetch(
        `${this.baseUrl}${this.endpoints.product}/${id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiProduct = await response.json();
      return this.mapApiProductToLocal(apiProduct);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  // Fetch available categories
  async fetchCategories() {
    try {
      const response = await fetch(
        `${this.baseUrl}${this.endpoints.categories}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  // Map API product structure to local product structure
  mapApiProductsToLocal(apiProducts) {
    return apiProducts.map((apiProduct) =>
      this.mapApiProductToLocal(apiProduct)
    );
  }

  // Map single API product to local product structure
  //https://fakestoreapi.com/products/category/electronics
  mapApiProductToLocal(apiProduct) {
    return {
      id: apiProduct.id,
      name: apiProduct.title || apiProduct.name,
      category: this.mapCategory(apiProduct.category),
      price: parseFloat(apiProduct.price) || 0,
      description: apiProduct.description || "No description available",
      image: apiProduct.image || "assets/images/placeholder.jpg",
      rating: parseFloat(apiProduct.rating?.rate) || 0,
      stock: Math.floor(Math.random() * 100) + 10, // Generate random stock since API doesn't provide it
      seller: this.generateSellerName(apiProduct.category), // Generate seller name based on category
      featured: true
    };
  }

  // Map API categories to local category names
  mapCategory(apiCategory) {
    const categoryMap = {
      "men's clothing": "clothing",
      "women's clothing": "clothing",
      jewelery: "jewelry",
      electronics: "electronics",
    };
    return categoryMap[apiCategory] || apiCategory;
  }

  // Generate seller name based on category
  generateSellerName(category) {
    const sellers = {
      "men's clothing": "Fashion Store",
      "women's clothing": "Style Boutique",
      jewelery: "Luxury Jewelers",
      electronics: "Tech Hub",
      clothing: "Fashion Central",
      jewelry: "Luxury Collection",
      smartphones: "Mobile World",
      laptops: "Computer Store",
      audio: "Sound Systems",
      "smart-home": "Smart Living",
      televisions: "TV Store",
      gaming: "Game Zone",
      tablets: "Tablet Store",
    };
    return sellers[category] || "General Store";
  }

  // Search products by query
  async searchProducts(query) {
    try {
      const allProducts = await this.fetchProducts();
      const searchTerm = query.toLowerCase();
      return allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      const allProducts = await this.fetchProducts();
      return allProducts.filter((product) => product.featured);
    } catch (error) {
      console.error("Error getting featured products:", error);
      throw error;
    }
  }

  // Update local storage with API data
  async updateLocalProducts() {
    try {
      const apiProducts = await this.fetchProducts();
      localStorage.setItem("products", JSON.stringify(apiProducts));
      return apiProducts;
    } catch (error) {
      console.error("Error updating local products:", error);
      throw error;
    }
  }

  // Fallback to local products if API fails
  getLocalProducts() {
    const localProducts = localStorage.getItem("products");
    return localProducts ? JSON.parse(localProducts) : [];
  }

  // Check if API is available
  async checkApiHealth() {
    try {
      const response = await fetch(
        `${this.baseUrl}${this.endpoints.products}?limit=1`
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create global instance
const apiService = new ApiService();

// Export for use in other files
window.ApiService = ApiService;
window.apiService = apiService;
