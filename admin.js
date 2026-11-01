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

/* ---------- Toast Notification System ---------- */
function showAdminNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `admin-toast toast-${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  const colors = {
    success: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
    error: 'linear-gradient(135deg, #d63031 0%, #e17055 100%)',
    warning: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)',
    info: 'linear-gradient(135deg, #0984e3 0%, #74b9ff 100%)'
  };
  
  notification.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    font-weight: 600;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    animation: adminToastSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  `;
  
  notification.innerHTML = `
    <span style="font-size: 1.2rem; font-weight: 800;">${icons[type]}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'adminToastSlideOut 0.4s ease';
    setTimeout(() => notification.remove(), 400);
  }, 3000);
}

// Add admin toast animation styles
const adminToastStyle = document.createElement('style');
adminToastStyle.textContent = `
  @keyframes adminToastSlideIn {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes adminToastSlideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(120%); opacity: 0; }
  }
`;
document.head.appendChild(adminToastStyle);

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

// Analytics & Reports
const dateFilterSelect = document.getElementById('dateFilter');
const exportCSVBtn = document.getElementById('exportCSVBtn');
const topSellingTable = document.getElementById('topSellingTable');
const emptyTopSelling = document.getElementById('emptyTopSelling');
const topSellingCategoryBadge = document.getElementById('topSellingCategoryBadge');

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
    if (currentSection === 'overview') updateDashboard();
    if (currentSection === 'orders') renderOrders();
    if (currentSection === 'analytics') renderAnalytics();
  }
  
  if (type === 'menu_update') {
    menuItems = JSON.parse(localStorage.getItem('campuseats_menu')) || [];
    if (currentSection === 'menu') renderAdminMenu();
    if (currentSection === 'analytics') renderAnalytics();
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
    showAdminNotification('Invalid credentials. Please try again.', 'error');
  }
});

function showDashboard() {
  loginPage.style.display = 'none';
  dashboardPage.style.display = 'flex';
  initializeDashboard();
  const savedSection = sessionStorage.getItem('campuseats_admin_section') || 'overview';
  switchSection(savedSection);
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
  sessionStorage.setItem('campuseats_admin_section', section);
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === section) {
      link.classList.add('active');
    }
  });
  
  sections.forEach(sec => {
    sec.classList.remove('active');
  });
  
  const targetSection = document.getElementById(`${section}Section`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  const titles = {
    overview: 'Dashboard Overview',
    orders: 'Order Management',
    menu: 'Menu Management',
    analytics: 'Analytics & Reports'
  };
  pageTitle.textContent = titles[section] || 'CampusEats Admin';
  
  if (section === 'overview') {
    updateDashboard();
  } else if (section === 'orders') {
    renderOrders();
  } else if (section === 'menu') {
    renderAdminMenu();
  } else if (section === 'analytics') {
    renderAnalytics();
  }
}

/* ---------- Dashboard Overview ---------- */
function initializeDashboard() {
  if (!menuItems || menuItems.length === 0) {
    loadMenuItems();
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
    
    order.status = newStatus;
    localStorage.setItem('campuseats_orders', JSON.stringify(orders));
    broadcastUpdate('order_update', { orderId, newStatus });
    
    if (currentSection === 'overview') {
      updateDashboard();
    } else if (currentSection === 'orders') {
      renderOrders();
    } else if (currentSection === 'analytics') {
      renderAnalytics();
    }
    
    showAdminNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
  } else {
    showAdminNotification('Order is already completed.', 'warning');
  }
}

/* ---------- Menu Management ---------- */
// Load menu from localStorage or initialize with default
function loadMenuItems() {
  const storedMenu = localStorage.getItem('campuseats_menu');
  if (storedMenu) {
    try {
      menuItems = JSON.parse(storedMenu);
    } catch (e) {
      menuItems = [...DEFAULT_MENU_ITEMS];
    }
  } else {
    menuItems = [...DEFAULT_MENU_ITEMS];
    localStorage.setItem('campuseats_menu', JSON.stringify(menuItems));
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
    showAdminNotification('Menu item deleted successfully', 'success');
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
  
  showAdminNotification(`Item marked as ${item.available ? 'available' : 'unavailable'}`, 'success');
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
  
  showAdminNotification(editItemId ? 'Menu item updated successfully' : 'Menu item added successfully', 'success');
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
      } else if (currentSection === 'analytics') {
        renderAnalytics();
      }
    }
    
    if (e.key === 'campuseats_menu') {
      menuItems = JSON.parse(e.newValue) || [];
      if (currentSection === 'menu') {
        renderAdminMenu();
      } else if (currentSection === 'analytics') {
        renderAnalytics();
      }
    }
  });
});


/* ==========================================================================
   ANALYTICS & REPORTS MODULE
   Smart analytics, sales charts, item popularity, discount metrics & CSV export
   ========================================================================== */

let analyticsCharts = {};

/* ---------- Data Sanitization & Deduplication ---------- */
function getValidOrders() {
  const rawOrders = JSON.parse(localStorage.getItem('campuseats_orders')) || [];
  const seenIds = new Set();
  const valid = [];

  for (const o of rawOrders) {
    if (!o || !o.orderId) continue;
    if (seenIds.has(o.orderId)) continue;
    seenIds.add(o.orderId);

    const subtotal = Number(o.subtotal) || 0;
    const discountAmount = Number(o.discountAmount) || 0;
    const total = Number(o.total) || Math.max(0, subtotal - discountAmount);
    const discountPercent = o.discountPercent !== undefined ? Number(o.discountPercent) : 0;

    valid.push({
      ...o,
      subtotal,
      discountAmount,
      total,
      discountPercent,
      date: o.date || new Date().toISOString(),
      items: Array.isArray(o.items) ? o.items : []
    });
  }

  return valid;
}

/* ---------- Master Menu Fallback ---------- */
const DEFAULT_MENU_ITEMS = [
  { id: 1, name: "Samosa (2 pcs)", category: "snacks", price: 30, description: "Crispy golden pastry with spiced potato filling", available: true, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
  { id: 2, name: "Veg Sandwich", category: "snacks", price: 45, description: "Grilled vegetable sandwich with cheese and chutney", available: true, image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop" },
  { id: 3, name: "Bread Pakora", category: "snacks", price: 35, description: "Spiced potato stuffed bread, deep fried to golden", available: true, image: "https://images.unsplash.com/photo-1626132647523-66d12e9dc84f?w=400&h=300&fit=crop" },
  { id: 4, name: "French Fries", category: "snacks", price: 55, description: "Crispy golden potato fries with seasoning", available: true, image: "https://images.unsplash.com/photo-1573080496987-a199f8cd75c9?w=400&h=300&fit=crop" },
  { id: 5, name: "Aloo Tikki", category: "snacks", price: 40, description: "Spiced potato patties with chutneys", available: true, image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop" },
  { id: 6, name: "Veg Cutlet", category: "snacks", price: 35, description: "Crispy vegetable cutlets with mint chutney", available: true, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
  { id: 7, name: "Spring Rolls", category: "snacks", price: 45, description: "Crispy vegetable spring rolls with sweet chili sauce", available: true, image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
  { id: 8, name: "Dhokla", category: "snacks", price: 40, description: "Soft steamed gram flour cakes with tempering", available: true, image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop" },
  { id: 9, name: "Veg Burger", category: "fastfood", price: 65, description: "Crispy veggie patty with fresh vegetables and mayo", available: true, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: 10, name: "Cheese Burger", category: "fastfood", price: 80, description: "Veggie patty with extra cheese and vegetables", available: true, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop" },
  { id: 11, name: "Pizza Slice", category: "fastfood", price: 70, description: "Cheese and vegetable pizza slice", available: true, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
  { id: 12, name: "Veg Momos", category: "fastfood", price: 60, description: "Steamed vegetable dumplings with spicy chutney", available: true, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c423c?w=400&h=300&fit=crop" },
  { id: 13, name: "Fried Momos", category: "fastfood", price: 70, description: "Crispy fried vegetable momos with sauce", available: true, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop" },
  { id: 14, name: "White Sauce Pasta", category: "fastfood", price: 85, description: "Creamy white sauce pasta with vegetables", available: true, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop" },
  { id: 15, name: "Red Sauce Pasta", category: "fastfood", price: 80, description: "Tangy tomato pasta with vegetables and herbs", available: true, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
  { id: 16, name: "Veg Noodles", category: "fastfood", price: 75, description: "Stir-fried vegetable noodles with soy sauce", available: true, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop" },
  { id: 17, name: "Masala Chai", category: "beverages", price: 20, description: "Authentic Indian spiced milk tea", available: true, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop" },
  { id: 18, name: "Filter Coffee", category: "beverages", price: 25, description: "Traditional South Indian filter coffee", available: true, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop" },
  { id: 19, name: "Cold Coffee", category: "beverages", price: 50, description: "Creamy blended cold coffee with chocolate", available: true, image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=300&fit=crop" },
  { id: 20, name: "Fresh Lime Soda", category: "beverages", price: 35, description: "Refreshing lime soda with mint", available: true, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop" },
  { id: 21, name: "Veg Thali", category: "meals", price: 120, description: "Roti, Rice, Dal, 2 Sabzi, Curd, Salad & Sweet", available: true, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop" },
  { id: 22, name: "Chole Bhature", category: "meals", price: 90, description: "Spiced chickpea curry with 2 fluffy bhature", available: true, image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=300&fit=crop" },
  { id: 23, name: "Rajma Chawal", category: "meals", price: 85, description: "Kidney bean curry served with steamed basmati rice", available: true, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop" },
  { id: 24, name: "Fried Rice with Manchurian", category: "meals", price: 110, description: "Veg fried rice with veg manchurian in gravy", available: true, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop" }
];

/* ---------- Category & Metadata Helpers ---------- */
function getItemCategory(itemId, itemName) {
  const menu = JSON.parse(localStorage.getItem('campuseats_menu')) || DEFAULT_MENU_ITEMS;
  const numId = Number(itemId);
  const found = menu.find(m =>
    (!isNaN(numId) && m.id === numId) ||
    (itemName && m.name && m.name.toLowerCase() === itemName.toLowerCase())
  );
  if (found && found.category) return found.category.toLowerCase();

  const defFound = DEFAULT_MENU_ITEMS.find(m =>
    (!isNaN(numId) && m.id === numId) ||
    (itemName && m.name && m.name.toLowerCase() === itemName.toLowerCase())
  );
  if (defFound && defFound.category) return defFound.category.toLowerCase();

  const nameLower = (itemName || '').toLowerCase();
  if (nameLower.includes('burger') || nameLower.includes('pizza') || nameLower.includes('momos') || nameLower.includes('pasta') || nameLower.includes('noodles') || nameLower.includes('manchurian')) return 'fastfood';
  if (nameLower.includes('coffee') || nameLower.includes('chai') || nameLower.includes('soda') || nameLower.includes('lime') || nameLower.includes('shake') || nameLower.includes('drink')) return 'beverages';
  if (nameLower.includes('thali') || nameLower.includes('bhature') || nameLower.includes('chawal') || nameLower.includes('rice') || nameLower.includes('roll') || nameLower.includes('biryani')) return 'meals';
  if (nameLower.includes('samosa') || nameLower.includes('sandwich') || nameLower.includes('pakora') || nameLower.includes('fries') || nameLower.includes('tikki') || nameLower.includes('cutlet') || nameLower.includes('dhokla')) return 'snacks';

  return 'other';
}

function formatCategory(cat) {
  if (!cat || cat === '-') return '-';
  const c = String(cat).toLowerCase();
  if (c === 'fastfood') return 'Fast Food';
  if (c === 'snacks') return 'Snacks';
  if (c === 'beverages') return 'Beverages';
  if (c === 'meals') return 'Meals';
  return c.charAt(0).toUpperCase() + c.slice(1);
}

/* ---------- Date Range Filtering ---------- */
function getFilteredOrders() {
  const filter = dateFilterSelect ? dateFilterSelect.value : 'all';
  const allOrders = getValidOrders();

  if (filter === 'all') return allOrders;

  const now = new Date();

  if (filter === 'today') {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    return allOrders.filter(o => {
      const t = new Date(o.date).getTime();
      return !isNaN(t) && t >= startOfToday && t <= endOfToday;
    });
  }

  if (filter === '7days') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0).getTime();
    return allOrders.filter(o => {
      const t = new Date(o.date).getTime();
      return !isNaN(t) && t >= start;
    });
  }

  if (filter === '30days') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0).getTime();
    return allOrders.filter(o => {
      const t = new Date(o.date).getTime();
      return !isNaN(t) && t >= start;
    });
  }

  return allOrders;
}

/* ---------- Main Analytics Render Function ---------- */
function renderAnalytics() {
  const filteredOrders = getFilteredOrders();

  updateAnalyticsStats(filteredOrders);
  renderDailyOrdersChart(filteredOrders);
  renderDailyRevenueChart(filteredOrders);
  renderCategoryChart(filteredOrders);
  renderPopularItemsChart(filteredOrders);
  renderStatusChart(filteredOrders);
  renderTopSellingTable(filteredOrders);
  renderDiscountAnalytics(filteredOrders);
}

/* ---------- 1. Analytics Overview Stats ---------- */
function updateAnalyticsStats(filteredOrders) {
  const totalOrders = filteredOrders.length;
  const collectedRevenue = filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const grossOrderValue = filteredOrders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);
  const totalDiscounts = filteredOrders.reduce((sum, o) => sum + (Number(o.discountAmount) || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(collectedRevenue / totalOrders) : 0;

  const completedOrders = filteredOrders.filter(o => o.status === 'Completed').length;
  const activeOrders = totalOrders - completedOrders;

  // Aggregate items and categories for overview cards
  const itemCounts = {};
  const categoryCounts = {};

  filteredOrders.forEach(o => {
    (o.items || []).forEach(item => {
      const qty = Number(item.quantity) || 1;
      const key = item.name || `Item #${item.id}`;
      itemCounts[key] = (itemCounts[key] || 0) + qty;

      const cat = item.category || getItemCategory(item.id, item.name);
      categoryCounts[cat] = (categoryCounts[cat] || 0) + qty;
    });
  });

  // Top item
  let popularItemName = '-';
  let popularItemQty = 0;
  for (const [name, qty] of Object.entries(itemCounts)) {
    if (qty > popularItemQty) {
      popularItemName = name;
      popularItemQty = qty;
    }
  }

  // Top category
  let popularCatName = '-';
  let popularCatQty = 0;
  for (const [cat, qty] of Object.entries(categoryCounts)) {
    if (qty > popularCatQty) {
      popularCatName = cat;
      popularCatQty = qty;
    }
  }

  // Update DOM Elements
  const totalOrdersEl = document.getElementById('analyticsTotalOrders');
  const ordersSubtextEl = document.getElementById('analyticsOrdersSubtext');
  if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
  if (ordersSubtextEl) ordersSubtextEl.textContent = `${completedOrders} Completed · ${activeOrders} In-Progress`;

  const totalRevenueEl = document.getElementById('analyticsTotalRevenue');
  const revenueSubtextEl = document.getElementById('analyticsRevenueSubtext');
  if (totalRevenueEl) totalRevenueEl.textContent = formatPrice(collectedRevenue);
  if (revenueSubtextEl) revenueSubtextEl.textContent = `Gross Value: ${formatPrice(grossOrderValue)}`;

  const avgOrderValueEl = document.getElementById('analyticsAvgOrderValue');
  const aovSubtextEl = document.getElementById('analyticsAovSubtext');
  if (avgOrderValueEl) avgOrderValueEl.textContent = formatPrice(avgOrderValue);
  if (aovSubtextEl) aovSubtextEl.textContent = totalOrders > 0 ? 'Net collected / order' : 'No orders in period';

  const totalDiscountsEl = document.getElementById('analyticsTotalDiscounts');
  const discountSubtextEl = document.getElementById('analyticsDiscountSubtext');
  if (totalDiscountsEl) totalDiscountsEl.textContent = formatPrice(totalDiscounts);
  const discountShare = grossOrderValue > 0 ? Math.round((totalDiscounts / grossOrderValue) * 100) : 0;
  if (discountSubtextEl) discountSubtextEl.textContent = `${discountShare}% of gross menu value`;

  const popularItemEl = document.getElementById('analyticsPopularItem');
  const popularItemSubtextEl = document.getElementById('analyticsPopularItemSubtext');
  if (popularItemEl) popularItemEl.textContent = popularItemName;
  if (popularItemSubtextEl) popularItemSubtextEl.textContent = popularItemQty > 0 ? `${popularItemQty} units ordered` : '0 units sold';

  const popularCatEl = document.getElementById('analyticsPopularCategory');
  const popularCatSubtextEl = document.getElementById('analyticsPopularCategorySubtext');
  if (popularCatEl) popularCatEl.textContent = formatCategory(popularCatName);
  if (popularCatSubtextEl) popularCatSubtextEl.textContent = popularCatQty > 0 ? `${popularCatQty} items ordered` : '0 items ordered';
}

