document.addEventListener("DOMContentLoaded", function () {
  // Header Scroll
  let header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("shadow", window.scrollY > 0);
  });

  const products = [
    {
      id: 1,
      title: "Logitech G502 HERO Gaming RGB Mouse",
      manufacturer: "Logitech",
      price: "$49.99",
      productImg: "images/mouse1.jpg",
    },
    {
      id: 2,
      title: "Corsair K95 RGB Platinum Mechanical Keyboard",
      manufacturer: "Corsair",
      price: "$159.99",
      productImg: "images/keyboard1.jpg",
    },
    {
      id: 3,
      title: "Asus ROG Swift PG279Q Gaming Monitor",
      manufacturer: "Asus",
      price: "$699.99",
      productImg: "images/monitor1.jpg",
    },
    {
      id: 4,
      title: "NZXT H510 Compact ATX Mid-Tower Case",
      manufacturer: "NZXT",
      price: "$69.99",
      productImg: "images/case1.jpg",
    },
    {
      id: 5,
      title: "Samsung 970 EVO SSD",
      manufacturer: "Samsung",
      price: "$129.99",
      productImg: "images/ssd1.jpg",
    },
    {
      id: 6,
      title: "Seagate Internal Hard Drive",
      manufacturer: "Seagate",
      price: "$79.99",
      productImg: "images/hdd1.jpg",
    },
    {
      id: 7,
      title: "Crucial Ballistix RAM",
      manufacturer: "Crucial",
      price: "$69.99",
      productImg: "images/ram1.jpg",
    },
    {
      id: 8,
      title: "EVGA GeForce RTX 3080",
      manufacturer: "EVGA",
      price: "$799.99",
      productImg: "images/gpu1.jpg",
    },
    {
      id: 9,
      title: "AMD Ryzen 7 5800X Processor",
      manufacturer: "AMD",
      price: "$449.99",
      productImg: "images/cpu1.jpg",
    },
    {
      id: 10,
      title: "MSI MPG X570 GAMING EDGE WIFI Motherboard",
      manufacturer: "MSI",
      price: "$209.99",
      productImg: "images/motherboard1.jpg",
    },
    {
      id: 11,
      title: "HyperX Cloud II Gaming Headset",
      manufacturer: "HyperX",
      price: "$99.99",
      productImg: "images/headset1.jpg",
    },
    {
      id: 12,
      title: "TP-Link Archer AX50 Wi-Fi 6 Router",
      manufacturer: "TP-Link",
      price: "$149.99",
      productImg: "images/router1.jpg",
    },
  ];

  // Get the products list and elements
  const productList = document.getElementById("productList");
  const cartItemsElement = document.getElementById("cartItems");
  const cartTotalElement = document.getElementById("cartTotal");
  const checkoutTotalElement = document.querySelector(".checkout-total");

  // Store Cart Items In Local Storage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Render Products On Page
  function renderProducts() {
    productList.innerHTML = products
      .map(
        (product) => `
   <div class="product">
   <img src="${product.productImg}" alt="${
          product.title
        }" class="product-img" />
   <div class="product-info">
     <p class="product-manufacturer">${product.manufacturer}</p>
     <h2 class="product-title">${product.title}</h2>
     <p class="product-price">$${parseFloat(
       product.price.replace("$", "")
     ).toFixed(2)}</p>
     <a class="add-to-cart" data-id="${product.id}">Add to cart</a>
   </div>
 </div>
   `
      )
      .join("");
    // Add to cart
    const addToCartButtons = document.getElementsByClassName("add-to-cart");
    for (let i = 0; i < addToCartButtons.length; i++) {
      const addToCartButton = addToCartButtons[i];
      addToCartButton.addEventListener("click", addToCart);
    }
  }

  // Add to cart
  function addToCart(event) {
    const productID = parseInt(event.target.dataset.id);
    const product = products.find((product) => product.id === productID);

    if (product) {
      // If product already in cart
      const exixtingItem = cart.find((item) => item.id === productID);

      if (exixtingItem) {
        exixtingItem.quantity++;
      } else {
        const cartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          productImg: product.productImg,
          quantity: 1,
        };

        cart.push(cartItem);
      }
      // Change Add to cart text to added
      event.target.textContent = "Added";
      updateCartIcon();
      saveToLocalStorage();
      renderCartItems();
      calculateCartTotal();
    }
  }

  // Remove from cart
  function removeFromCart(event) {
    const productID = parseInt(event.target.dataset.id);
    cart = cart.filter((item) => item.id !== productID);
    saveToLocalStorage();
    renderCartItems();
    updateCartIcon();
    calculateCartTotal();
  }

  // Quantity Change
  function changeQuantity(event) {
    const productID = parseInt(event.target.dataset.id);
    const quantity = parseInt(event.target.value);

    if (quantity > 0) {
      const cartItem = cart.find((item) => item.id === productID);
      if (cartItem) {
        cartItem.quantity = quantity;
        saveToLocalStorage();
        updateCartIcon();
        calculateCartTotal();
      }
    }
  }
  // SaveToLocalStorage
  function saveToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Render Cart Items
  function renderCartItems() {
    cartItemsElement.innerHTML = cart
      .map(
        (item) => `
     <div class="cart-item">
       <img src="${item.productImg}" alt="${item.title}" />
       <div class="cart-item-info">
         <h2 class="cart-item-title">${item.title}</h2>
         <input
           class="cart-item-quantity"
           type="number"
           name=""
           min="1"
           value="${item.quantity}"
           data-id="${item.id}"
         />
       </div>
       <h2 class="cart-item-price">$${parseFloat(
         item.price.replace("$", "")
       ).toFixed(2)}</h2>
       <button class="remove-from-cart" data-id="${item.id}">Remove</button>
     </div>
   `
      )
      .join("");

    // Remove From Cart
    const removeButtons = document.getElementsByClassName("remove-from-cart");
    for (let i = 0; i < removeButtons.length; i++) {
      const removeButton = removeButtons[i];
      removeButton.addEventListener("click", removeFromCart);
    }
    // Quantity Change
    const quantityInputs = document.querySelectorAll(".cart-item-quantity");
    quantityInputs.forEach((input) => {
      input.addEventListener("change", changeQuantity);
    });
  }

  // Calculate Total
  function calculateCartTotal() {
    const taxRate = 0.2; // 20% tax rate
    const subtotal = cart.reduce(
      (sum, item) =>
        sum + parseFloat(item.price.replace("$", "")) * item.quantity,
      0
    );
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    // Update cart total element if it exists
    if (cartTotalElement) {
      cartTotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    }

    // Update checkout total element if it exists
    if (checkoutTotalElement) {
      checkoutTotalElement.innerHTML = `
            Subtotal: $${subtotal.toFixed(2)} <br>
            Tax (20%): $${taxAmount.toFixed(2)} <br>
            Total (incl. tax): $${total.toFixed(2)}
        `;
    }
  }

  // Check If On Cart Page
  if (window.location.pathname.includes("cart.html")) {
    renderCartItems();
    calculateCartTotal();
  } else if (window.location.pathname.includes("checkout.html")) {
    calculateCartTotal();
  } else {
    renderProducts();
  }

  // Cart Icon Quantity
  const cartIcon = document.getElementById("cart-icon");

  updateCartIcon();

  function updateCartIconOnCartChange() {
    updateCartIcon();
  }

  window.addEventListener("storage", updateCartIconOnCartChange);

  function updateCartIcon() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.getElementById("cart-icon");
    cartIcon.setAttribute("data-quantity", totalQuantity);
  }

  const checkoutForm = document.getElementById("checkout-form");
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Show alert
    alert("Order placed successfully!");

    // Clear the cart
    clearCart();

    // Redirect to index.html
    window.location.href = "index.html";
  });

  // Function to clear cart data from localStorage
  function clearCart() {
    localStorage.removeItem("cart");
  }
  // Initial render
  renderProducts();
  renderCartItems();
  calculateCartTotal();
});
