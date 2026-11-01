/* ---------- State Management ---------- */
let orders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
let menuItems = JSON.parse(localStorage.getItem('campuseats_menu')) || [];
let currentSection = 'overview';
let orderFilter = 'all';
let orderSearch = '';
let menuCategoryFilter = 'all';
let menuAvailabilityFilter = 'all';

// BroadcastChannel for synchronization between tabs
const channel = new BroadcastChannel('campuseats_sync');

/* ---------- DOM Elements ---------- */
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const navLinks = document.querySelectorAll('.nav-link[data-section]');
const sections = document.querySelectorAll('.dashboard-section');
const pageTitle = document.getElementById('pageTitle');

// Order Management
const orderFilterSelect = document.getElementById('orderFilter');
const orderSearchInput = document.getElementById('orderSearch');
const ordersTable = document.getElementById('ordersTable');
const emptyOrders = document.getElementById('emptyOrders');

// Menu Management
const menuCategoryFilterSelect = document.getElementById('menuCategoryFilter');
const menuAvailabilityFilterSelect = document.getElementById('menuAvailabilityFilter');
const adminMenuGrid = document.getElementById('adminMenuGrid');
const emptyMenu = document.getElementById('emptyMenu');
const addMenuItemBtn = document.getElementById('addMenuItemBtn');
const menuModal = document.getElementById('menuModal');
const menuForm = document.getElementById('menuForm');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');

// Order Modal
const orderModal = document.getElementById('orderModal');
const closeOrderModalBtn = document.getElementById('closeOrderModal');

/* ---------- Helper Functions ---------- */
const formatPrice = (price) => `₹${price}`;

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Order Placed': return 'placed';
    case 'Preparing': return 'preparing';
    case 'Ready for Pickup': return 'ready';
    case 'Completed': return 'completed';
    default: return 'placed';
  }
};

/* ---------- BroadcastChannel Synchronization ---------- */
channel.onmessage = (event) => {
  const { type, data } = event.data;
  
  if (type === 'order_update' || type === 'new_order') {
    orders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
    updateDashboard();
  }
  
  if (type === 'menu_update') {
    menuItems = JSON.parse(localStorage.getItem('campuseats_menu')) || [];
    renderAdminMenu();
  }
};

const broadcastUpdate = (type, data) => {
  channel.postMessage({ type, data });
};

/* ---------- Admin Login ---------- */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('campuseats_admin_logged_in', 'true');
    showDashboard();
  } else {
    alert('Invalid credentials. Please try again.');
  }
});

function showDashboard() {
  loginPage.style.display = 'none';
  dashboardPage.style.display = 'flex';
  initializeDashboard();
}

function checkLogin() {
  const isLoggedIn = localStorage.getItem('campuseats_admin_logged_in');
  if (isLoggedIn === 'true') {
    showDashboard();
  }
}

document.getElementById('logoutBtn').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('campuseats_admin_logged_in');
  loginPage.style.display = 'flex';
  dashboardPage.style.display = 'none';
  loginForm.reset();
});

/* ---------- Navigation ---------- */
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    switchSection(section);
  });
});

function switchSection(section) {
  currentSection = section;
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === section) {
      link.classList.add('active');
    }
  });
  
  sections.forEach(sec => {
    sec.classList.remove('active');
  });
  
  document.getElementById(`${section}Section`).classList.add('active');
  
  const titles = {
    overview: 'Dashboard Overview',
    orders: 'Order Management',
    menu: 'Menu Management'
  };
  pageTitle.textContent = titles[section];
  
  if (section === 'overview') {
    updateDashboard();
  } else if (section === 'orders') {
    renderOrders();
  } else if (section === 'menu') {
    renderAdminMenu();
  }
}

/* ---------- Dashboard Overview ---------- */
function initializeDashboard() {
  // Load menu items from localStorage or use default
  if (!menuItems || menuItems.length === 0) {
    // Load default menu from script.js (we'll need to access it)
    // For now, we'll initialize with empty and let admin add items
    menuItems = [];
  }
  
  updateDashboard();
}

function updateDashboard() {
  orders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
  
  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Order Placed').length;
  const preparingOrders = orders.filter(o => o.status === 'Preparing').length;
  const readyOrders = orders.filter(o => o.status === 'Ready for Pickup').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  
  // Update stat cards
  document.getElementById('totalOrders').textContent = totalOrders;
  document.getElementById('pendingOrders').textContent = pendingOrders;
  document.getElementById('preparingOrders').textContent = preparingOrders;
  document.getElementById('readyOrders').textContent = readyOrders;
  document.getElementById('completedOrders').textContent = completedOrders;
  document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
  
  // Update charts
  renderOrdersChart(orders);
  renderRevenueChart(orders);
  
  // Update recent orders
  renderRecentOrders(orders);
}