/* ---------- Chart Helpers & Lifecycle Management ---------- */
function destroyChart(chartId) {
  if (analyticsCharts[chartId]) {
    analyticsCharts[chartId].destroy();
    delete analyticsCharts[chartId];
  }
}

function showChartEmptyState(chartId, message = 'No order data available for selected period') {
  const container = document.getElementById(chartId);
  if (!container) return;
  destroyChart(chartId);
  container.innerHTML = `
    <div class="chart-empty-state">
      <span class="chart-empty-icon">📊</span>
      <p>${message}</p>
    </div>
  `;
}

function renderFallbackChart(container, items, labelFormatter = (v) => v) {
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="chart-empty-state"><span class="chart-empty-icon">📊</span><p>No data to display</p></div>';
    return;
  }
  const maxVal = Math.max(...items.map(i => i.value), 1);
  container.innerHTML = `
    <div class="simple-bar-chart">
      ${items.map(item => `
        <div class="chart-bar">
          <div class="chart-bar-label">${item.label}</div>
          <div class="chart-bar-track">
            <div class="chart-bar-fill" style="width: ${(item.value / maxVal) * 100}%; background: ${item.color || 'var(--primary)'};">
              ${labelFormatter(item.value)}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 2. Sales Analytics Charts ---------- */

// Daily Order Count Chart
function renderDailyOrdersChart(filteredOrders) {
  const chartId = 'dailyOrdersChart';
  const container = document.getElementById(chartId);
  if (!container) return;

  if (filteredOrders.length === 0) {
    showChartEmptyState(chartId, 'No orders placed in this period');
    return;
  }

  const filter = dateFilterSelect ? dateFilterSelect.value : 'all';
  const { labels, data } = prepareTimelineData(filteredOrders, filter, 'count');

  const ChartClass = window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  if (ChartClass) {
    destroyChart(chartId);
    container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
    const ctx = document.getElementById(`${chartId}Canvas`).getContext('2d');

    analyticsCharts[chartId] = new ChartClass(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Orders Count',
          data,
          backgroundColor: 'rgba(255, 107, 53, 0.85)',
          hoverBackgroundColor: '#ff6b35',
          borderRadius: 6,
          maxBarThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2d3436',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => ` Orders: ${ctx.raw}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 11 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            ticks: { font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    const items = labels.map((lbl, idx) => ({ label: lbl, value: data[idx], color: 'var(--primary)' }));
    renderFallbackChart(container, items, v => `${v} orders`);
  }
}

// Daily Sales Revenue Chart
function renderDailyRevenueChart(filteredOrders) {
  const chartId = 'dailyRevenueChart';
  const container = document.getElementById(chartId);
  if (!container) return;

  if (filteredOrders.length === 0) {
    showChartEmptyState(chartId, 'No sales revenue in this period');
    return;
  }

  const filter = dateFilterSelect ? dateFilterSelect.value : 'all';
  const { labels, data } = prepareTimelineData(filteredOrders, filter, 'revenue');

  const ChartClass = window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  if (ChartClass) {
    destroyChart(chartId);
    container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
    const ctx = document.getElementById(`${chartId}Canvas`).getContext('2d');

    analyticsCharts[chartId] = new ChartClass(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Collected Revenue',
          data,
          borderColor: '#00b894',
          backgroundColor: 'rgba(0, 184, 148, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#00b894',
          pointHoverRadius: 6,
          pointRadius: 4,
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2d3436',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => ` Revenue: ₹${ctx.raw.toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 },
              callback: (v) => `₹${v}`
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            ticks: { font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    const items = labels.map((lbl, idx) => ({ label: lbl, value: data[idx], color: 'var(--accent)' }));
    renderFallbackChart(container, items, v => formatPrice(v));
  }
}

// Timeline data preparation helper
function prepareTimelineData(ordersList, filter, metric) {
  const now = new Date();

  if (filter === '7days') {
    const labels = [];
    const keys = [];
    const map = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      keys.push(key);
      labels.push(label);
      map[key] = 0;
    }

    ordersList.forEach(o => {
      const od = new Date(o.date);
      if (isNaN(od.getTime())) return;
      const key = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, '0')}-${String(od.getDate()).padStart(2, '0')}`;
      if (map[key] !== undefined) {
        map[key] += metric === 'count' ? 1 : (Number(o.total) || 0);
      }
    });

    return { labels, data: keys.map(k => map[k]) };
  }

  if (filter === '30days') {
    const labels = [];
    const keys = [];
    const map = {};

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      keys.push(key);
      labels.push(label);
      map[key] = 0;
    }

    ordersList.forEach(o => {
      const od = new Date(o.date);
      if (isNaN(od.getTime())) return;
      const key = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, '0')}-${String(od.getDate()).padStart(2, '0')}`;
      if (map[key] !== undefined) {
        map[key] += metric === 'count' ? 1 : (Number(o.total) || 0);
      }
    });

    return { labels, data: keys.map(k => map[k]) };
  }

  if (filter === 'today') {
    // Group into 2-hour slots for today
    const slots = ['08-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22'];
    const labels = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
    const map = {};
    slots.forEach(s => { map[s] = 0; });

    ordersList.forEach(o => {
      const od = new Date(o.date);
      if (isNaN(od.getTime())) return;
      const h = od.getHours();
      let slot = null;
      if (h < 10) slot = '08-10';
      else if (h < 12) slot = '10-12';
      else if (h < 14) slot = '12-14';
      else if (h < 16) slot = '14-16';
      else if (h < 18) slot = '16-18';
      else if (h < 20) slot = '18-20';
      else slot = '20-22';

      map[slot] += metric === 'count' ? 1 : (Number(o.total) || 0);
    });

    return { labels, data: slots.map(s => map[s]) };
  }

  // All Time: chronological grouping by unique dates
  const dateMap = {};
  ordersList.forEach(o => {
    const od = new Date(o.date);
    if (isNaN(od.getTime())) return;
    const key = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, '0')}-${String(od.getDate()).padStart(2, '0')}`;
    if (!dateMap[key]) {
      dateMap[key] = {
        label: od.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        val: 0
      };
    }
    dateMap[key].val += metric === 'count' ? 1 : (Number(o.total) || 0);
  });

  const sortedKeys = Object.keys(dateMap).sort();
  if (sortedKeys.length > 1) {
    const firstDate = new Date(sortedKeys[0]);
    const lastDate = new Date(sortedKeys[sortedKeys.length - 1]);
    const daySpan = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    if (daySpan > 0 && daySpan <= 14) {
      const continuousLabels = [];
      const continuousData = [];
      const cur = new Date(firstDate);
      while (cur <= lastDate) {
        const k = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
        continuousLabels.push(cur.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
        continuousData.push(dateMap[k] ? dateMap[k].val : 0);
        cur.setDate(cur.getDate() + 1);
      }
      return { labels: continuousLabels, data: continuousData };
    }
  }

  return {
    labels: sortedKeys.map(k => dateMap[k].label),
    data: sortedKeys.map(k => dateMap[k].val)
  };
}

// Orders by Food Category Chart
function renderCategoryChart(filteredOrders) {
  const chartId = 'categoryChart';
  const container = document.getElementById(chartId);
  if (!container) return;

  const categoryTotals = {
    snacks: 0,
    fastfood: 0,
    beverages: 0,
    meals: 0
  };

  let totalItemsCount = 0;

  filteredOrders.forEach(o => {
    (o.items || []).forEach(item => {
      const cat = item.category || getItemCategory(item.id, item.name);
      const qty = Number(item.quantity) || 1;
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += qty;
      } else {
        categoryTotals.snacks += qty;
      }
      totalItemsCount += qty;
    });
  });

  if (totalItemsCount === 0) {
    showChartEmptyState(chartId, 'No items ordered in this period');
    return;
  }

  const labels = ['Snacks', 'Fast Food', 'Beverages', 'Meals'];
  const data = [
    categoryTotals.snacks,
    categoryTotals.fastfood,
    categoryTotals.beverages,
    categoryTotals.meals
  ];
  const colors = ['#ff6b35', '#d63031', '#0984e3', '#00b894'];

  const ChartClass = window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  if (ChartClass) {
    destroyChart(chartId);
    container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
    const ctx = document.getElementById(`${chartId}Canvas`).getContext('2d');

    analyticsCharts[chartId] = new ChartClass(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 14,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#2d3436',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const pct = Math.round((val / totalItemsCount) * 100);
                return ` ${ctx.label}: ${val} items (${pct}%)`;
              }
            }
          }
        },
        cutout: '62%'
      }
    });
  } else {
    const items = labels.map((lbl, idx) => ({ label: lbl, value: data[idx], color: colors[idx] }));
    renderFallbackChart(container, items, v => `${v} items`);
  }
}

// Most Popular Food Items Chart
function renderPopularItemsChart(filteredOrders) {
  const chartId = 'popularItemsChart';
  const container = document.getElementById(chartId);
  if (!container) return;

  const itemMap = {};
  filteredOrders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.name || `Item #${item.id}`;
      itemMap[key] = (itemMap[key] || 0) + (Number(item.quantity) || 1);
    });
  });

  const sortedItems = Object.entries(itemMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  if (sortedItems.length === 0) {
    showChartEmptyState(chartId, 'No items ordered in this period');
    return;
  }

  const labels = sortedItems.map(i => i.name);
  const data = sortedItems.map(i => i.qty);

  const ChartClass = window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  if (ChartClass) {
    destroyChart(chartId);
    container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
    const ctx = document.getElementById(`${chartId}Canvas`).getContext('2d');

    analyticsCharts[chartId] = new ChartClass(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Quantity Ordered',
          data,
          backgroundColor: 'rgba(108, 92, 231, 0.85)',
          hoverBackgroundColor: '#6c5ce7',
          borderRadius: 6,
          maxBarThickness: 24
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2d3436',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => ` Quantity: ${ctx.raw} units`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 11 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          y: {
            ticks: { font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    const items = sortedItems.map(i => ({ label: i.name, value: i.qty, color: '#6c5ce7' }));
    renderFallbackChart(container, items, v => `${v} ordered`);
  }
}

// Order Status Distribution Chart
function renderStatusChart(filteredOrders) {
  const chartId = 'statusChart';
  const container = document.getElementById(chartId);
  if (!container) return;

  if (filteredOrders.length === 0) {
    showChartEmptyState(chartId, 'No order records in this period');
    return;
  }

  const statusCounts = {
    'Order Placed': filteredOrders.filter(o => o.status === 'Order Placed').length,
    'Preparing': filteredOrders.filter(o => o.status === 'Preparing').length,
    'Ready for Pickup': filteredOrders.filter(o => o.status === 'Ready for Pickup').length,
    'Completed': filteredOrders.filter(o => o.status === 'Completed').length
  };

  const labels = Object.keys(statusCounts);
  const data = Object.values(statusCounts);
  const colors = ['#1976d2', '#f57c00', '#388e3c', '#7b1fa2'];
  const totalOrders = filteredOrders.length;

  const ChartClass = window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  if (ChartClass) {
    destroyChart(chartId);
    container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
    const ctx = document.getElementById(`${chartId}Canvas`).getContext('2d');

    analyticsCharts[chartId] = new ChartClass(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 14,
              font: { size: 11 }
            }
          },
          tooltip: {
            backgroundColor: '#2d3436',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => {
                const val = ctx.raw;
                const pct = Math.round((val / totalOrders) * 100);
                return ` ${ctx.label}: ${val} orders (${pct}%)`;
              }
            }
          }
        },
        cutout: '62%'
      }
    });
  } else {
    const items = labels.map((lbl, idx) => ({ label: lbl, value: data[idx], color: colors[idx] }));
    renderFallbackChart(container, items, v => `${v} orders`);
  }
}

