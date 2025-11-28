/**
 * FREIGHTFLOW - MAIN APPLICATION LOGIC
 */

(function() {
  'use strict';

  // ===== MOBILE MENU TOGGLE =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== HOMEPAGE AUTOCOMPLETE =====
  const pickupInput = document.getElementById('pickup');
  const deliveryInput = document.getElementById('delivery');
  const pickupSuggestions = document.getElementById('pickupSuggestions');
  const deliverySuggestions = document.getElementById('deliverySuggestions');

  // Cities data (inline for immediate availability)
  const citiesData = [
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Bangalore', state: 'Karnataka' },
    { city: 'Hyderabad', state: 'Telangana' },
    { city: 'Chennai', state: 'Tamil Nadu' },
    { city: 'Kolkata', state: 'West Bengal' },
    { city: 'Pune', state: 'Maharashtra' },
    { city: 'Ahmedabad', state: 'Gujarat' },
    { city: 'Surat', state: 'Gujarat' },
    { city: 'Jaipur', state: 'Rajasthan' },
    { city: 'Lucknow', state: 'Uttar Pradesh' },
    { city: 'Kanpur', state: 'Uttar Pradesh' },
    { city: 'Nagpur', state: 'Maharashtra' },
    { city: 'Indore', state: 'Madhya Pradesh' },
    { city: 'Bhopal', state: 'Madhya Pradesh' },
    { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { city: 'Coimbatore', state: 'Tamil Nadu' },
    { city: 'Kochi', state: 'Kerala' },
    { city: 'Vadodara', state: 'Gujarat' },
    { city: 'Gurgaon', state: 'Haryana' }
  ];

  // Autocomplete class
  class SimpleAutocomplete {
    constructor(input, suggestions, data) {
      this.input = input;
      this.suggestions = suggestions;
      this.data = data;
      this.selectedIndex = -1;
      this.init();
    }

    init() {
      if (!this.input || !this.suggestions) return;

      this.input.addEventListener('input', () => this.handleInput());
      this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
      this.input.addEventListener('focus', () => this.handleInput());
      document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    handleInput() {
      const query = this.input.value.trim();
      
      if (query.length < 1) {
        this.hideSuggestions();
        return;
      }

      const filtered = this.filterCities(query);
      this.renderSuggestions(filtered, query);
    }

    filterCities(query) {
      const lowerQuery = query.toLowerCase();
      return this.data
        .filter(city => 
          city.city.toLowerCase().includes(lowerQuery) ||
          city.state.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 8);
    }

    renderSuggestions(cities, query) {
      if (cities.length === 0) {
        this.hideSuggestions();
        return;
      }

      this.suggestions.innerHTML = cities
        .map((city, index) => `
          <li class="autocomplete-item" role="option" data-index="${index}" data-value="${city.city}">
            <div class="autocomplete-item-main">${this.highlightMatch(city.city, query)}</div>
            <div class="autocomplete-item-sub">${city.state}</div>
          </li>
        `)
        .join('');

      this.suggestions.classList.add('active');
      this.attachItemListeners();
    }

    highlightMatch(text, query) {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }

    attachItemListeners() {
      const items = this.suggestions.querySelectorAll('.autocomplete-item');
      items.forEach(item => {
        item.addEventListener('click', () => {
          this.selectItem(item.dataset.value);
        });
      });
    }

    handleKeydown(e) {
      const items = this.suggestions.querySelectorAll('.autocomplete-item');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
        this.highlightItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.highlightItem(items);
      } else if (e.key === 'Enter' && this.selectedIndex >= 0) {
        e.preventDefault();
        const selectedItem = items[this.selectedIndex];
        if (selectedItem) {
          this.selectItem(selectedItem.dataset.value);
        }
      } else if (e.key === 'Escape') {
        this.hideSuggestions();
      }
    }

    highlightItem(items) {
      items.forEach((item, index) => {
        item.classList.toggle('highlighted', index === this.selectedIndex);
      });
    }

    selectItem(value) {
      this.input.value = value;
      
      // Set hidden input for validation
      const hiddenInput = document.getElementById(this.input.id + '-selected');
      if (hiddenInput) {
        hiddenInput.value = value;
      }
      
      this.hideSuggestions();
      this.selectedIndex = -1;
    }

    hideSuggestions() {
      this.suggestions.classList.remove('active');
      this.selectedIndex = -1;
    }

    handleClickOutside(e) {
      if (!this.input.contains(e.target) && !this.suggestions.contains(e.target)) {
        this.hideSuggestions();
      }
    }
  }

  // Initialize autocomplete on homepage
  if (pickupInput && pickupSuggestions) {
    new SimpleAutocomplete(pickupInput, pickupSuggestions, citiesData);
  }

  if (deliveryInput && deliverySuggestions) {
    new SimpleAutocomplete(deliveryInput, deliverySuggestions, citiesData);
  }

  // ===== QUICK BOOKING FORM SUBMISSION =====
  const quickBookingForm = document.getElementById('quickBookingForm');

  if (quickBookingForm) {
    quickBookingForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const pickup = document.getElementById('pickup').value.trim();
      const delivery = document.getElementById('delivery').value.trim();
      const truckType = document.getElementById('truckType').value;

      // Validation
      if (!pickup) {
        alert('Please enter pickup location');
        document.getElementById('pickup').focus();
        return;
      }

      if (!delivery) {
        alert('Please enter delivery location');
        document.getElementById('delivery').focus();
        return;
      }

      if (!truckType) {
        alert('Please select truck type');
        document.getElementById('truckType').focus();
        return;
      }

      if (pickup.toLowerCase() === delivery.toLowerCase()) {
        alert('Pickup and delivery locations must be different');
        return;
      }

      // Store search data in sessionStorage
      sessionStorage.setItem('searchData', JSON.stringify({
        pickup: pickup,
        delivery: delivery,
        truckType: truckType,
        timestamp: new Date().toISOString()
      }));

      // Show loading indicator
      const submitBtn = quickBookingForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-feather="loader"></i><span>Searching...</span>';
      feather.replace();

      // Simulate search delay (remove in production)
      setTimeout(() => {
        // Redirect to booking page
        window.location.href = 'booking.html';
      }, 800);
    });
  }

  // ===== INITIALIZE FEATHER ICONS =====
  if (typeof feather !== 'undefined') {
    feather.replace();
  }

})();

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(err => {
        console.error('ServiceWorker registration failed:', err);
      });
  });
}

