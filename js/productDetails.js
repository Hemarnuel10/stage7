
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const Product_API = `https://fakestoreapi.com/products/${productId}`

async function fetchProducts() {
    console.log("working")
    try {
      const response = await fetch(Product_API);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const product = await response.json();
      console.log(product);
      displayProductimage(product);
      displayProductDetail(product);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
}



function displayProductDetail(product){ 
    const rating = Math.round(product.rating.rate);
    let stars ="";
    console.log(stars);

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += "★";
        } else {
            stars += "☆";
        }
    }
    const productContainer = document.querySelector('.product-details');
    productContainer.innerHTML=`
        <div>
            <span class="text-[#9C6D53] text-xs font-bold">${product.category}</span>
            <h2 class="text-2xl font-extrabold">${product.title}</h2>
            <div class="flex items-center gap-2 py-1">
                <div class="flex text-[#F5A623]" aria-hidden="true">${stars}</div>
                <span class="text-sm font-semibold">${product.rating.rate}</span>
                <a href="#reviews" class="text-sm text-gray-500 underline">(${product.rating.count})</a>
            </div>
            <p class="text-2xl font-extrabold pt-1">$${product.price.toFixed(2)}</p>
        </div>

        <hr class="my-4">

        <div>
            <div class="flex justify-between pb-4">
                <p class="text-[12px] font-bold">COLOR</p>
                <p class="text-[12px]">Charcoal black</p>
            </div>
            <div class="flex gap-4">
                <button type="button" aria-label="Charcoal black" aria-pressed="true" class="size-10 rounded-full bg-black ring-2 ring-offset-2 ring-black"></button>
                <button type="button" aria-label="White" aria-pressed="false" class="size-10 rounded-full bg-white border border-[#EAEAEA]"></button>
                <button type="button" aria-label="Grey" aria-pressed="false" class="size-10 rounded-full bg-[#8E8E93]"></button>
            </div>
        </div>

        <div class="py-5">
            <div class="flex justify-between pb-4">
                <p class="text-[12px] font-bold">SIZE</p>
                <a href="#size-guide" class="text-[12px] underline text-[#9C6D53]">Size Guide</a>
            </div>
            <div class="flex gap-2">
                <button type="button" aria-pressed="false" class="flex-1 font-bold py-3 border border-[#EAEAEA] rounded-xl">S</button>
                <button type="button" aria-pressed="true" class="flex-1 font-bold py-3 rounded-xl bg-black text-white">M</button>
                <button type="button" aria-pressed="false" class="flex-1 font-bold py-3 border border-[#EAEAEA] rounded-xl">L</button>
                <button type="button" aria-pressed="false" class="flex-1 font-bold py-3 border border-[#EAEAEA] rounded-xl">XL</button>
            </div>
        </div>

        <div class="py-5">
            <p class="text-[12px] font-bold pb-4">QUANTITY</p>
            <div class="inline-flex items-center gap-6 border border-[#EAEAEA] rounded-xl px-4 py-2">
                <button type="button" aria-label="Decrease quantity" class="qty-decrease cursor-pointer text-gray-800 font-bold">-</button>
                <span class="qty-value font-semibold">1</span>
                <button type="button" aria-label="Increase quantity" class="qty-increase cursor-pointer text-gray-800 font-bold">+</button>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <button type="button" class="add-to-cart-btn bg-[#9C6D53] text-white cursor-pointer font-bold text-xs h-11 rounded-lg hover:opacity-70">Add to Cart</button>
            <button type="button" class="buy-now-btn bg-black text-white font-bold text-xs h-11 cursor-pointer rounded-lg hover:opacity-70">Buy Now</button>
        </div>

        <div class="pt-6">
            <span class="flex items-center gap-1 text-emerald-500 font-semibold text-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <circle cx="8" cy="8" r="8"/>
                </svg>
                In Stock — Ships tomorrow
            </span>
            <p class="flex gap-2 items-center text-[#555555] text-[12px] pt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d="M20 8h-3V4H1c-.55 0-1 .45-1 1v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-3zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm12 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 11l1.5 1.5H17V11h2z"/>
                </svg>
                Free express shipping on orders over $150
            </p>
        </div>`

            // Quantity stepper
    let selectedQuantity = 1;
    const qtyValueEl = productContainer.querySelector(".qty-value");
    const decreaseBtn = productContainer.querySelector(".qty-decrease");
    const increaseBtn = productContainer.querySelector(".qty-increase");

    decreaseBtn.addEventListener("click", () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            qtyValueEl.textContent = selectedQuantity;
        }
    });

    increaseBtn.addEventListener("click", () => {
        selectedQuantity++;
        qtyValueEl.textContent = selectedQuantity;
    });

    // Add to Cart / Buy Now
    const addToCartBtn = productContainer.querySelector(".add-to-cart-btn");
    const buyNowBtn = productContainer.querySelector(".buy-now-btn");

    addToCartBtn.addEventListener("click", () => {
        addToCart({ ...product, quantity: selectedQuantity });
    });

    buyNowBtn.addEventListener("click", () => {
        addToCart({ ...product, quantity: selectedQuantity });
        window.location.href = "./checkout.html";
    });
}

function displayProductimage(product){
    const productImage = document.querySelector('.product-image');
    productImage.innerHTML = `
         <img src="${product.image}" alt="${product.title}" class="rounded-2xl border border-[#9C6D53] h-[60%] w-[98%] md:aspect-4/5 object-contain justify-self-center bg-white p-4" loading="lazy">
        <div class="grid grid-cols-2 justify-between gap-2 my-4 lg:grid-cols-4">
            <img src="${product.image}" alt="${product.title}" class="rounded-lg h-30 w-[98%] border border-[#9C6D53] lg:w-full aspect-square object-contain bg-white p-4" loading="lazy">
            <img src="${product.image}" alt="${product.title}" class="rounded-lg h-30 w-[98%] border border-[#9C6D53] lg:w-full aspect-square object-contain bg-white p-4" loading="lazy">
            <img src="${product.image}" alt="${product.title}" class="rounded-lg h-30 w-[98%] border border-[#9C6D53] lg:w-full aspect-square object-contain bg-white p-4" loading="lazy">
           <img src="${product.image}" alt="${product.title}" class="rounded-lg h-30 w-[98%] border border-[#9C6D53] lg:w-full aspect-square object-contain bg-white p-4" loading="lazy">
        </div>
    `
}

fetchProducts()