/* ---------- 4. Top Selling Items Table ---------- */
function renderTopSellingTable(filteredOrders) {
  if (!topSellingTable) return;

  const itemMap = {};
  const categoryCounts = {};

  filteredOrders.forEach(order => {
    const seenInThisOrder = new Set();

    (order.items || []).forEach(item => {
      const key = item.id ? String(item.id) : item.name;
      const cat = item.category || getItemCategory(item.id, item.name);
      const qty = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;
      const sales = Number(item.total) || (price * qty);

      if (!itemMap[key]) {
        itemMap[key] = {
          name: item.name || 'Unnamed Food Item',
          category: cat,
          totalQuantity: 0,
          orderCount: 0,
          totalSales: 0
        };
      }

      itemMap[key].totalQuantity += qty;
      itemMap[key].totalSales += sales;

      if (!seenInThisOrder.has(key)) {
        seenInThisOrder.add(key);
        itemMap[key].orderCount += 1;
      }

      categoryCounts[cat] = (categoryCounts[cat] || 0) + qty;
    });
  });

  const sortedItems = Object.values(itemMap).sort((a, b) => {
    if (b.totalQuantity !== a.totalQuantity) {
      return b.totalQuantity - a.totalQuantity;
    }
    return b.totalSales - a.totalSales;
  });

  // Most popular category badge
  let topCat = '-';
  let maxCatQty = 0;
  for (const [c, count] of Object.entries(categoryCounts)) {
    if (count > maxCatQty) {
      topCat = c;
      maxCatQty = count;
    }
  }

  if (topSellingCategoryBadge) {
    topSellingCategoryBadge.textContent = topCat !== '-'
      ? `Top Category: ${formatCategory(topCat)} (${maxCatQty} sold)`
      : 'Top Category: None';
  }

  if (sortedItems.length === 0) {
    topSellingTable.innerHTML = '';
    if (emptyTopSelling) emptyTopSelling.style.display = 'block';
    return;
  }

  if (emptyTopSelling) emptyTopSelling.style.display = 'none';

  topSellingTable.innerHTML = sortedItems.map((item, idx) => {
    const rank = idx + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
    const catClass = ['snacks', 'fastfood', 'beverages', 'meals'].includes(item.category)
      ? item.category
      : 'other';

    return `
      <tr>
        <td><span class="rank-badge ${rankClass}">#${rank}</span></td>
        <td><strong>${item.name}</strong></td>
        <td><span class="category-pill ${catClass}">${formatCategory(item.category)}</span></td>
        <td><strong>${item.totalQuantity}</strong></td>
        <td>${item.orderCount} order${item.orderCount > 1 ? 's' : ''}</td>
        <td><strong>${formatPrice(item.totalSales)}</strong></td>
      </tr>
    `;
  }).join('');
}