// ===== PWA INSTALL PROMPT =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install prompt after 30 seconds
  setTimeout(() => {
    showInstallPrompt();
  }, 30000);
});

function showInstallPrompt() {
  const dismissed = localStorage.getItem('pwa-install-dismissed');
  if (dismissed) return;

  const prompt = document.createElement('div');
  prompt.className = 'install-prompt';
  prompt.innerHTML = `
    <div class="prompt-icon">⚡</div>
    <div class="prompt-content">
      <h4>Install FreightFlow</h4>
      <p>Access offline, faster loading, home screen icon</p>
    </div>
    <div class="prompt-actions">
      <button class="btn-install">Install</button>
      <button class="btn-dismiss">Not Now</button>
    </div>
  `;
  
  document.body.appendChild(prompt);
  
  prompt.querySelector('.btn-install').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('Install outcome:', outcome);
      deferredPrompt = null;
    }
    prompt.remove();
  });
  
  prompt.querySelector('.btn-dismiss').addEventListener('click', () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    prompt.remove();
  });
}

// ===== OFFLINE/ONLINE DETECTION =====
window.addEventListener('online', () => {
  console.log('Connection restored');
  const banner = document.querySelector('.offline-banner');
  if (banner) {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 300);
  }
});

window.addEventListener('offline', () => {
  console.log('Connection lost');
  let banner = document.querySelector('.offline-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'offline-banner';
    banner.innerHTML = '<span class="icon">📡</span>You are offline. Some features may be unavailable.';
    document.body.prepend(banner);
  }
  setTimeout(() => banner.classList.add('show'), 100);
});
// ===== NAVIGATION HANDLERS =====

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Only handle local anchors
    if (href === '#' || href === '#!') return;

    const targetElement = document.querySelector(href);
    
    if (targetElement) {
      e.preventDefault();
      
      // Close mobile menu if open
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu) {
        navMenu.classList.remove('active');
      }

      // Scroll to section
      const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Sign in button handler
function handleSignIn() {
  alert('Sign In functionality - Redirect to login page in production');
  // In production: window.location.href = '/login.html';
}

// Contact Sales handler
function handleContactSales() {
  alert('Contact Sales - Open contact form in production');
  // In production: window.location.href = 'mailto:sales@freightflow.in';
}

// Get Started button handler
function handleGetStarted() {
  window.location.href = 'booking.html';
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.classList.remove('active');
    }
  });
});
