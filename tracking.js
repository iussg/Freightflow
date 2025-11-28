
// ===== DASHBOARD NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const dashboardSections = document.querySelectorAll('.dashboard-section');

navItems.forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const sectionId = this.dataset.section;
    
    // Update active nav item
    navItems.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
    
    // Show corresponding section
    dashboardSections.forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
    
    // Close sidebar on mobile
    closeDashboardSidebar();
  });
});

// Sidebar toggle for mobile
function closeDashboardSidebar() {
  const sidebar = document.getElementById('dashboardSidebar');
  if (sidebar && window.innerWidth < 768) {
    sidebar.classList.remove('active');
  }
}

const sidebarClose = document.getElementById('sidebarClose');
if (sidebarClose) {
  sidebarClose.addEventListener('click', closeDashboardSidebar);
}

// ===== NOTIFICATIONS PANEL =====
const notificationBtn = document.querySelector('.notification-btn');
const notificationsPanel = document.getElementById('notificationsPanel');
const closeNotifications = document.getElementById('closeNotifications');

if (notificationBtn && notificationsPanel) {
  notificationBtn.addEventListener('click', function() {
    notificationsPanel.hidden = false;
    notificationsPanel.classList.add('active');
  });
}

if (closeNotifications && notificationsPanel) {
  closeNotifications.addEventListener('click', function() {
    notificationsPanel.classList.remove('active');
    setTimeout(() => {
      notificationsPanel.hidden = true;
    }, 300);
  });
}

// Mark all as read
const markAllReadBtn = document.querySelector('.mark-all-read');
if (markAllReadBtn) {
  markAllReadBtn.addEventListener('click', function() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
      item.classList.remove('unread');
    });
    
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      badge.textContent = '0';
      badge.style.display = 'none';
    }
    
    showNotification('All notifications marked as read', 'success');
  });
}

// ===== RENDER ACTIVE BOOKINGS =====
const mockActiveBookings = [
  {
    id: 'FF240567890',
    pickup: 'Mumbai',
    delivery: 'Pune',
    status: 'in-transit',
    statusText: 'In Transit',
    eta: '2h 15m'
  },
  {
    id: 'FF240567889',
    pickup: 'Bangalore',
    delivery: 'Chennai',
    status: 'scheduled',
    statusText: 'Scheduled',
    eta: 'Tomorrow 10:00 AM'
  },
  {
    id: 'FF240567888',
    pickup: 'Delhi',
    delivery: 'Jaipur',
    status: 'in-transit',
    statusText: 'In Transit',
    eta: '4h 30m'
  }
];

function renderActiveBookings() {
  const listContainer = document.getElementById('activeBookingsList');
  const gridContainer = document.getElementById('activeBookingsGrid');
  
  if (!listContainer && !gridContainer) return;
  
  const bookingsHTML = mockActiveBookings.map(booking => `
    <div class="booking-item" onclick="window.location.href='tracking.html?id=${booking.id}'">
      <div class="booking-header">
        <span class="booking-id-text">#${booking.id}</span>
        <span class="booking-status ${booking.status}">${booking.statusText}</span>
      </div>
      <div class="booking-route">
        <i data-feather="map-pin"></i>
        <span>${booking.pickup}</span>
        <i data-feather="arrow-right"></i>
        <span>${booking.delivery}</span>
      </div>
      <div class="booking-route">
        <i data-feather="clock"></i>
        <span>ETA: ${booking.eta}</span>
      </div>
    </div>
  `).join('');
  
  if (listContainer) {
    listContainer.innerHTML = bookingsHTML;
  }
  
  if (gridContainer) {
    gridContainer.innerHTML = bookingsHTML;
  }
  
  feather.replace();
}

// ===== RENDER PAST ORDERS =====
const mockPastOrders = [
  {
    id: 'FF240567891',
    route: 'Mumbai → Pune',
    date: '02 Nov 2025',
    status: 'Delivered',
    amount: '₹12,500'
  },
  {
    id: 'FF240567887',
    route: 'Delhi → Jaipur',
    date: '28 Oct 2025',
    status: 'Delivered',
    amount: '₹18,900'
  },
  {
    id: 'FF240567886',
    route: 'Bangalore → Chennai',
    date: '25 Oct 2025',
    status: 'Delivered',
    amount: '₹22,000'
  }
];

