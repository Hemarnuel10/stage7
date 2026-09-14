const API_URL = 'https://fakestoreapi.com/products';
const PROMO_KEY = "promoCode";
const CART_STORAGE = "cart"
function getCartItems() {
  try{
    return JSON.parse(localStorage.getItem(CART_STORAGE)) || [];
  } catch (error) {
    console.error('Error parsing cart items from localStorage:', error);
    return [];
  }
}

function saveCartItems(cartItems) {
  localStorage.setItem(CART_STORAGE, JSON.stringify(cartItems));
  updateCartCountBadge()
}

function showFeaturedProduct(products) {
  const featuredProduct = document.querySelector('.featured-product');
  const randomProducts = products
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  if(featuredProduct) {
    featuredProduct.innerHTML = "";
    randomProducts.forEach((product) => {
      const productCard = document.createElement('article')
      productCard.classList.add('bg-white', 'border-2', 'border-[#EAEAEA]', 'rounded-2xl')
      productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="rounded-t-2xl max-h-48 object-contain w-full md:aspect-5/4">
          <div class="m-3 flex gap-1 flex-col">
              <p class="font-semibold text-[10px] text-gray-400">${product.category.toUpperCase()}</p>
              <p class="font-semibold text-[13px]">${product.title.slice(0, 30)}</p>
              <p class="font-bold text-[13px]">$<span class="product-price">${product.price.toFixed(2)}</span></p>
              <button class="add-to-cart-btn bg-black text-white w-full text-xs font-bold h-9 rounded-md cursor-pointer hover:bg-gray-800">Add to Cart</button>
          </div>
      `
      featuredProduct.appendChild(productCard);

      productCard.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
      });
    });
  };
};


async function fetchFeaturedProduct() {
    try {
      const response = await fetch(API_URL)
      console.log(response.status)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const products = await response.json();
      showFeaturedProduct(products);
      console.log('Featured product displayed successfully.')
    } catch (error) {
      console.error('Error fetching featured product:', error)
      return null
    }
};

// CART SECTION
function addToCart(product) {
  const cartItems = getCartItems();
  const quantity = product.quantity || 1;

  const existing = cartItems.find((item) => item.title === product.title && item.category === product.category);
  if(existing) {
    existing.quantity += quantity;
  }
  else{
    cartItems.push({
        image: product.image,
        title: product.title,
        price: Number(product.price) || 0,
        category: product.category,
        quantity: quantity,
      });
  }

  saveCartItems(cartItems)

  if (document.querySelector(".cart-items")) {
    displayCartItems();
  }
  return cartItems
};

function removeFromCart(index){
  const cartItems = getCartItems();
  cartItems.splice(index, 1);
  saveCartItems(cartItems);
}

function updateCartCountBadge(){
  const cartItems = getCartItems();
  const totalUnits = cartItems.reduce((total, item) => total +(Number(item.quantity) || 0), 0);

  console.log(`Total units in cart: ${totalUnits}`);
  const Count = document.querySelectorAll('.cart-count');
  Count.forEach((element) => {
    element.textContent = `(${totalUnits})`;
  })
}

function calculateTotalCost(){
  const cartItems = getCartItems();
  const promoCode = (localStorage.getItem(PROMO_KEY) || "").trim().toUpperCase();

  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return total + price * quantity;
  }, 0);

  let discount = 0;
  if (promoCode === "DISCOUNT10" && subtotal > 0) {
    discount = subtotal * 0.10;
  }
  else if (promoCode === "DISCOUNT20" && subtotal > 0) {
    discount = subtotal * 0.20;
  }
  else if (promoCode === "DISCOUNT30" && subtotal > 0) {
    discount = subtotal * 0.30;
  }
  else if (promoCode === "DISCOUNT80" && subtotal > 0) {
    discount = subtotal * 0.80;
  }

  const shipping = subtotal === 0 ? 0 : subtotal > 400 ? subtotal * 0.02 : 10.0;
 
  const taxEl = document.querySelector(".tax");
  const tax = taxEl ? subtotal * 0.08 : 0;
  
  const total = subtotal + shipping + tax - discount;

  return { cartItems, subtotal, discount, shipping, tax, total, promoCode };
}

function displayCartItems() {
  updateCartCountBadge()
  const cartContainer = document.querySelector('.cart-items');
  // const cartCount = document.querySelector('.cart-count');
  // if (cartCount) {
  //   cartCount.textContent = `(${cartItems.length})`;
  // }

  if (cartContainer) {
    const cartItems = getCartItems();
    const ProceedToCheckoutBtn = document.querySelector('.proceed-to-checkout');
    const promoCodeBtn = document.querySelector('#apply-code'); 
    cartContainer.innerHTML = "";
    console.log(`Cart items to display: ${cartItems.length}`);
    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="flex flex-col items-center gap-3 py-16 text-center">
          <p class="font-bold text-sm">Your cart is empty</p>
          <p class="text-xs text-[#8E8E93]">Items you add to your cart will show up here.</p>
          <a href="./shop.html" class="mt-2 bg-black text-white text-xs font-bold px-6 py-3 rounded-lg">Start Shopping</a>
        </div>`;
        findTotalPrice();
      
      
      if (promoCodeBtn) {
        promoCodeBtn.disabled = true;
        promoCodeBtn.classList.add('is-disabled', 'bg-[#9C6D53]/50');
      }

      if (ProceedToCheckoutBtn) {
        ProceedToCheckoutBtn.disabled = true;
        ProceedToCheckoutBtn.classList.add('is-disabled', 'bg-[#9C6D53]/50');
      }

      console.log('Cart is empty, displayed empty cart message.');
    }

    else{
      cartItems.forEach((item, index) => {
        console.log(`Displaying item: ${item.title}, Quantity: ${item.quantity}, Price: ${item.price}`);
        const cartItem = document.createElement('div');
        cartItem.classList.add('flex', 'items-center', 'gap-4');
        cartItem.innerHTML = `
          <div class="flex bg-[white] justify-between border border-[#EAEAEA] rounded-xl p-3 w-full">
            <div class="flex gap-3">
              <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain self-center rounded-md">
              <div>
                <span class="text-[10px] font-semibold text-[#8E8E93]">${item.category}</span>
                <h3 class="text-[14px] font-bold text-wrap">${item.title}</h3>
                <p class="text-[11px]">Available now</p>
                <p class="text-[14px] font-extrabold">$${Number(item.price).toFixed(2)}</p>
              </div>
            </div>
            <div class="flex flex-col gap-6">
              <button type="button" class="remove-cart-item self-end" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </button>
              <div class="inline-flex text-[11px] items-center gap-4 border border-[#EAEAEA] rounded-xl px-4 py-2">
                <button type="button" class="decrease-cart-item text-gray-400 font-bold">-</button>
                <span class="font-semibold">${item.quantity}</span>
                <button type="button" class="increase-cart-item text-gray-800 font-bold">+</button>
              </div>
            </div>
          </div>
        `;
        cartContainer.appendChild(cartItem);

        const increaseButton = cartItem.querySelector('.increase-cart-item');
        const decreaseButton = cartItem.querySelector('.decrease-cart-item');
        const removeButton = cartItem.querySelector('.remove-cart-item');

        removeButton.addEventListener('click', () => {
          removeFromCart(index);
          displayCartItems();
        });

        decreaseButton.addEventListener('click', () => {
          const cart = getCartItems();
          if (cart[index].quantity > 1) cart[index].quantity--;
          saveCartItems(cart);
          displayCartItems();
        });

        increaseButton.addEventListener('click', () => {
          const cart = getCartItems();
          cart[index].quantity++;
          saveCartItems(cart);
          displayCartItems();
        });
      });
    }
    findTotalPrice();
  }
}


function applyPromoCode() {
  const promoCodeInput = document.querySelector('#promo-code');
  const applyButton = document.querySelector('#apply-code');

  applyButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (promoCodeInput) {
      promoCodeInput.addEventListener('input', () => {
        const promoCode = promoCodeInput.value.trim();
        localStorage.setItem(PROMO_KEY, promoCode);
        findTotalPrice();
      });
    }
  });
};


