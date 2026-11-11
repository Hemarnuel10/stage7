# VĒRA

A responsive, multi-page e-commerce storefront built with HTML, Tailwind CSS and vanilla JavaScript. Products come from the [Fake Store API](https://fakestoreapi.com), and the cart, promo codes and order data are stored in the browser with `localStorage`, so the whole shopping flow works without a backend.

**Live demo:** [add your deployed link here](https://hemarnuel10.github.io/stage7/)

## Features

**Browsing**
- Home page with four randomly selected featured products on each load
- Shop page with category filter buttons and a live item count
- Product page with image gallery, star rating, quantity stepper, "Add to Cart" and "Buy Now"
- Search bar in the header that sends the query to the shop page (`shop.html?search=...`)
- "Complete Your Look" product suggestions on the product page

**Cart**
- Add, remove, and increase or decrease item quantities
- Live cart count badge in the header on every page
- Order summary showing subtotal, shipping, discount and total
- Promo codes: `DISCOUNT10`, `DISCOUNT20`, `DISCOUNT30`, `DISCOUNT80`
- Shipping is a flat $10, or 2% of the subtotal on orders above $400
- Cart persists between visits and page reloads

**Checkout**
- Billing and payment forms with required-field and email validation
- Inline error messages and scroll-to-first-error behaviour
- Order summary with an 8% tax line
- Empty carts are redirected back to the shop

**Confirmation**
- Generated order number and estimated delivery window (3 to 6 days from the order date)
- Itemised receipt with subtotal, shipping, tax, discount and grand total

**Other pages**
- About page
- Contact form with validation and a success message
- Mobile navigation menu that opens and closes on small screens

## Tech Stack

- HTML5
- [Tailwind CSS v4](https://tailwindcss.com) (browser CDN build)
- JavaScript (ES6+, no framework)
- [Inter](https://rsms.me/inter/) typeface
- [Fake Store API](https://fakestoreapi.com) for product data
- `localStorage` for cart, promo code and last order

## Project Structure

```
stage7/
├── index.html
├── shop.html
├── product.html
├── cart.html
├── checkout.html
├── confirmation.html
├── about.html
├── contact.html
├── styles/
│   └── style.css
└── js/
    ├── index.js            # shared: menu, cart logic, totals, promo codes, search, home page
    ├── shop.js             # shop grid and category filters
    ├── productDetails.js   # single product view
    ├── checkout.js         # form validation and order placement
    ├── confirmation.js     # receipt and delivery estimate
    └── contact.js          # contact form validation
```

`js/index.js` is loaded on every page because it holds the shared cart functions (`getCartItems`, `addToCart`, `calculateTotalCost` and others) that the other scripts depend on.

## Getting Started

### Prerequisites

- A modern web browser
- An internet connection (Tailwind, fonts and product data load from external sources)

### Installation

```bash
git clone https://github.com/Hemarnuel10/stage7.git
cd stage7
```

### Running locally

Open `index.html` in your browser, or serve the folder with a local server such as the VS Code Live Server extension:

```bash
npx serve .
```

## How It Works

1. Products are fetched from the Fake Store API and rendered with JavaScript.
2. "Add to Cart" saves the item to `localStorage` under the `cart` key and updates the header badge.
3. Promo codes are saved under `promoCode` and applied whenever totals are calculated.
4. Placing an order saves a receipt under `cart_order`, clears the cart and redirects to the confirmation page, which reads the receipt back.

## Known Limitations

- No real payment processing. The checkout forms are validated but nothing is sent anywhere.
- The contact form and newsletter forms have no backend.
- Colour and size selectors on the product page are visual only and are not saved with the cart item.
- Search takes you to the shop page but does not filter the product list yet.
- Product data comes from a public demo API, so items and images are placeholders.

## Future Improvements

- Filter shop results by the search query
- Save selected size and colour with each cart item
- Real payment integration and order storage
- User accounts and order history
- Wishlist

## What I Learned

- Structuring shared logic across multiple pages without a framework
- Managing state with `localStorage`
- Consuming a REST API with `fetch` and handling errors
- Form validation and accessible error messaging
- Building responsive layouts with Tailwind utility classes

## Author

**Abegunde Emmanuel Abiodun (Hemarnuel)**
- GitHub: [@Hemarnuel10](https://github.com/Hemarnuel10)
