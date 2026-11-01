/* ---------- Food Menu Data ---------- */
const MENU_ITEMS = [
  // SNACKS
  {
    id: 1,
    name: "Samosa (2 pcs)",
    description: "Crispy golden pastry with spiced potato filling",
    price: 30,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Veg Sandwich",
    description: "Grilled vegetable sandwich with cheese and chutney",
    price: 45,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Bread Pakora",
    description: "Spiced potato stuffed bread, deep fried to golden",
    price: 35,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1626132647523-66d12e9dc84f?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "French Fries",
    description: "Crispy golden potato fries with seasoning",
    price: 55,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1573080496987-a199f8cd75c9?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Aloo Tikki",
    description: "Spiced potato patties with chutneys",
    price: 40,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Veg Cutlet",
    description: "Crispy vegetable cutlets with mint chutney",
    price: 35,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Spring Rolls",
    description: "Crispy vegetable spring rolls with sweet chili sauce",
    price: 45,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Dhokla",
    description: "Soft steamed gram flour cakes with tempering",
    price: 40,
    category: "snacks",
    available: true,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop"
  },

  // FAST FOOD
  {
    id: 9,
    name: "Veg Burger",
    description: "Crispy veggie patty with fresh vegetables and mayo",
    price: 65,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
  },
  {
    id: 10,
    name: "Cheese Burger",
    description: "Veggie patty with extra cheese and vegetables",
    price: 80,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop"
  },
  {
    id: 11,
    name: "Pizza Slice",
    description: "Cheese and vegetable pizza slice",
    price: 70,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
  },
  {
    id: 12,
    name: "Veg Momos",
    description: "Steamed vegetable dumplings with spicy chutney",
    price: 60,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c423c?w=400&h=300&fit=crop"
  },
  {
    id: 13,
    name: "Fried Momos",
    description: "Crispy fried vegetable momos with sauce",
    price: 70,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop"
  },
  {
    id: 14,
    name: "White Sauce Pasta",
    description: "Creamy white sauce pasta with vegetables",
    price: 85,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop"
  },
  {
    id: 15,
    name: "Red Sauce Pasta",
    description: "Tangy tomato pasta with vegetables and herbs",
    price: 80,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop"
  },
  {
    id: 16,
    name: "Veg Noodles",
    description: "Stir-fried vegetable noodles with soy sauce",
    price: 75,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop"
  },
  {
    id: 17,
    name: "Manchurian",
    description: "Indo-Chinese vegetable balls in spicy sauce",
    price: 85,
    category: "fastfood",
    available: true,
    image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&h=300&fit=crop"
  },

  // BEVERAGES
  {
    id: 18,
    name: "Cold Coffee",
    description: "Chilled coffee with ice cream topping",
    price: 50,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop"
  },
  {
    id: 19,
    name: "Hot Coffee",
    description: "Freshly brewed hot coffee",
    price: 35,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop"
  },
  {
    id: 20,
    name: "Masala Chai",
    description: "Traditional Indian spiced tea",
    price: 20,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop"
  },
  {
    id: 21,
    name: "Lemon Soda",
    description: "Refreshing lemon soda with mint",
    price: 30,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop"
  },
  {
    id: 22,
    name: "Fresh Lime Water",
    description: "Fresh lime juice with black salt",
    price: 25,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop"
  },
  {
    id: 23,
    name: "Mango Shake",
    description: "Thick creamy mango milkshake",
    price: 60,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop"
  },
  {
    id: 24,
    name: "Chocolate Shake",
    description: "Rich chocolate milkshake with ice cream",
    price: 65,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop"
  },
  {
    id: 25,
    name: "Soft Drink",
    description: "Chilled carbonated beverage (300ml)",
    price: 30,
    category: "beverages",
    available: true,
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop"
  },

  // MEALS
  {
    id: 26,
    name: "Veg Thali",
    description: "Rice, dal, 2 sabzi, roti, pickle and salad",
    price: 100,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop"
  },
  {
    id: 27,
    name: "Chole Bhature",
    description: "Spiced chickpea curry with fried bread",
    price: 80,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1626132647523-66d12e9dc84f?w=400&h=300&fit=crop"
  },
  {
    id: 28,
    name: "Rajma Chawal",
    description: "Kidney bean curry with steamed rice",
    price: 75,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop"
  },
  {
    id: 29,
    name: "Fried Rice",
    description: "Indo-Chinese vegetable fried rice",
    price: 80,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"
  },
  {
    id: 30,
    name: "Paneer Roll",
    description: "Spiced paneer wrapped in roomali roti",
    price: 70,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop"
  },
  {
    id: 31,
    name: "Veg Biryani",
    description: "Aromatic vegetable biryani with raita",
    price: 110,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a908?w=400&h=300&fit=crop"
  },
  {
    id: 32,
    name: "Dal Rice",
    description: "Yellow dal with steamed rice",
    price: 60,
    category: "meals",
    available: true,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
  }
];

