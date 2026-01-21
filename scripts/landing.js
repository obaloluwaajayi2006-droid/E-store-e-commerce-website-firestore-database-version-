// I want to add "all orders" in the webpage
import { sweatshirt } from '/data/sweatshirt.js';
import { shirt } from '/data/shirt.js';
import { jeans } from '/data/jeans.js';
import { sneakers } from '../data/sneakers.js';
import { accesories } from '../data/accesories.js';
import { saveUserCart, getCurrentUser } from '../firebase/firestore.js';


sweatshirt.forEach(p => p.category = "sweatshirt");
shirt.forEach(p => p.category = "shirt");
jeans.forEach(p => p.category = "jeans");
sneakers.forEach(p => p.category = "sneakers");
accesories.forEach(p => p.category = "accesories");


const allProducts = [...sweatshirt, ...shirt, ...jeans, ...accesories, ...sneakers];


function getRandomProducts(array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

const randomProducts = getRandomProducts(allProducts, 60);


const container = document.querySelector(".js-landing-products");
const productMap = {};
let html = "";

randomProducts.forEach(product => {
  const cartId = `${product.category}-${product.id}`;
  productMap[cartId] = product;

  html += `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card">
        <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

        <div class="product-thumb">
          <img src="${product.image}" class="card-img-top" alt="${product.productName}">
        </div>

        <div class="card-body">
          <h6 class="card-title">${product.productName}</h6>
          <div class="d-flex justify-content-between align-items-center">

            <div class="price">
              ₦${product.price}
              <small class="text-muted text-decoration-line-through">
                ₦${product.price + Number((Math.random() * 100).toFixed(0))}
              </small>
            </div>

            <button class="btn btn-purple btn-sm add-cart" data-cartid="${cartId}">
              <i class="bi bi-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
});

if (container) container.innerHTML = html;

let cart = [];
let currentUser = null;

// Initialize user and cart
const initializeCart = () => {
  currentUser = getCurrentUser();
};

initializeCart();

async function saveCart() {
  if (currentUser && currentUser.id) {
    try {
      await saveUserCart(currentUser.id, cart);
    } catch (error) {
      console.warn('Error saving cart to Firestore:', error);
      // Fallback to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } else {
    // If not logged in, use localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  if (typeof window.updateCartQuantity === "function") {
    window.updateCartQuantity();
  }

  try { window.dispatchEvent(new CustomEvent('cart:updated')); } catch (e) { }
}


function updateNavbarCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = stored.reduce((s, it) => s + (it.quantity || 0), 0);
    const uniqueCount = stored.length;
    const valueToShow = (window.__cartBadgeMode__ === 'unique') ? uniqueCount : totalQty;

    const badges = document.querySelectorAll('.js-cart-quantity');
    badges.forEach(el => el.textContent = valueToShow);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = valueToShow;
  } catch (e) {

  }
}


function addToCart(cartId) {
  const product = productMap[cartId];
  if (!product) return;

  const existing = cart.find(item => item.cartId === cartId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, cartId, quantity: 1 });
  }

  saveCart();
  updateNavbarCart();
}


window.setCartBadgeMode = function (mode) {
  if (mode === 'unique') window.__cartBadgeMode__ = 'unique';
  else window.__cartBadgeMode__ = 'total';
  updateNavbarCart();
}


if (!window.__cartBadgeMode__) window.__cartBadgeMode__ = 'unique';


if (container) {
  container.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-cart");
    if (!btn) return;

    addToCart(btn.dataset.cartid);


    const prevHtml = btn.innerHTML;
    btn.innerHTML = `<i class="bi bi-check-lg"></i>`;
    btn.classList.remove('btn-purple');
    btn.classList.add('btn-success');
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = prevHtml;
    btn.classList.add('btn-purple');
      btn.disabled = false;
    }, 600);
  });
}