function renderOrdersChart(orders) {
  const chartContainer = document.getElementById('ordersChart');
  const statusCounts = {
    'Order Placed': orders.filter(o => o.status === 'Order Placed').length,
    'Preparing': orders.filter(o => o.status === 'Preparing').length,
    'Ready for Pickup': orders.filter(o => o.status === 'Ready for Pickup').length,
    'Completed': orders.filter(o => o.status === 'Completed').length
  };
  
  const maxCount = Math.max(...Object.values(statusCounts), 1);
  
  const colors = {
    'Order Placed': '#1976d2',
    'Preparing': '#f57c00',
    'Ready for Pickup': '#388e3c',
    'Completed': '#7b1fa2'
  };
  
  chartContainer.innerHTML = `
    <div class="simple-bar-chart">
      ${Object.entries(statusCounts).map(([status, count]) => `
        <div class="chart-bar">
          <div class="chart-bar-label">${status}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${(count / maxCount) * 100}%; background: ${colors[status]};">
              ${count}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRevenueChart(orders) {
  const chartContainer = document.getElementById('revenueChart');
  
  // Group by status
  const revenueByStatus = {
    'Order Placed': orders.filter(o => o.status === 'Order Placed').reduce((sum, o) => sum + o.total, 0),
    'Preparing': orders.filter(o => o.status === 'Preparing').reduce((sum, o) => sum + o.total, 0),
    'Ready for Pickup': orders.filter(o => o.status === 'Ready for Pickup').reduce((sum, o) => sum + o.total, 0),
    'Completed': orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0)
  };
  
  const maxRevenue = Math.max(...Object.values(revenueByStatus), 1);
  
  const colors = {
    'Order Placed': '#1976d2',
    'Preparing': '#f57c00',
    'Ready for Pickup': '#388e3c',
    'Completed': '#7b1fa2'
  };
  
  chartContainer.innerHTML = `
    <div class="simple-bar-chart">
      ${Object.entries(revenueByStatus).map(([status, revenue]) => `
        <div class="chart-bar">
          <div class="chart-bar-label">${status}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${(revenue / maxRevenue) * 100}%; background: ${colors[status]};">
              ${formatPrice(revenue)}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRecentOrders(orders) {
  const recentOrders = orders.slice(0, 5);
  const tbody = document.getElementById('recentOrdersTable');
  
  if (recentOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No recent orders</td></tr>';
    return;
  }
  
  tbody.innerHTML = recentOrders.map(order => `
    <tr>
      <td><strong>${order.orderId}</strong></td>
      <td>${order.studentName}</td>
      <td>${order.items.length} item${order.items.length > 1 ? 's' : ''}</td>
      <td><strong>${formatPrice(order.total)}</strong></td>
      <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
    </tr>
  `).join('');
}

/* ---------- Order Management ---------- */
orderFilterSelect.addEventListener('change', (e) => {
  orderFilter = e.target.value;
  renderOrders();
});

orderSearchInput.addEventListener('input', (e) => {
  orderSearch = e.target.value.toLowerCase();
  renderOrders();
});

function renderOrders() {
  orders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
  
  let filteredOrders = orders;
  
  // Apply filter
  if (orderFilter !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === orderFilter);
  }
  
  // Apply search
  if (orderSearch) {
    filteredOrders = filteredOrders.filter(o => 
      o.orderId.toLowerCase().includes(orderSearch) ||
      o.studentName.toLowerCase().includes(orderSearch) ||
      o.rollNumber.toLowerCase().includes(orderSearch)
    );
  }
  
  if (filteredOrders.length === 0) {
    ordersTable.innerHTML = '';
    emptyOrders.style.display = 'block';
    return;
  }
  
  emptyOrders.style.display = 'none';
  
  ordersTable.innerHTML = filteredOrders.map(order => {
    const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return `
      <tr>
        <td><strong>${order.orderId}</strong></td>
        <td>${order.studentName}</td>
        <td>${order.rollNumber}</td>
        <td>${order.department}</td>
        <td>${order.items.length} item${order.items.length > 1 ? 's' : ''}</td>
        <td>${totalQty}</td>
        <td>${formatPrice(order.subtotal)}</td>
        <td style="color: var(--accent);">-${formatPrice(order.discountAmount)}</td>
        <td><strong>${formatPrice(order.total)}</strong></td>
        <td>${formatDate(order.date)}</td>
        <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
        <td>
          <button class="action-btn view" onclick="viewOrder('${order.orderId}')">View</button>
          <button class="action-btn edit" onclick="updateOrderStatus('${order.orderId}')">Update</button>
        </td>
      </tr>
    `;
  }).join('');
}