function renderPastOrders() {
  const tableBody = document.getElementById('pastOrdersTable');
  if (!tableBody) return;
  
  const ordersHTML = mockPastOrders.map(order => `
    <tr>
      <td><strong>#${order.id}</strong></td>
      <td>${order.route}</td>
      <td>${order.date}</td>
      <td><span class="booking-status delivered">${order.status}</span></td>
      <td><strong>${order.amount}</strong></td>
      <td>
        <div class="table-actions">
          <button class="btn-icon-sm" title="View Details" onclick="alert('View order details')">
            <i data-feather="eye"></i>
          </button>
          <button class="btn-icon-sm" title="Download Invoice" onclick="downloadInvoice('${order.id}')">
            <i data-feather="download"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  tableBody.innerHTML = ordersHTML;
  feather.replace();
}

// ===== RENDER SAVED TRUCKS =====
const mockSavedTrucks = [
  {
    name: 'Tata 407',
    type: 'Open Body',
    capacity: '9 Tons',
    transporter: 'Rajesh Transport'
  },
  {
    name: 'Eicher Pro 3015',
    type: 'Container',
    capacity: '16 Tons',
    transporter: 'Sharma Logistics'
  }
];

function renderSavedTrucks() {
  const gridContainer = document.getElementById('savedTrucksGrid');
  if (!gridContainer) return;
  
  const trucksHTML = mockSavedTrucks.map(truck => `
    <div class="booking-item">
      <div class="booking-header">
        <span class="booking-id-text">${truck.name}</span>
        <button class="btn-icon-sm" onclick="alert('Remove from saved')">
          <i data-feather="x"></i>
        </button>
      </div>
      <div class="booking-route">
        <i data-feather="package"></i>
        <span>${truck.type} • ${truck.capacity}</span>
      </div>
      <div class="booking-route">
        <i data-feather="user"></i>
        <span>${truck.transporter}</span>
      </div>
    </div>
  `).join('');
  
  gridContainer.innerHTML = trucksHTML;
  feather.replace();
}

// ===== RENDER INVOICES =====
const mockInvoices = [
  {
    id: 'FF240567891',
    date: '02 Nov 2025',
    amount: '₹12,500',
    route: 'Mumbai → Pune'
  },
  {
    id: 'FF240567887',
    date: '28 Oct 2025',
    amount: '₹18,900',
    route: 'Delhi → Jaipur'
  }
];

function renderInvoices() {
  const invoicesList = document.getElementById('invoicesList');
  if (!invoicesList) return;
  
  const invoicesHTML = mockInvoices.map(invoice => `
    <div class="invoice-item">
      <div class="invoice-info">
        <h4>Invoice #${invoice.id}</h4>
        <p>${invoice.route} • ${invoice.date}</p>
        <p><strong>${invoice.amount}</strong></p>
      </div>
      <div class="invoice-actions">
        <button class="btn-icon-sm" title="View Invoice" onclick="alert('View invoice')">
          <i data-feather="eye"></i>
        </button>
        <button class="btn-icon-sm" title="Download PDF" onclick="downloadInvoice('${invoice.id}')">
          <i data-feather="download"></i>
        </button>
      </div>
    </div>
  `).join('');
  
  invoicesList.innerHTML = invoicesHTML;
  feather.replace();
}

// ===== INVOICE DOWNLOAD =====
function downloadInvoice(bookingId) {
  showNotification('Preparing invoice...', 'info');
  
  // Simulate PDF generation
  setTimeout(() => {
    // In production, use html2pdf or jsPDF library
    console.log('Generating invoice for:', bookingId);
    showNotification(`Invoice #${bookingId} downloaded successfully`, 'success');
    
    // Simulated download
    // const link = document.createElement('a');
    // link.href = 'path/to/invoice.pdf';
    // link.download = `invoice-${bookingId}.pdf`;
    // link.click();
  }, 1500);
}

// ===== INITIALIZE DASHBOARD =====
if (document.querySelector('.dashboard-layout')) {
  renderActiveBookings();
  renderPastOrders();
  renderSavedTrucks();
  renderInvoices();
}

// ===== TRACKING PAGE =====
if (document.getElementById('trackingMap')) {
  // Simulate real-time location updates
  let updateCount = 0;
  const maxUpdates = 10;
  
  const updateInterval = setInterval(() => {
    updateCount++;
    
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
      lastUpdateEl.textContent = 'Updated just now';
    }
    
    // Update distance
    const distanceCovered = 85 + (updateCount * 5);
    const remainingDistance = 150 - distanceCovered;
    
    document.querySelectorAll('.stat-value').forEach((el, index) => {
      if (index === 0) el.textContent = `${distanceCovered} km`;
      if (index === 2) el.textContent = `${remainingDistance} km`;
    });
    
    if (updateCount >= maxUpdates) {
      clearInterval(updateInterval);
    }
  }, 5000);
  
  // Map controls
  const centerMapBtn = document.getElementById('centerMap');
  const refreshLocationBtn = document.getElementById('refreshLocation');
  
  if (centerMapBtn) {
    centerMapBtn.addEventListener('click', function() {
      showNotification('Map centered on vehicle location', 'info');
      console.log('Center map clicked');
    });
  }
  
  if (refreshLocationBtn) {
    refreshLocationBtn.addEventListener('click', function() {
      showNotification('Location refreshed', 'success');
      console.log('Refresh location clicked');
    });
  }
}

// Notification helper function
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    background-color: ${type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    animation: slideInRight 0.3s ease-out;
    font-weight: 500;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
