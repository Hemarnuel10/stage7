console.log("loading")
async function fetchProducts() {
    console.log("working")
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
}

async function displayShopProducts() {
    const filterBar = document.querySelector('.category-filters');
    const shopGrid = document.querySelector('.shop-grid');
    const resultCount = document.querySelector('.shop-result-count');

    try {
        const products = (typeof ALL_PRODUCT !== 'undefined' && ALL_PRODUCT.length)
            ? ALL_PRODUCT
            : await fetchProducts();
        ALL_PRODUCT = products;
        console.log("still working1")
        const categories = ["all", ...new Set(products.map((product) => product.category))];
        
        if (filterBar) {
            filterBar.innerHTML = categories.map((category) => `
            <button type="button"
                class="category-btn border border-[#EAEAEA] rounded-full px-4 py-2 text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-bg duration-200 hover:bg-amber-900"
                data-category="${category}"
            >${category}</button>
            `).join("");

            const getAllBtn = filterBar.querySelector('[data-category="all"]');

            getAllBtn.classList.add('border-amber-800');

            filterBar.querySelectorAll(".category-btn").forEach((btn) => {
                btn.addEventListener('click', () => {
                    filterBar.querySelectorAll(".category-btn").forEach((button) => {
                            button.classList.remove('border-amber-800');
                        });

                    btn.classList.add('border-amber-800');

                    displayProducts(btn.dataset.category);
                });
            });

            console.log("still working2")

            function displayProducts(category){
                const filtered = products.filter((product) => category === "all" || product.category === category);
                if (!shopGrid) return;
                shopGrid.innerHTML = filtered.map((product) => `
                <article class="product-card bg-white border-2 border-[#EAEAEA] rounded-2xl flex flex-col" data-product-id="${product.id}">
                    <a href="./product.html?id=${product.id}" class="block">
                        <img src="${product.image}" alt="${product.title}" class="rounded-t-2xl h-40 w-full md:aspect-5/4 object-contain bg-white p-4" loading="lazy">
                    </a>
                    <div class="m-3 flex gap-1 flex-col grow">
                        <p class="font-semibold text-[10px] text-gray-400">${product.category.toUpperCase()}</p>
                        <a href="./product.html?id=${product.id}" class="font-semibold text-[13px] hover:text-[#9C6D53]">${product.title.slice(0, 40)}${product.title.length > 40 ? "…" : ""}</a>
                        <p class="font-bold text-[13px] mt-auto">$<span class="product-price">${product.price.toFixed(2)}</span></p>
                        <button data-product-id="${product.id}" class="add-to-cart-btn bg-black text-white w-full text-xs font-bold h-9 rounded-md cursor-pointer hover:bg-gray-800 mt-2">Add to Cart</button>
                    </div>
                </article>
                `).join("");

                if (resultCount) resultCount.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"}`;
                
                document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                    btn.addEventListener('click', (event) => {
                        const product = event.currentTarget.closest('.product-card');
                        const productId = Number(product.dataset.productId);
                        const findProduct = filtered.find(p => p.id === productId)
                        console.log(findProduct)
                        addToCart(findProduct);
                        console.log("added")
                    });
                });
            }

            displayProducts("all");
        };
    } catch(error) {
        console.error("Error fetching shop products:", error);
        if (shopGrid) shopGrid.innerHTML = `<p class="col-span-full text-xs text-[#8E8E93]">Couldn't load products right now. Please try again shortly.</p>`;
    }
}

displayShopProducts();

// display individual products