function viewOrder(orderId) {
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;
  
  const modalBody = document.getElementById('orderModalBody');
  
  modalBody.innerHTML = `
    <div class="order-detail-section">
      <h4>Order Information</h4>
      <div class="order-detail-row">
        <span>Order ID:</span>
        <strong>${order.orderId}</strong>
      </div>
      <div class="order-detail-row">
        <span>Student Name:</span>
        <strong>${order.studentName}</strong>
      </div>
      <div class="order-detail-row">
        <span>Roll Number:</span>
        <strong>${order.rollNumber}</strong>
      </div>
      <div class="order-detail-row">
        <span>Department:</span>
        <strong>${order.department}</strong>
      </div>
      <div class="order-detail-row">
        <span>Contact:</span>
        <strong>${order.contactNumber || 'Not provided'}</strong>
      </div>
      <div class="order-detail-row">
        <span>Order Date:</span>
        <strong>${formatDate(order.date)}</strong>
      </div>
      <div class="order-detail-row">
        <span>Status:</span>
        <strong><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></strong>
      </div>
    </div>
    
    <div class="order-detail-section">
      <h4>Order Items</h4>
      <div class="order-items-list">
        ${order.items.map(item => `
          <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatPrice(item.total)}</span>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="order-summary">
      <div class="order-detail-row">
        <span>Subtotal:</span>
        <strong>${formatPrice(order.subtotal)}</strong>
      </div>
      <div class="order-detail-row">
        <span>Discount (${order.discountPercent}%):</span>
        <strong style="color: var(--accent);">-${formatPrice(order.discountAmount)}</strong>
      </div>
      <div class="order-detail-row" style="font-size: 1.1rem; margin-top: 8px; padding-top: 8px; border-top: 2px solid var(--border);">
        <span>Total:</span>
        <strong>${formatPrice(order.total)}</strong>
      </div>
    </div>
    
    <div style="margin-top: 20px; text-align: right;">
      <button class="btn btn-primary" onclick="updateOrderStatus('${order.orderId}'); document.getElementById('orderModal').style.display='none';">
        Update Status
      </button>
    </div>
  `;
  
  orderModal.style.display = 'flex';
}

function updateOrderStatus(orderId) {
  const order = orders.find(o => o.orderId === orderId);
  if (!order) return;
  
  const statusFlow = ['Order Placed', 'Preparing', 'Ready for Pickup', 'Completed'];
  const currentIndex = statusFlow.indexOf(order.status);
  
  if (currentIndex < statusFlow.length - 1) {
    const newStatus = statusFlow[currentIndex + 1];
    
    if (confirm(`Change order status from "${order.status}" to "${newStatus}"?`)) {
      order.status = newStatus;
      localStorage.setItem('campuseats_orders', JSON.stringify(orders));
      broadcastUpdate('order_update', { orderId, newStatus });
      
      if (currentSection === 'overview') {
        updateDashboard();
      } else {
        renderOrders();
      }
      
      alert(`Order ${orderId} status updated to ${newStatus}`);
    }
  } else {
    alert('Order is already completed.');
  }
}

/* ---------- Menu Management ---------- */
// Load menu from localStorage or initialize with default
function loadMenuItems() {
  const storedMenu = localStorage.getItem('campuseats_menu');
  if (storedMenu) {
    menuItems = JSON.parse(storedMenu);
  } else {
    // Initialize with empty - will be populated when student site loads
    menuItems = [];
  }
}

menuCategoryFilterSelect.addEventListener('change', (e) => {
  menuCategoryFilter = e.target.value;
  renderAdminMenu();
});

menuAvailabilityFilterSelect.addEventListener('change', (e) => {
  menuAvailabilityFilter = e.target.value;
  renderAdminMenu();
});

function renderAdminMenu() {
  // Load menu from student's localStorage if not loaded
  if (menuItems.length === 0) {
    const studentMenu = localStorage.getItem('campuseats_menu');
    if (studentMenu) {
      menuItems = JSON.parse(studentMenu);
    } else {
      // If still empty, show empty state
      adminMenuGrid.innerHTML = '';
      document.getElementById('emptyMenuText').textContent = 'Please open the student website first to initialize the menu, or add items manually.';
      emptyMenu.style.display = 'block';
      return;
    }
  }
  
  let filteredItems = menuItems;
  
  // Apply category filter
  if (menuCategoryFilter !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === menuCategoryFilter);
  }
  
  // Apply availability filter
  if (menuAvailabilityFilter === 'available') {
    filteredItems = filteredItems.filter(item => item.available);
  } else if (menuAvailabilityFilter === 'unavailable') {
    filteredItems = filteredItems.filter(item => !item.available);
  }
  
  if (filteredItems.length === 0) {
    adminMenuGrid.innerHTML = '';
    document.getElementById('emptyMenuText').textContent = 'Try changing your filters or add new menu items.';
    emptyMenu.style.display = 'block';
    return;
  }
  
  emptyMenu.style.display = 'none';
  
  adminMenuGrid.innerHTML = filteredItems.map(item => `
    <div class="menu-item-card ${!item.available ? 'menu-item-unavailable' : ''}">
      <img src="${item.image}" alt="${item.name}" class="menu-item-image" onerror="this.src='https://via.placeholder.com/280x160?text=No+Image'" />
      <div class="menu-item-info">
        <h3 class="menu-item-name">${item.name}</h3>
        <div class="menu-item-details">
          <span><strong>Category:</strong> ${item.category}</span>
          <span><strong>Price:</strong> ${formatPrice(item.price)}</span>
        </div>
        ${!item.available ? '<div class="unavailable-badge">Sold Out</div>' : ''}
        <div class="menu-item-price">${formatPrice(item.price)}</div>
        <div class="menu-item-actions">
          <button class="action-btn edit" onclick="editMenuItem(${item.id})">Edit</button>
          <button class="action-btn delete" onclick="deleteMenuItem(${item.id})">Delete</button>
          <button class="action-btn view" onclick="toggleAvailability(${item.id})">
            ${item.available ? 'Mark Unavailable' : 'Mark Available'}
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Add new menu item
addMenuItemBtn.addEventListener('click', () => {
  document.getElementById('modalTitle').textContent = 'Add New Menu Item';
  document.getElementById('editItemId').value = '';
  menuForm.reset();
  document.getElementById('itemAvailable').checked = true;
  menuModal.style.display = 'flex';
});

