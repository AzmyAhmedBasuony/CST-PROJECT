// Seller Dashboard JavaScript for TECHHORA
let sellerProducts = [];
let sellerOrders = [];
let currentEditingProduct = null;
let salesChart = null;
let productsChart = null;

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("seller.html")) {
    initializeSellerDashboard();
  }
});

function initializeSellerDashboard() {
  // Check if user is logged in and is a seller
  if (!isLoggedIn() || !isSeller()) {
    showNotification("Access denied. Please login as a seller.", "error");
    setTimeout(() => {
      window.location.href = "../../pages/login.html";
    }, 2000);
    return;
  }

  loadSellerData();
  setupEventListeners();
  updateDashboardStats();
  loadProductsTable();
  loadOrdersTable();
  initializeCharts();
  loadRecentActivity();
}

function loadSellerData() {
  // Load seller's products
  const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
  const currentUser = getCurrentUser();
  sellerProducts = allProducts.filter(
    (product) => product.seller === currentUser.name
  );

  // Load orders from localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  console.log("orders Items = ", orders);

  // Map orders to sellerOrders format
  sellerOrders = orders.map(order => ({
    id: order.id,
    customer: order.customer.name,
    customerEmail: order.customer.email,
    products: order.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    })),
    total: order.total,
    date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    status: order.status,
    shippingAddress: `${order.shipping.address}, ${order.shipping.city || ''}, ${order.shipping.state || ''} ${order.shipping.zipCode || ''}`.trim(),
    createdAt: order.createdAt,
    notes: order.notes,
    payment: order.payment,
    shipping: order.shipping,
    shippingMethod: order.shippingMethod
  }));

  // If no orders exist, create sample orders for demo
  if (sellerOrders.length === 0) {
    sellerOrders = [
      {
        id: "ORD001",
        customer: "John Customer",
        customerEmail: "customer@example.com",
        products: [
          { id: 1, name: "iPhone 15 Pro", quantity: 1, price: 999.99 },
        ],
        total: 999.99,
        date: "2025-01-15",
        status: "pending",
        shippingAddress: "123 Main St, City, State 12345",
        createdAt: "2025-01-15T00:00:00.000Z",
        notes: "",
        payment: {},
        shipping: {},
        shippingMethod: "standard"
      },
      {
        id: "ORD002",
        customer: "Jane Smith",
        customerEmail: "jane@example.com",
        products: [{ id: 2, name: "MacBook Pro", quantity: 1, price: 1299.99 }],
        total: 1299.99,
        date: "2025-01-14",
        status: "completed",
        shippingAddress: "456 Oak Ave, City, State 12345",
        createdAt: "2025-01-14T00:00:00.000Z",
        notes: "",
        payment: {},
        shipping: {},
        shippingMethod: "standard"
      },
    ];
  }
  
  localStorage.setItem("sellerOrders", JSON.stringify(sellerOrders));
}

function setupEventListeners() {
  // Product search
  document
    .getElementById("product-search")
    .addEventListener("input", function () {
      filterProducts(this.value);
    });

  // Tab change events
  document
    .getElementById("analytics-tab")
    .addEventListener("click", function () {
      setTimeout(() => {
        updateCharts();
      }, 100);
    });
}

function updateDashboardStats() {
  const totalProductsElement = document.getElementById("total-products");
  const totalOrdersElement = document.getElementById("total-orders");
  const totalRevenueElement = document.getElementById("total-revenue");
  const pendingOrdersElement = document.getElementById("pending-orders");
  const userNameElement = document.getElementById("user-name");

  if (totalProductsElement)
    totalProductsElement.textContent = sellerProducts.length;
  if (totalOrdersElement) totalOrdersElement.textContent = sellerOrders.length;

  const totalRevenue = sellerOrders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);
  if (totalRevenueElement)
    totalRevenueElement.textContent = `$${totalRevenue.toFixed(2)}`;

  const pendingOrders = sellerOrders.filter(
    (order) => order.status === "pending"
  ).length;
  if (pendingOrdersElement) pendingOrdersElement.textContent = pendingOrders;

  // Update user name
  const currentUser = getCurrentUser();
  if (userNameElement && currentUser) {
    userNameElement.textContent = currentUser.name;
  }
}

