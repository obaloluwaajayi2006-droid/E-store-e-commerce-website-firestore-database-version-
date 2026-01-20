import { sweatshirt } from '../data/sweatshirt.js';
import { shirt } from '../data/shirt.js';
import { jeans } from '../data/jeans.js';
import { sneakers } from '../data/sneakers.js';
import { accesories } from '../data/accesories.js';


let cart = JSON.parse(localStorage.getItem('cart')) || [];

let selectedPickupStation = 'null'; 


const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const today = new Date();
const currentDay = today.getDate();
const currentMonthName = monthNames[today.getMonth()];

const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

const dayAfterTomorrowDay = dayAfterTomorrow.getDate();
const dayAfterTomorrowMonth = monthNames[dayAfterTomorrow.getMonth()];

console.log(currentDay, currentMonthName); // Today
console.log(dayAfterTomorrowDay, dayAfterTomorrowMonth); // Day after tomorrow



cart = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));


const updateCartQuantity = () => {
  const uniqueCount = cart.length;
  const badges = document.querySelectorAll('.js-cart-quantity');
  badges.forEach(el => { el.textContent = uniqueCount; });
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) cartCountEl.textContent = uniqueCount;
};

window.updateCartQuantity = updateCartQuantity;
updateCartQuantity();

window.addEventListener('cart:updated', () => {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartQuantity();
    renderCart();
    renderCheckout();
    updateTotals();
  } catch (e) { console.warn('Error syncing cart from event', e); }
});