// Edit menu item
function editMenuItem(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;
  
  document.getElementById('modalTitle').textContent = 'Edit Menu Item';
  document.getElementById('editItemId').value = itemId;
  document.getElementById('itemName').value = item.name;
  document.getElementById('itemCategory').value = item.category;
  document.getElementById('itemDescription').value = item.description;
  document.getElementById('itemPrice').value = item.price;
  document.getElementById('itemImage').value = item.image || '';
  document.getElementById('itemAvailable').checked = item.available;
  
  menuModal.style.display = 'flex';
}

// Delete menu item
function deleteMenuItem(itemId) {
  if (confirm('Are you sure you want to delete this menu item?')) {
    menuItems = menuItems.filter(i => i.id !== itemId);
    localStorage.setItem('campuseats_menu', JSON.stringify(menuItems));
    broadcastUpdate('menu_update', { itemId });
    renderAdminMenu();
    alert('Menu item deleted successfully');
  }
}

// Toggle availability
function toggleAvailability(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return;
  
  item.available = !item.available;
  localStorage.setItem('campuseats_menu', JSON.stringify(menuItems));
  broadcastUpdate('menu_update', { itemId, available: item.available });
  renderAdminMenu();
  
  alert(`Item marked as ${item.available ? 'available' : 'unavailable'}`);
}

// Save menu item
menuForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const editItemId = document.getElementById('editItemId').value;
  const itemData = {
    name: document.getElementById('itemName').value,
    category: document.getElementById('itemCategory').value,
    description: document.getElementById('itemDescription').value,
    price: parseInt(document.getElementById('itemPrice').value),
    image: document.getElementById('itemImage').value || 'https://via.placeholder.com/400x300?text=Food+Image',
    available: document.getElementById('itemAvailable').checked
  };
  
  if (editItemId) {
    // Edit existing
    const index = menuItems.findIndex(i => i.id === parseInt(editItemId));
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...itemData };
    }
  } else {
    // Add new
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
    menuItems.push({ id: newId, ...itemData });
  }
  
  localStorage.setItem('campuseats_menu', JSON.stringify(menuItems));
  broadcastUpdate('menu_update', itemData);
  
  menuModal.style.display = 'none';
  menuForm.reset();
  renderAdminMenu();
  
  alert(editItemId ? 'Menu item updated successfully' : 'Menu item added successfully');
});

// Close modal
closeModalBtn.addEventListener('click', () => {
  menuModal.style.display = 'none';
});

cancelModalBtn.addEventListener('click', () => {
  menuModal.style.display = 'none';
});

closeOrderModalBtn.addEventListener('click', () => {
  orderModal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === menuModal) {
    menuModal.style.display = 'none';
  }
  if (e.target === orderModal) {
    orderModal.style.display = 'none';
  }
});

/* ---------- Initialize ---------- */
document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
  loadMenuItems();
  
  // Also listen for storage events (backup sync method)
  window.addEventListener('storage', (e) => {
    if (e.key === 'campuseats_orders') {
      orders = JSON.parse(e.newValue) || [];
      if (currentSection === 'overview') {
        updateDashboard();
      } else if (currentSection === 'orders') {
        renderOrders();
      }
    }
    
    if (e.key === 'campuseats_menu') {
      menuItems = JSON.parse(e.newValue) || [];
      if (currentSection === 'menu') {
        renderAdminMenu();
      }
    }
  });
});