/* ---------- State Management ---------- */
let cart = JSON.parse(localStorage.getItem('campuseats_cart')) || {};
let orders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
let currentCategory = 'all';
let searchQuery = '';

// BroadcastChannel for synchronization with admin dashboard
const channel = new BroadcastChannel('campuseats_sync');

/* ---------- DOM Elements ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartBadge = document.getElementById('cartBadge');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.getElementById('categoryFilters');
const menuGrid = document.getElementById('menuGrid');
const featuredGrid = document.getElementById('featuredGrid');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartSummary = document.getElementById('cartSummary');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutItems = document.getElementById('checkoutItems');
const ordersList = document.getElementById('ordersList');
const emptyOrders = document.getElementById('emptyOrders');

/* ---------- Helper Functions ---------- */
const formatPrice = (price) => `₹${price}`;

const getItemById = (id) => MENU_ITEMS.find(item => item.id === parseInt(id));

const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `#CE${timestamp}`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/* ---------- Discount Calculation ---------- */
const calculateDiscount = (subtotal) => {
  if (subtotal < 100) return { percent: 0, amount: 0 };
  if (subtotal < 200) return { percent: 10, amount: subtotal * 0.10 };
  if (subtotal < 300) return { percent: 15, amount: subtotal * 0.15 };
  if (subtotal < 500) return { percent: 20, amount: subtotal * 0.20 };
  return { percent: 25, amount: subtotal * 0.25 };
};

const getNextDiscountThreshold = (subtotal) => {
  if (subtotal < 100) return { amount: 100 - subtotal, nextPercent: 10 };
  if (subtotal < 200) return { amount: 200 - subtotal, nextPercent: 15 };
  if (subtotal < 300) return { amount: 300 - subtotal, nextPercent: 20 };
  if (subtotal < 500) return { amount: 500 - subtotal, nextPercent: 25 };
  return null;
};

/* ---------- Navigation ---------- */
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
  }
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);

  if (pageId === 'menu') {
    renderMenu();
  } else if (pageId === 'cart') {
    renderCart();
  } else if (pageId === 'checkout') {
    renderCheckout();
  } else if (pageId === 'orders') {
    renderOrders();
  } else if (pageId === 'home') {
    renderFeatured();
  }
}

/* ---------- Menu Rendering ---------- */
function renderMenu() {
  let filteredItems = MENU_ITEMS;

  if (currentCategory !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === currentCategory);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }

  menuGrid.innerHTML = filteredItems.map(item => `
    <div class="food-card ${!item.available ? 'unavailable' : ''}">
      <img src="${item.image}" alt="${item.name}" class="food-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />
      <div class="food-info">
        <h3 class="food-name">${item.name}</h3>
        <p class="food-desc">${item.description}</p>
        <div class="availability-badge ${item.available ? 'available' : 'unavailable'}">
          ${item.available ? '✓ Available' : '✗ Unavailable'}
        </div>
        <div class="food-footer">
          <span class="food-price">${formatPrice(item.price)}</span>
          <button class="add-btn" ${!item.available ? 'disabled' : ''} onclick="${item.available ? `addToCart(${item.id})` : ''}">
            ${item.available ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFeatured() {
  const featuredItems = MENU_ITEMS.slice(0, 4);
  featuredGrid.innerHTML = featuredItems.map(item => `
    <div class="food-card ${!item.available ? 'unavailable' : ''}">
      <img src="${item.image}" alt="${item.name}" class="food-image" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />
      <div class="food-info">
        <h3 class="food-name">${item.name}</h3>
        <p class="food-desc">${item.description}</p>
        <div class="availability-badge ${item.available ? 'available' : 'unavailable'}">
          ${item.available ? '✓ Available' : '✗ Unavailable'}
        </div>
        <div class="food-footer">
          <span class="food-price">${formatPrice(item.price)}</span>
          <button class="add-btn" ${!item.available ? 'disabled' : ''} onclick="${item.available ? `addToCart(${item.id})` : ''}">
            ${item.available ? 'Add to Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------- Category Filters ---------- */
categoryFilters.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.dataset.category;
    renderMenu();
  }
});

