function deliveryDateCalculation(placedAt){
    const orderDate = new Date(placedAt);
    const startDate = new Date(orderDate);
    startDate.setDate(startDate.getDate() + 3);
    const endDate = new Date(orderDate);
    endDate.setDate(endDate.getDate() + 6);

    const template = {month:"short", day:"numeric"};
    const startLabel = startDate.toLocaleDateString("en-US", template);
    const endLabel = endDate.toLocaleDateString("en-US", {...template, year:"numeric"});

    return `${startLabel}-${endLabel}`
}

const lastOrderItems = localStorage.getItem('cart_order');

if (!lastOrderItems){
    window.location.href = "./shop.html";
}

 let order;
  try {
    order = JSON.parse(lastOrderItems);
  } catch (err) {
    console.error("Could not parse last order:", err);
    window.location.href = "./shop.html";
  }


  const set = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  set(".order-number", `#${order.orderNumber}`);
  set(".order-delivery", deliveryDateCalculation(order.placedAt));


const itemsContainer = document.querySelector("#receipt-items");
console.log(itemsContainer)
if (itemsContainer) {
itemsContainer.innerHTML = order.items.map((item) => `
    <div class="flex items-center justify-between py-3">
    <div class="flex gap-3">
        <img src="${item.image}" alt="${item.title}" class="rounded-lg w-12 h-12 object-cover">
        <div>
        <h3 class="text-[14px] font-bold">${item.title}</h3>
        <p class="text-[11px]">Qty: <span>${item.quantity}</span></p>
        </div>
    </div>
    <p class="font-bold text-[13px]">$${(item.price * item.quantity).toFixed(2)}</p>
    </div>
`).join("");
}

set(".receipt-subtotal", `$${order.subtotal.toFixed(2)}`);
set(".receipt-shipping", `$${order.shipping.toFixed(2)}`);
set(".receipt-tax", `$${order.tax.toFixed(2)}`);
set(".receipt-discount", `-$${order.discount.toFixed(2)}`);
set(".receipt-total", `$${order.total.toFixed(2)}`);

const continueBtn = document.querySelector("#continue-shopping-btn");
if (continueBtn) {
continueBtn.addEventListener("click", () => {
    window.location.href = "./home.html";
});
}