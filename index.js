

      

      window.addEventListener('load',function(){
        (async function(){
         allproduct=await fetch('https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json');
     productjeson = await allproduct.json();
   electronicproduct =  productjeson.filter(product=> product.category =='Electronics & Gadgets');
   localStorage.setItem('productselectronic', JSON.stringify(electronicproduct));
  var homeproduct =  this.document.getElementById('homeproduct');
  
      homeproduct.innerHTML=electronicproduct.slice(0,3).map(product => ` <div  class="col-lg-4 col-md-6">
            <div class="card product-card h-100">
                <img src='${product.image} 'class="card-img-top img-fluid w-50 text-aline-center d-block mt-5"  alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <div class="product-rating mb-2">
                    ${generateStarRating(product.rating.stars)}
                        <small class="text-muted">(${product.rating.stars})</small>
                    </div>
                    <div class="product-price mb-3">EGP${product.priceCents.toFixed(1)}</div>
                    <div class="mt-auto">
                        <button class="btn btn-primary w-100 mb-2" onclick="addToCart()">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <a href="pages/product.html?id=${product.id}" class="btn btn-outline-primary w-100">
                            View Details
                        </a>
                    </div>
                </div>

            </div>
          </div>`).join('');
        
      })()    
    
      })