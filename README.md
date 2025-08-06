# ElectroMart - Multi-Actor E-commerce System

A comprehensive e-commerce platform built with HTML5, CSS3, JavaScript (ES6), and Bootstrap for electronics retail. The system supports three user roles: Customers, Sellers, and Admins, each with specific functionalities and access levels.

## 🚀 Features

### Core Features
- **User Authentication**: Secure login/register system with role-based access
- **Product Catalog**: Browse, search, and filter electronics products
- **Shopping Cart**: Add, remove, and manage cart items
- **Checkout Process**: Complete purchase flow with payment integration
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Local Storage**: Data persistence using browser localStorage

### User Roles

#### 👤 Customer
- Browse and search products
- Add items to cart
- Complete purchases
- View order history
- Manage account details

#### 🏪 Seller
- Add, edit, and delete products
- Manage inventory
- Process orders
- View sales analytics
- Manage store profile

#### 👨‍💼 Admin
- Full system access
- Manage user accounts
- Moderate product listings
- Handle customer service
- System analytics and reporting

## 📁 Project Structure

```
ElectroMart/
├── index.html                 # Homepage
├── assets/
│   ├── css/
│   │   └── main.css          # Main stylesheet
│   ├── js/
│   │   ├── main.js           # Core functionality
│   │   ├── auth.js           # Authentication system
│   │   ├── cart.js           # Shopping cart logic
│   │   ├── catalog.js        # Product catalog
│   │   ├── cart-page.js      # Cart page functionality
│   │   ├── login.js          # Login page logic
│   │   └── register.js       # Registration logic
│   └── images/               # Product images
├── pages/
│   ├── catalog.html          # Product catalog page
│   ├── cart.html            # Shopping cart page
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── product.html         # Individual product page
│   ├── checkout.html        # Checkout process
│   ├── about.html           # About page
│   ├── contact.html         # Contact page
│   └── dashboard/           # Dashboard pages
│       ├── customer.html    # Customer dashboard
│       ├── seller.html      # Seller dashboard
│       └── admin.html       # Admin panel
└── README.md               # Project documentation
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced styling with custom properties and animations
- **JavaScript (ES6)**: Modern JavaScript with modules and classes
- **Bootstrap 5**: Responsive framework for UI components
- **Font Awesome**: Icon library for UI elements
- **Chart.js**: Data visualization for analytics (planned)

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Or** use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Demo Accounts

For testing purposes, the following demo accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@example.com | password123 |
| Seller | seller@example.com | password123 |
| Admin | admin@example.com | password123 |

## 📋 Usage Guide

### For Customers

1. **Browse Products**
   - Visit the homepage or catalog page
   - Use filters to find specific products
   - Search by product name or description

2. **Add to Cart**
   - Click "Add to Cart" on any product
   - View cart by clicking the cart icon
   - Adjust quantities or remove items

3. **Checkout**
   - Login or register an account
   - Review cart and apply coupons
   - Complete payment information
   - Receive order confirmation

### For Sellers

1. **Access Dashboard**
   - Login with seller account
   - Navigate to Seller Dashboard

2. **Manage Products**
   - Add new products with images and details
   - Edit existing product information
   - Update inventory levels

3. **Process Orders**
   - View incoming orders
   - Update order status
   - Track sales analytics

### For Admins

1. **System Management**
   - Login with admin account
   - Access Admin Panel

2. **User Management**
   - View all user accounts
   - Reset passwords
   - Delete user accounts

3. **Content Moderation**
   - Review product listings
   - Approve/reject products
   - Monitor system activity

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface

### Modern UI/UX
- Clean and intuitive design
- Smooth animations and transitions
- Consistent color scheme
- Professional typography

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility

## 🔧 Customization

### Styling
- Modify `assets/css/main.css` for custom styles
- Update CSS custom properties for theme colors
- Add new animations and effects

### Functionality
- Extend JavaScript modules in `assets/js/`
- Add new features to existing pages
- Integrate with external APIs

### Content
- Update product data in `main.js`
- Modify sample users in `auth.js`
- Customize text content in HTML files

## 📊 Data Management

### Local Storage Structure
```javascript
// Users
localStorage.setItem('users', JSON.stringify(users))

// Current User
localStorage.setItem('currentUser', JSON.stringify(user))

// Products
localStorage.setItem('products', JSON.stringify(products))

// Cart
localStorage.setItem('cart', JSON.stringify(cart))
```

### Sample Data
The system includes sample products and users for demonstration:
- 8 sample electronics products
- 3 demo user accounts
- Pre-configured categories and filters

## 🔒 Security Features

### Authentication
- Password validation and strength checking
- Email format verification
- Session management
- Role-based access control

### Data Protection
- Input validation and sanitization
- XSS prevention
- Secure form handling
- Local storage encryption (planned)

## 🚀 Future Enhancements

### Planned Features
- **Payment Integration**: Stripe/PayPal integration
- **Real-time Chat**: Customer support system
- **Advanced Analytics**: Detailed sales reports
- **Email Notifications**: Order updates and marketing
- **Product Reviews**: Customer feedback system
- **Wishlist**: Save favorite products
- **Advanced Search**: Elasticsearch integration
- **Mobile App**: React Native companion app

### Technical Improvements
- **Backend API**: Node.js/Express server
- **Database**: MongoDB/PostgreSQL integration
- **Authentication**: JWT tokens
- **File Upload**: Cloud storage integration
- **Caching**: Redis implementation
- **Testing**: Jest unit tests
- **CI/CD**: Automated deployment

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development**: HTML5, CSS3, JavaScript
- **UI/UX Design**: Bootstrap 5, Custom CSS
- **Architecture**: Modular JavaScript, Local Storage
- **Documentation**: Comprehensive README and inline comments

## 📞 Support

For support or questions:
- Check the documentation
- Review the code comments
- Test with demo accounts
- Report issues with detailed descriptions

## 🎯 Project Goals

- **Educational**: Demonstrate modern web development practices
- **Functional**: Complete e-commerce workflow
- **Scalable**: Modular architecture for easy expansion
- **User-Friendly**: Intuitive interface for all user types
- **Professional**: Production-ready code quality

---

**ElectroMart** - Your trusted source for quality electronics and gadgets! ⚡ 