if (document.querySelector('.js-sweatshirt-products')) {
  let productHTML = '';

  sweatshirt.forEach((sweat, index) => {
    productHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

          <div class="product-thumb">
            <img src="${sweat.image}" class="card-img-top" alt="${sweat.productName}">
          </div>

          <div class="card-body">
            <h6 class="card-title">${sweat.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">₦${sweat.price}
                  <small class="text-muted text-decoration-line-through">₦${sweat.price + Number((Math.random() * 100).toFixed(0))}</small>
                </div>
              </div>

              <button onclick="addToCartBtn('sweatshirt', ${index})" class="btn btn-purple btn-sm add-cart js-add-to-cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-sweatshirt-products').innerHTML = productHTML;
}

if (document.querySelector('.js-shirt-products')) {
  let shirtHTML = '';

  shirt.forEach((shirts, i) => {
    shirtHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

          <div class="product-thumb">
            <img src="${shirts.image}" class="card-img-top" alt="${shirts.productName}">
          </div>

          <div class="card-body">
            <h6 class="card-title">${shirts.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">₦${shirts.price}
                  <small class="text-muted text-decoration-line-through">₦${shirts.price + Number((Math.random() * 100).toFixed(0))}</small>
                </div>
              </div>

              <button onclick="addToCartBtn('shirt', ${i})" class="btn btn-purple btn-sm add-cart js-add-to-cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-shirt-products').innerHTML = shirtHTML;
}

if (document.querySelector('.js-jeans-products')) {
  let shirtHTML = '';

  jeans.forEach((jean, i) => {
    shirtHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

          <div class="product-thumb">
            <img src="${jean.image}" class="card-img-top" alt="${jean.productName}">
          </div>

          <div class="card-body">
            <h6 class="card-title">${jean.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">₦${jean.price}
                  <small class="text-muted text-decoration-line-through">₦${jean.price + Number((Math.random() * 100).toFixed(0))}</small>
                </div>
              </div>

              <button onclick="addToCartBtn('jeans', ${i})" class="btn btn-purple btn-sm add-cart js-add-to-cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-jeans-products').innerHTML = shirtHTML;
}

if (document.querySelector('.js-sneakers-products')) {
  let sneakersHTML = '';

  sneakers.forEach((sneakers, i) => {
    sneakersHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

          <div class="product-thumb">
            <img src="${sneakers.image}" class="card-img-top" alt="${sneakers.productName}">
          </div>

          <div class="card-body">
            <h6 class="card-title">${sneakers.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">₦${sneakers.price}
                  <small class="text-muted text-decoration-line-through">₦${sneakers.price + Number((Math.random() * 100).toFixed(0))}</small>
                </div>
              </div>

              <button onclick="addToCartBtn('sneakers', ${i})" class="btn btn-purple btn-sm add-cart js-add-to-cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-sneakers-products').innerHTML = sneakersHTML;
}

if (document.querySelector('.js-acessories-products')) {
  let acessoriesHTML = '';

  accesories.forEach((acessory, i) => {
    acessoriesHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card">
          <div class="badge-wrap"><span class="badge bg-primary">NEW</span></div>

          <div class="product-thumb">
            <img src="${acessory.image}" class="card-img-top" alt="${acessory.productName}">
          </div>

          <div class="card-body">
            <h6 class="card-title">${acessory.productName}</h6>
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="price">₦${acessory.price}
                  <small class="text-muted text-decoration-line-through">₦${acessory.price + Number((Math.random() * 100).toFixed(0))}</small>
                </div>
              </div>

              <button onclick="addToCartBtn('accesories', ${i})" class="btn btn-purple btn-sm add-cart js-add-to-cart">
                <i class="bi bi-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-acessories-products').innerHTML = acessoriesHTML;
}


window.addToCartBtn = (category, index) => {
  let product;

  if (category === 'sweatshirt') {
    product = sweatshirt[index];
  } else if (category === 'shirt') {
    product = shirt[index];
  } else if (category === 'jeans') {
    product = jeans[index];
  } else if (category === 'sneakers') {
    product = sneakers[index];
  } else if (category === 'accesories') {
    product = accesories[index];
  }

  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartQuantity();
  renderCart();
  renderCheckout();

  try {
    const selector = `[onclick="addToCartBtn('${category}', ${index})"]`;
    const btn = document.querySelector(selector);
    if (btn) {
      const prevHtml = btn.innerHTML;
      const prevClass = btn.className;
      const prevTitle = btn.getAttribute('title');
      const prevAria = btn.getAttribute('aria-pressed');

      btn.innerHTML = `<i class="bi bi-check-lg"></i>`;
      btn.classList.remove('btn-purple');
      btn.classList.add('btn-success');
      btn.setAttribute('title', 'Added to cart');
      btn.setAttribute('aria-pressed', 'true');

      
      setTimeout(() => {
        if (!btn || !document.contains(btn)) return;

        btn.innerHTML = prevHtml;
        btn.className = prevClass;

        if (prevTitle === null) btn.removeAttribute('title'); else btn.setAttribute('title', prevTitle);
        if (prevAria === null) btn.removeAttribute('aria-pressed'); else btn.setAttribute('aria-pressed', prevAria);
      }, 1000);
    }
  } catch (e) {
    console.warn('Could not set mark icon on add button', e);
  }
};



const taxFee = 2;

const getTotalQuantity = () => cart.reduce((sum, item) => sum + item.quantity, 0);
const getSubTotalPrice = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const getTotalPrice = () => getSubTotalPrice() + taxFee;


function renderCart() {
  const cartContainer = document.querySelector('.js-cart-items');
  if (!cartContainer) return;

  let html = '';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item d-flex align-items-center gap-3 py-3 border-bottom">
        <button onclick="removeFromCart(${index})" class="btn btn-sm btn-light remove-item">✕</button>
        <img src="${item.image}" alt="${item.productName}" class="product-thumb">
        <div class="flex-fill"><div class="product-title">${item.productName}</div></div>
        <div class="text-end">
          <div class="price">₦<span class="item-price">${(item.price * item.quantity).toFixed(2)}</span></div>
          <div class="qty-controls mt-2 d-flex align-items-center justify-content-end gap-2">
            <button class="btn btn-outline-secondary btn-sm" onclick="decreaseQty(${index})">−</button>
            <input class="form-control qty-input text-center" value="${item.quantity}" readonly>
            <button class="btn btn-outline-secondary btn-sm" onclick="increaseQty(${index})">+</button>
          </div>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = html;
  updateTotals();
}


function renderCheckout() {
  const checkoutContainer = document.querySelector('.js-checkout-summary');
  if (!checkoutContainer) return;
  updateTotals();
}


export function updateTotals() {
  const qtyEl = document.querySelector('.js-total-quantity');
  const subtotalEl = document.querySelector('.js-subtotal-price');
  const totalEl = document.querySelector('.js-total-price');
  const taxEl = document.querySelector('.js-tax-fee');

  if (qtyEl) qtyEl.textContent = getTotalQuantity();
  if (subtotalEl) subtotalEl.textContent = getSubTotalPrice().toFixed(2);
  if (totalEl) totalEl.textContent = getTotalPrice().toFixed(2);
  if (taxEl) taxEl.textContent = taxFee.toFixed(2);

  updateCartQuantity();
}


window.removeFromCart = (index) => {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  renderCheckout();
};

window.increaseQty = (index) => {
  cart[index].quantity++;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  renderCheckout();
};

window.decreaseQty = (index) => {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    renderCheckout();
  }
};


function renderDelivery() {
  const deliveryContainer = document.querySelector('.js-delivery-items');
  if (!deliveryContainer) return;

  const citySelect = document.getElementById('city');
  const displayDiv = document.getElementById('displayCity');
  const displayDiv2 = document.getElementById('displayCity2');

  
  selectedPickupStation = citySelect.value;
  displayDiv.innerHTML = selectedPickupStation;
  displayDiv2.innerHTML = selectedPickupStation;

  
  citySelect.addEventListener('change', () => {
    selectedPickupStation = citySelect.value;
    displayDiv.innerHTML = selectedPickupStation;
    displayDiv2.innerHTML = selectedPickupStation;
  });

  confirmDelivery.addEventListener('click', () => {
    const selectedCity = citySelect.value;

    if (
      selectedCity === 'Ogbomosho' || selectedCity === 'Ikeja' ||
      selectedCity === 'Garki' || selectedCity === 'Ibadan' ||
      selectedCity === 'Ilorin' || selectedCity === 'Oyo' ||
      selectedCity === 'Taraba' || selectedCity === 'Abuja'
    ) {
      errorMessage.style.display = 'none';
      window.location.href = '../payment/payment.html';
    } else {
      errorMessage.style.display = 'block';
    }
  });

  // Set dates (already calculated globally)
  todayDate.innerHTML = `${currentDay} ${currentMonthName}`;
  tomDate.innerHTML = `${dayAfterTomorrowDay} ${dayAfterTomorrowMonth}`;

  let html = '';
  cart.forEach((item) => {
    html += `
      <div class="d-flex align-items-center gap-3 mb-2">
        <img src="${item.image}" alt="product" class="img-thumbnail" style="width:80px; height:60px; object-fit:cover">
        <div class="flex-fill">
          <div class="fw-semibold mb-0">${item.productName}</div>
        </div>
      </div>
    `;
  });

  deliveryContainer.innerHTML = html;
  updateTotals();
}



function renderPayment() {
  const paymentContainer = document.querySelector('.js-payment-page');
  if (!paymentContainer) return;

  // Dates
  todayDate2.innerHTML = `${currentDay} ${currentMonthName}`;
  tomDate2.innerHTML = `${dayAfterTomorrowDay} ${dayAfterTomorrowMonth}`;

  
  const displayDiv = document.getElementById('displayCity2');
  if (displayDiv) {
    displayDiv.innerHTML = selectedPickupStation;
  }

  console.log("Pickup Station:", selectedPickupStation);
}

renderCart();
renderDelivery()
renderPayment()
renderCheckout();


document.getElementById("fakePayButton").addEventListener("click", () => {
  const total = getTotalPrice();
  console.log(total);
  document.getElementById("fakePayAmount").innerText = "₦" + total;
  document.getElementById("fakePaymentPopup").style.display = "flex"
});


document.getElementById("cancelFakePayment").addEventListener("click", () => {
  document.getElementById("fakePaymentPopup").style.display = "none"
})


document.getElementById("confirmFakePayment").addEventListener("click", () => {
  document.getElementById("confirmFakePayment").innerText = "Processing ...";
  document.getElementById("confirmFakePayment").disabled = "true";

  setTimeout(() => {
    let orders = JSON.parse(localStorage.getItem("orders")) || []

    let addressData = JSON.parse(localStorage.getItem('addressData')) || [];
    const lastAdress = addressData[addressData.length - 1];
    console.log(lastAdress.fName, lastAdress.lName)

    deliveryName.innerHTML = lastAdress.fName + ' ' + lastAdress.lName;
    deliveryAddress.innerHTML = lastAdress.add;
    
    const txRef = "TX-" + Math.floor(Math.random() * 999999999);

    // Save order
    const newOrder = {
      name: lastAdress.fName + ' ' + lastAdress.lName,
      items: cart,
      totalPrice: Number(getTotalPrice()),
      reference: txRef,
      date: new Date().toLocaleDateString()
    };
    orders.push(newOrder)
    localStorage.setItem("orders", JSON.stringify(orders));

    
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    if (window.updateCartQuantity) updateCartQuantity();

    
    window.location.href = "/checkout/payment/success.html";
  }, 2000);
});
window.fakePayButton = fakePayButton;