function findTotalPrice() {
  const { subtotal, discount, shipping, tax, total } = calculateTotalCost();
  const subtotalEl = document.querySelector(".products-cost");
  const discountEl = document.querySelector(".discount");
  const shippingEl = document.querySelector(".shipping-fee");
  const taxEl = document.querySelector(".tax");
  const totalEl = document.querySelector(".total-price");
  const btnTotalPriceEl= document.querySelector(".btn-total-price")

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (discountEl) discountEl.textContent = `-$${discount.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (btnTotalPriceEl) btnTotalPriceEl.textContent = `($${total.toFixed(2)})`;

  return total;
}

function initPromoCode() {
  const promoCodeInput = document.querySelector("#promo-code");
  const applyButton = document.querySelector("#apply-code");
  if (!promoCodeInput || !applyButton) return;

  // Restore any previously applied code
  promoCodeInput.value = localStorage.getItem(PROMO_KEY) || "";
  if(applyButton){
    applyButton.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.setItem(PROMO_KEY, promoCodeInput.value.trim());
      findTotalPrice();
    });
}

  if(promoCodeInput){
    promoCodeInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        localStorage.setItem(PROMO_KEY, promoCodeInput.value.trim());
        findTotalPrice();
      }
    });
  }
}

// VALIDATE FORM

function showFieldError(input, message) {
  clearFieldError(input);
  input.classList.add("ring-red-400");
  input.setAttribute("aria-invalid", "true");
  const error = document.createElement("p");
  error.className = "field-error text-[11px] text-red-500 mt-1";
  error.textContent = message;
  input.insertAdjacentElement("afterend", error);
}

function clearFieldError(input) {
  input.classList.remove("ring-red-400");
  input.removeAttribute("aria-invalid");
  const next = input.nextElementSibling;
  if (next && next.classList.contains("field-error")) next.remove();
}

function validateContactForm(form) {
  let isValid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    clearFieldError(field);
    if (!field.value.trim()) {
      showFieldError(field, "This field is required");
      isValid = false;
    } else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
      showFieldError(field, "Enter a valid email address.");
      isValid = false;
    }
  });
  return isValid;
}

fetchFeaturedProduct();
displayCartItems();
initPromoCode();
console.log(findTotalPrice())