function loadProductsTable() {
  const tbody = document.getElementById("products-table");
  tbody.innerHTML = "";

  sellerProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${products.length}</td>
            <td>
                <img src="${product.image || "https://via.placeholder.com/50"}" 
                     alt="${
                       product.name
                     }" class="img-thumbnail" style="width: 50px; height: 50px;">
            </td>
            <td>${product.name}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>$${product.price}</td>
            <td>
                <span class="badge ${
                  product.stock > 10
                    ? "bg-success"
                    : product.stock > 0
                    ? "bg-warning"
                    : "bg-danger"
                }">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="badge ${
                  product.stock > 0 ? "bg-success" : "bg-danger"
                }">
                    ${product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editProduct(${
                      product.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct(${
                      product.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function loadOrdersTable() {
  const tbody = document.getElementById("orders-table");
  tbody.innerHTML = "";

  sellerOrders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.products.length} item(s)</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <span class="badge ${
                  order.status === "completed" ? "bg-success" : "bg-warning"
                }">
                    ${
                      order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)
                    }
                </span>
            </td>
            <td>
                <button class="btn btn-outline-info btn-sm" onclick="viewOrderDetails('${
                  order.id
                }')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function filterProducts(searchTerm) {
  const filteredProducts = sellerProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tbody = document.getElementById("products-table");
  tbody.innerHTML = "";

  filteredProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${product.image || "https://via.placeholder.com/50"}" 
                     alt="${
                       product.name
                     }" class="img-thumbnail" style="width: 50px; height: 50px;">
            </td>
            <td>${product.name}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>$${product.price}</td>
            <td>
                <span class="badge ${
                  product.stock > 10
                    ? "bg-success"
                    : product.stock > 0
                    ? "bg-warning"
                    : "bg-danger"
                }">
                    ${product.stock}
                </span>
            </td>
            <td>
                <span class="badge ${
                  product.stock > 0 ? "bg-success" : "bg-danger"
                }">
                    ${product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editProduct(${
                      product.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteProduct(${
                      product.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function filterOrders(status) {
  let filteredOrders = sellerOrders;
  if (status !== "all") {
    filteredOrders = sellerOrders.filter((order) => order.status === status);
  }

  const tbody = document.getElementById("orders-table");
  tbody.innerHTML = "";

  filteredOrders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td>${order.products.length} item(s)</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>
                <span class="badge ${
                  order.status === "completed" ? "bg-success" : "bg-warning"
                }">
                    ${
                      order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)
                    }
                </span>
            </td>
            <td>
                <button class="btn btn-outline-info btn-sm" onclick="viewOrderDetails('${
                  order.id
                }')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function showAddProductModal() {
  currentEditingProduct = null;
  document.getElementById("productModalTitle").textContent = "Add New Product";
  document.getElementById("product-form").reset();

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

function editProduct(productId) {
  const product = sellerProducts.find((p) => p.id === productId);
  if (!product) {
    showNotification("Product not found.", "error");
    return;
  }

  currentEditingProduct = product;
  document.getElementById("productModalTitle").textContent = "Edit Product";

  // Fill form with product data
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-stock").value = product.stock;
  document.getElementById("product-description").value = product.description;
  document.getElementById("product-image").value = product.image || "";
  document.getElementById("product-rating").value = product.rating || 4.0;
  document.getElementById("product-featured").checked =
    product.featured || false;

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

function saveProduct() {
  const formData = {
    name: document.getElementById("product-name").value.trim(),
    category: document.getElementById("product-category").value,
    price: parseFloat(document.getElementById("product-price").value),
    stock: parseInt(document.getElementById("product-stock").value),
    description: document.getElementById("product-description").value.trim(),
    image: document.getElementById("product-image").value.trim(),
    rating: parseFloat(document.getElementById("product-rating").value),
    featured: document.getElementById("product-featured").checked,
  };

  // Validation
  if (
    !formData.name ||
    !formData.category ||
    formData.price <= 0 ||
    formData.stock < 0
  ) {
    showNotification("Please fill all required fields correctly.", "error");
    return;
  }

  const currentUser = getCurrentUser();

  if (currentEditingProduct) {
    // Update existing product
    Object.assign(currentEditingProduct, formData);
    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const productIndex = allProducts.findIndex(
      (p) => p.id === currentEditingProduct.id
    );
    if (productIndex !== -1) {
      allProducts[productIndex] = currentEditingProduct;
      localStorage.setItem("products", JSON.stringify(allProducts));
    }
    showNotification("Product updated successfully!", "success");
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      ...formData,
      seller: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
    allProducts.push(newProduct);
    localStorage.setItem("products", JSON.stringify(allProducts));

    showNotification("Product added successfully!", "success");
  }

  // Reload data
  loadSellerData();
  updateDashboardStats();
  loadProductsTable();

  // Close modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("productModal")
  );
  modal.hide();
}

function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  const allProducts = JSON.parse(localStorage.getItem("products") || "[]");
  const updatedProducts = allProducts.filter((p) => p.id !== productId);
  localStorage.setItem("products", JSON.stringify(updatedProducts));

  showNotification("Product deleted successfully!", "success");

  // Reload data
  loadSellerData();
  updateDashboardStats();
  loadProductsTable();
}

function viewOrderDetails(orderId) {
  const order = sellerOrders.find((o) => o.id === orderId);
  if (!order) {
    showNotification("Order not found.", "error");
    return;
  }

  const modalBody = document.getElementById("order-details");
  modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Order Information</h6>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${new Date(
                  order.date
                ).toLocaleDateString()}</p>
                <p><strong>Status:</strong> 
                    <span class="badge ${
                      order.status === "completed" ? "bg-success" : "bg-warning"
                    }">
                        ${
                          order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)
                        }
                    </span>
                </p>
                <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            </div>
            <div class="col-md-6">
                <h6>Customer Information</h6>
                <p><strong>Name:</strong> ${order.customer}</p>
                <p><strong>Email:</strong> ${order.customerEmail}</p>
                <p><strong>Shipping Address:</strong> ${
                  order.shippingAddress
                }</p>
            </div>
        </div>
        <hr>
        <h6>Order Items</h6>
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.products
                      .map(
                        (product) => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.quantity}</td>
                            <td>$${product.price}</td>
                            <td>$${(product.quantity * product.price).toFixed(
                              2
                            )}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <label class="form-label">Update Order Status:</label>
            <select class="form-select" id="order-status">
                <option value="pending" ${
                  order.status === "pending" ? "selected" : ""
                }>Pending</option>
                <option value="processing" ${
                  order.status === "processing" ? "selected" : ""
                }>Processing</option>
                <option value="shipped" ${
                  order.status === "shipped" ? "selected" : ""
                }>Shipped</option>
                <option value="completed" ${
                  order.status === "completed" ? "selected" : ""
                }>Completed</option>
                <option value="cancelled" ${
                  order.status === "cancelled" ? "selected" : ""
                }>Cancelled</option>
            </select>
        </div>
    `;

  const modal = new bootstrap.Modal(document.getElementById("orderModal"));
  modal.show();
}

function updateOrderStatus() {
  const orderId = document
    .querySelector("#order-details")
    .getAttribute("data-order-id");
  const newStatus = document.getElementById("order-status").value;

  const orderIndex = sellerOrders.findIndex((o) => o.id === orderId);
  if (orderIndex !== -1) {
    sellerOrders[orderIndex].status = newStatus;
    localStorage.setItem("sellerOrders", JSON.stringify(sellerOrders));

    showNotification("Order status updated successfully!", "success");

    // Reload data
    loadSellerData();
    updateDashboardStats();
    loadOrdersTable();

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("orderModal")
    );
    modal.hide();
  }
}

function initializeCharts() {
  // Sales Chart
  const salesCtx = document.getElementById("salesChart");
  if (salesCtx) {
    salesChart = new Chart(salesCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Sales",
            data: [1200, 1900, 3000, 5000, 2000, 3000],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Products Chart
  const productsCtx = document.getElementById("productsChart");
  if (productsCtx) {
    productsChart = new Chart(productsCtx, {
      type: "doughnut",
      data: {
        labels: ["Smartphones", "Laptops", "Tablets", "Accessories"],
        datasets: [
          {
            data: [12, 19, 3, 5],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}

function updateCharts() {
  // Update charts with real data
  if (salesChart) {
    const monthlySales = calculateMonthlySales();
    salesChart.data.datasets[0].data = monthlySales;
    salesChart.update();
  }

  if (productsChart) {
    const categoryData = calculateCategoryDistribution();
    productsChart.data.labels = categoryData.labels;
    productsChart.data.datasets[0].data = categoryData.data;
    productsChart.update();
  }
}

function calculateMonthlySales() {
  // Calculate sales for last 6 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map(() => Math.floor(Math.random() * 5000) + 1000);
}

function calculateCategoryDistribution() {
  const categories = {};
  sellerProducts.forEach((product) => {
    categories[product.category] = (categories[product.category] || 0) + 1;
  });

  return {
    labels: Object.keys(categories),
    data: Object.values(categories),
  };
}

function loadRecentActivity() {
  const activityContainer = document.getElementById("recent-activity");
  if (!activityContainer) return;

  const activities = [
    {
      type: "order",
      message: "New order #ORD003 received",
      time: "2 hours ago",
    },
    {
      type: "product",
      message: 'Product "iPhone 15 Pro" stock updated',
      time: "4 hours ago",
    },
    { type: "sale", message: "Order #ORD002 completed", time: "1 day ago" },
    {
      type: "product",
      message: 'New product "MacBook Air" added',
      time: "2 days ago",
    },
  ];

  activityContainer.innerHTML = activities
    .map(
      (activity) => `
        <div class="d-flex align-items-center mb-3">
            <div class="flex-shrink-0">
                <i class="fas fa-${
                  activity.type === "order"
                    ? "shopping-cart"
                    : activity.type === "product"
                    ? "box"
                    : "dollar-sign"
                } text-primary"></i>
            </div>
            <div class="flex-grow-1 ms-3">
                <p class="mb-0">${activity.message}</p>
                <small class="text-muted">${activity.time}</small>
            </div>
        </div>
    `
    )
    .join("");
}

function logout() {
  Auth.logout();
  showNotification("Logged out successfully!", "success");
  setTimeout(() => {
    window.location.href = "../../index.html";
  }, 1000);
}

window.SellerDashboard = {
  initializeSellerDashboard,
  loadSellerData,
  updateDashboardStats,
  loadProductsTable,
  loadOrdersTable,
  filterProducts,
  filterOrders,
  showAddProductModal,
  editProduct,
  saveProduct,
  deleteProduct,
  viewOrderDetails,
  updateOrderStatus,
  initializeCharts,
  updateCharts,
  loadRecentActivity,
  logout,
};