/* ---------- Search ---------- */
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderMenu();
});

/* ---------- Cart Functions ---------- */
function addToCart(itemId) {
  if (cart[itemId]) {
    cart[itemId]++;
  } else {
    cart[itemId] = 1;
  }
  saveCart();
  updateCartBadge();
  showNotification('Item added to cart!');
}

function removeFromCart(itemId) {
  delete cart[itemId];
  saveCart();
  updateCartBadge();
  renderCart();
}

function updateQuantity(itemId, change) {
  if (cart[itemId]) {
    cart[itemId] += change;
    if (cart[itemId] <= 0) {
      delete cart[itemId];
    }
    saveCart();
    updateCartBadge();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem('campuseats_cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  cartBadge.textContent = totalItems;
}

function renderCart() {
  const cartItemIds = Object.keys(cart);
  
  if (cartItemIds.length === 0) {
    cartItems.innerHTML = '';
    emptyCart.style.display = 'block';
    cartSummary.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';

  let subtotal = 0;
  
  cartItems.innerHTML = cartItemIds.map(id => {
    const item = getItemById(id);
    const quantity = cart[id];
    const itemTotal = item.price * quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="updateQuantity(${id}, -1)">−</button>
          <span class="qty-display">${quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${id}, 1)">+</button>
        </div>
        <div class="cart-item-price">${formatPrice(itemTotal)}</div>
        <button class="remove-btn" onclick="removeFromCart(${id})">Remove</button>
      </div>
    `;
  }).join('');

  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount.amount;
  const nextThreshold = getNextDiscountThreshold(subtotal);

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('discountAmount').textContent = `-${formatPrice(discount.amount)}`;
  document.getElementById('discountPercent').textContent = `${discount.percent}% discount applied`;
  document.getElementById('totalAmount').textContent = formatPrice(total);

  const nextDiscountEl = document.getElementById('nextDiscount');
  if (nextThreshold) {
    nextDiscountEl.textContent = `Add ${formatPrice(nextThreshold.amount)} more to unlock ${nextThreshold.nextPercent}% discount!`;
    nextDiscountEl.style.display = 'block';
  } else {
    nextDiscountEl.textContent = '🎉 Congratulations! You unlocked the maximum discount!';
    nextDiscountEl.style.display = 'block';
  }
}

/* ---------- Checkout Functions ---------- */
function renderCheckout() {
  const cartItemIds = Object.keys(cart);
  
  if (cartItemIds.length === 0) {
    showPage('cart');
    return;
  }

  let subtotal = 0;
  
  checkoutItems.innerHTML = `
    <div class="checkout-items-list">
      ${cartItemIds.map(id => {
        const item = getItemById(id);
        const quantity = cart[id];
        const itemTotal = item.price * quantity;
        subtotal += itemTotal;

        return `
          <div class="checkout-item">
            <span>${item.name} x${quantity}</span>
            <span>${formatPrice(itemTotal)}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;

  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount.amount;

  document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkoutDiscount').textContent = `-${formatPrice(discount.amount)}`;
  document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const studentName = document.getElementById('studentName').value.trim();
  const rollNumber = document.getElementById('rollNumber').value.trim();
  const department = document.getElementById('department').value.trim();
  const contactNumber = document.getElementById('contactNumber').value.trim();

  if (!studentName || !rollNumber || !department) {
    alert('Please fill in all required fields.');
    return;
  }

  const cartItemIds = Object.keys(cart);
  let subtotal = 0;
  const orderItems = cartItemIds.map(id => {
    const item = getItemById(id);
    const quantity = cart[id];
    subtotal += item.price * quantity;
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      total: item.price * quantity
    };
  });

  const discount = calculateDiscount(subtotal);
  const total = subtotal - discount.amount;

  const order = {
    orderId: generateOrderId(),
    items: orderItems,
    subtotal: subtotal,
    discountPercent: discount.percent,
    discountAmount: discount.amount,
    total: total,
    studentName: studentName,
    rollNumber: rollNumber,
    department: department,
    contactNumber: contactNumber,
    status: 'Order Placed',
    date: new Date().toISOString()
  };

  orders.unshift(order);
  localStorage.setItem('campuseats_orders', JSON.stringify(orders));

  cart = {};
  saveCart();
  updateCartBadge();

  document.getElementById('confirmOrderId').textContent = order.orderId;
  document.getElementById('confirmDate').textContent = formatDate(order.date);
  document.getElementById('confirmTotal').textContent = formatPrice(order.total);

  checkoutForm.reset();
  showPage('confirmation');
});

/* ---------- Orders Functions ---------- */
function renderOrders() {
  if (orders.length === 0) {
    ordersList.innerHTML = '';
    emptyOrders.style.display = 'block';
    return;
  }

  emptyOrders.style.display = 'none';

  ordersList.innerHTML = orders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <div class="order-id-display">${order.orderId}</div>
        <div class="order-date">${formatDate(order.date)}</div>
      </div>
      <div class="order-items-list">
        ${order.items.map(item => `
          <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.total)}</span>
          </div>
        `).join('')}
      </div>
      <div class="order-footer">
        <div class="order-total">${formatPrice(order.total)}</div>
        <div class="order-status">
          <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
          <select class="status-select" onchange="updateOrderStatus('${order.orderId}', this.value)">
            <option value="Order Placed" ${order.status === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
            <option value="Preparing" ${order.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
            <option value="Ready for Pickup" ${order.status === 'Ready for Pickup' ? 'selected' : ''}>Ready for Pickup</option>
            <option value="Completed" ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </div>
      </div>
    </div>
  `).join('');
}

function getStatusClass(status) {
  switch (status) {
    case 'Order Placed': return 'placed';
    case 'Preparing': return 'preparing';
    case 'Ready for Pickup': return 'ready';
    case 'Completed': return 'completed';
    default: return 'placed';
  }
}

function updateOrderStatus(orderId, newStatus) {
  const orderIndex = orders.findIndex(o => o.orderId === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus;
    localStorage.setItem('campuseats_orders', JSON.stringify(orders));
    channel.postMessage({ type: 'order_update', data: { orderId, newStatus } });
    renderOrders();
    
    if (newStatus === 'Ready for Pickup') {
      showNotification(`Order ${orderId} is ready for pickup!`);
    }
  }
}

/* ---------- Notification ---------- */
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--primary);
    color: white;
    padding: 16px 24px;
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow);
    z-index: 2000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ---------- Initialize ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Save menu to localStorage for admin access
  if (!localStorage.getItem('campuseats_menu')) {
    localStorage.setItem('campuseats_menu', JSON.stringify(MENU_ITEMS));
  } else {
    // Load menu from localStorage if admin has made changes
    MENU_ITEMS = JSON.parse(localStorage.getItem('campuseats_menu')) || MENU_ITEMS;
  }
  
  updateCartBadge();
  renderFeatured();
  renderMenu();
  
  // Listen for updates from admin dashboard
  channel.onmessage = (event) => {
    const { type, data } = event.data;
    
    if (type === 'order_update') {
      orders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
      if (document.getElementById('orders').classList.contains('active')) {
        renderOrders();
      }
    }
    
    if (type === 'menu_update') {
      MENU_ITEMS = JSON.parse(localStorage.getItem('campuseats_menu')) || MENU_ITEMS;
      renderMenu();
      renderFeatured();
    }
  };
  
  // Also listen for storage events (backup sync method)
  window.addEventListener('storage', (e) => {
    if (e.key === 'campuseats_orders') {
      orders = JSON.parse(e.newValue) || [];
      if (document.getElementById('orders').classList.contains('active')) {
        renderOrders();
      }
    }
    
    if (e.key === 'campuseats_menu') {
      MENU_ITEMS = JSON.parse(e.newValue) || MENU_ITEMS;
      renderMenu();
      renderFeatured();
    }
  });
});
