const FINAL_ORDER = 'cart_order';

function displayOrderSummary(){
     const orderSummaryContainer = document.querySelector('.order-summary');
        orderSummaryContainer.innerHTML=`
            <div class="flex flex-col gap-4 pb-4">            
                <p class="flex justify-between text-[13px]">Subtotal <span class="products-cost font-semibold"></span></p>
                <p class="flex justify-between text-[13px]">Shipping <span class="shipping-fee font-semibold"></span></p>
                <p class="flex justify-between text-[13px]">Discount <span class="discount font-semibold"></span></p>
                <p class="flex justify-between text-[13px]">Tax <span class="tax font-semibold"></span></p>
                <hr>
                <p class="flex justify-between  text-[15px] font-extrabold">Total <span class="total-price font-extrabold"></span></p>
            </div>`
    findTotalPrice()    
}

const placeOrderBtn = document.querySelector('.place-order-btn');
console.log(!placeOrderBtn)

function showFieldError(input, message){
    clearFieldError(input);
    input.classList.add("ring-red-400");
    input.setAttribute("aria-invalid", "true");
    const error = document.createElement("p");
    error.className = "field-error text-[11px] text-red-500 mt-1";
    error.textContent = message;
    input.insertAdjacentElement("afterend", error);
}

function validateCheckoutForm(form){
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
        clearFieldError(field);
        if (!field.value.trim()) {
            showFieldError(field, "This field is required");
            isValid = false;
        }
        else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
            showFieldError(field, "Enter a valid email address.");
            isValid = false;
        }
    });

    return isValid;
}

function clearFieldError(input){
    input.classList.remove("ring-red-400");
    input.removeAttribute("aria-invalid");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("field-error")) next.remove();
}

function placeOrder(event){
    event.preventDefault();
    console.log("working");

    const billingForm = document.querySelector("#billing-form");
    const paymentForm = document.querySelector("#payment-form");

    const billingValid = billingForm ? validateCheckoutForm(billingForm) : true;
    const paymentValid = paymentForm ? validateCheckoutForm(paymentForm) : true;

    
    const { cartItems, subtotal, discount, shipping, tax, total } = calculateTotalCost();

    if (cartItems.length === 0){
        window.location.href = "./shop.html";
        return;
    }

    if (!billingValid || !paymentValid) {
        const firstError = document.querySelector(".field-error");
        if (firstError) firstError.closest("div")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    const order = {
        orderNumber: `VR ${new Date().getFullYear()}-${Math.floor(1000 + Math.random()*900)}`,
        placedAt: new Date().toISOString(),
        items: cartItems,
        subtotal,
        discount,
        shipping,
        tax,
        total
    }
    
    localStorage.setItem(FINAL_ORDER, JSON.stringify(order))
    saveCartItems([]); // clear the cart now that the order is placed
    window.location.href = "./confirmation.html";
}


if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
    console.log("done")
}
displayOrderSummary()