/* ---------- 5. Discount Analytics ---------- */
function renderDiscountAnalytics(filteredOrders) {
  const totalDiscountAmount = filteredOrders.reduce((sum, o) => sum + (Number(o.discountAmount) || 0), 0);
  const discountedOrders = filteredOrders.filter(o => (Number(o.discountAmount) > 0) || (Number(o.discountPercent) > 0));
  const discountOrderCount = discountedOrders.length;
  const avgDiscount = discountOrderCount > 0 ? Math.round(totalDiscountAmount / discountOrderCount) : 0;

  // Stat Cards
  const totalAmountEl = document.getElementById('discountTotalAmount');
  const countEl = document.getElementById('discountOrderCount');
  const avgEl = document.getElementById('discountAvgPerOrder');
  const eligibleSubtextEl = document.getElementById('discountEligibleSubtext');

  if (totalAmountEl) totalAmountEl.textContent = formatPrice(totalDiscountAmount);
  if (countEl) countEl.textContent = discountOrderCount;
  if (avgEl) avgEl.textContent = formatPrice(avgDiscount);
  if (eligibleSubtextEl) {
    const pct = filteredOrders.length > 0 ? Math.round((discountOrderCount / filteredOrders.length) * 100) : 0;
    eligibleSubtextEl.textContent = `${pct}% of total orders`;
  }

  // Tier counts
  // Tier 0: 0% (Below 100)
  // Tier 1: 10% (100 - 199)
  // Tier 2: 15% (200 - 299)
  // Tier 3: 20% (300 - 499)
  // Tier 4: 25% (500+)
  const tierCounts = {
    0: 0,
    10: 0,
    15: 0,
    20: 0,
    25: 0
  };

  filteredOrders.forEach(o => {
    let p = o.discountPercent;
    if (p === undefined || isNaN(Number(p))) {
      const subtotal = Number(o.subtotal) || 0;
      if (subtotal < 100) p = 0;
      else if (subtotal < 200) p = 10;
      else if (subtotal < 300) p = 15;
      else if (subtotal < 500) p = 20;
      else p = 25;
    } else {
      p = Number(p);
    }

    if (tierCounts[p] !== undefined) {
      tierCounts[p]++;
    } else {
      tierCounts[0]++;
    }
  });

  const tier0El = document.getElementById('tierCount0');
  const tier10El = document.getElementById('tierCount10');
  const tier15El = document.getElementById('tierCount15');
  const tier20El = document.getElementById('tierCount20');
  const tier25El = document.getElementById('tierCount25');

  if (tier0El) tier0El.textContent = `${tierCounts[0]} orders`;
  if (tier10El) tier10El.textContent = `${tierCounts[10]} orders`;
  if (tier15El) tier15El.textContent = `${tierCounts[15]} orders`;
  if (tier20El) tier20El.textContent = `${tierCounts[20]} orders`;
  if (tier25El) tier25El.textContent = `${tierCounts[25]} orders`;

  // Discount Distribution Chart
  const chartId = 'discountDistributionChart';
  const container = document.getElementById(chartId);
  if (!container) return;

  if (filteredOrders.length === 0) {
    showChartEmptyState(chartId, 'No discount records in this period');
    return;
  }

  const labels = ['0% (Below ₹100)', '10% (₹100–199)', '15% (₹200–299)', '20% (₹300–499)', '25% (₹500+)'];
  const data = [tierCounts[0], tierCounts[10], tierCounts[15], tierCounts[20], tierCounts[25]];
  const colors = ['#b2bec3', '#74b9ff', '#55efc4', '#ffeaa7', '#ff7675'];

  const ChartClass = window.Chart || (typeof Chart !== 'undefined' ? Chart : null);
  if (ChartClass) {
    destroyChart(chartId);
    container.innerHTML = `<canvas id="${chartId}Canvas"></canvas>`;
    const ctx = document.getElementById(`${chartId}Canvas`).getContext('2d');

    analyticsCharts[chartId] = new ChartClass(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Number of Orders',
          data,
          backgroundColor: colors,
          borderRadius: 6,
          maxBarThickness: 45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#2d3436',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (ctx) => ` Orders in tier: ${ctx.raw}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
              font: { size: 11 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.05)' }
          },
          x: {
            ticks: { font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    const items = labels.map((lbl, idx) => ({ label: lbl, value: data[idx], color: colors[idx] }));
    renderFallbackChart(container, items, v => `${v} orders`);
  }
}

/* ---------- 6. Report Generation (CSV Export) ---------- */
function exportSalesReportCSV() {
  const filteredOrders = getFilteredOrders();

  if (filteredOrders.length === 0) {
    showAdminNotification('No orders available in the selected date range to export.', 'warning');
    return;
  }

  const headers = [
    'Order ID',
    'Student Name',
    'Roll Number',
    'Department',
    'Order Date',
    'Ordered Items',
    'Subtotal',
    'Discount (%)',
    'Discount Amount',
    'Final Amount',
    'Order Status'
  ];

  const escapeCsv = (str) => {
    const s = String(str ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = filteredOrders.map(order => {
    const itemsStr = (order.items || [])
      .map(item => `${item.name} (x${item.quantity})`)
      .join('; ');

    return [
      escapeCsv(order.orderId),
      escapeCsv(order.studentName),
      escapeCsv(order.rollNumber || 'N/A'),
      escapeCsv(order.department || 'N/A'),
      escapeCsv(formatDate(order.date)),
      escapeCsv(itemsStr),
      order.subtotal ?? 0,
      `${order.discountPercent ?? 0}%`,
      order.discountAmount ?? 0,
      order.total ?? 0,
      escapeCsv(order.status)
    ].join(',');
  });

  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const filter = dateFilterSelect ? dateFilterSelect.value : 'all';
  const nowStr = new Date().toISOString().slice(0, 10);
  const filename = `CampusEats_Sales_Report_${filter}_${nowStr}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showAdminNotification(`Sales report downloaded: ${filename}`, 'success');
}

/* ---------- Event Listeners for Date Filter & CSV Export ---------- */
if (dateFilterSelect) {
  dateFilterSelect.addEventListener('change', () => {
    renderAnalytics();
  });
}

if (exportCSVBtn) {
  exportCSVBtn.addEventListener('click', () => {
    exportSalesReportCSV();
  });
}
