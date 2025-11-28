/**
 * FREIGHTFLOW - FILTERS & SORTING
 * Handles truck rendering, filtering, sorting, and navigation
 */

(function() {
  'use strict';

  // Mock truck data
  const allTrucks = [
    {
      id: 'truck-001',
      name: 'Tata 407',
      type: 'Open Body',
      capacity: '9 Tons',
      location: 'Mumbai',
      transporter: 'Rajesh Transport Co.',
      rating: 4.7,
      trips: 234,
      experience: '3 years',
      price: 12500,
      status: 'Available'
    },
    {
      id: 'truck-002',
      name: 'Eicher Pro 3015',
      type: 'Container',
      capacity: '16 Tons',
      location: 'Bangalore',
      transporter: 'Sharma Logistics',
      rating: 4.5,
      trips: 189,
      experience: '2 years',
      price: 15000,
      status: 'Available'
    },
    {
      id: 'truck-003',
      name: 'Ashok Leyland 2518',
      type: 'Trailer',
      capacity: '20 Tons',
      location: 'Hyderabad',
      transporter: 'Tech Transport Ltd',
      rating: 4.8,
      trips: 267,
      experience: '4 years',
      price: 18000,
      status: 'Available'
    },
    {
      id: 'truck-004',
      name: 'BharatBenz 1617',
      type: 'Tanker',
      capacity: '18 Tons (Liquid)',
      location: 'Delhi',
      transporter: 'Premium Transport Inc',
      rating: 4.9,
      trips: 312,
      experience: '5 years',
      price: 22000,
      status: 'Available'
    },
    {
      id: 'truck-005',
      name: 'Mahindra Furio 14',
      type: 'Open Body',
      capacity: '12 Tons',
      location: 'Ahmedabad',
      transporter: 'Gujarat Freight Co.',
      rating: 4.4,
      trips: 156,
      experience: '2.5 years',
      price: 14000,
      status: 'Available'
    },
    {
      id: 'truck-006',
      name: 'Tata LPT 1613',
      type: 'Container',
      capacity: '14 Tons',
      location: 'Pune',
      transporter: 'Express Logistics',
      rating: 4.6,
      trips: 201,
      experience: '3.5 years',
      price: 16000,
      status: 'Available'
    }
  ];

  let filteredTrucks = [...allTrucks];

  // ===== INITIALIZE =====
  function init() {
    console.log('Filters.js initializing...');
    setupPriceSlider();
    setupFilterForm();
    setupSortDropdown();
    renderTrucks();
  }

  // ===== PRICE RANGE SLIDER =====
  function setupPriceSlider() {
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceMinDisplay = document.getElementById('priceMinDisplay');
    const priceMaxDisplay = document.getElementById('priceMaxDisplay');

    if (!priceMin || !priceMax) {
      console.error('Price slider elements not found');
      return;
    }

    priceMin.addEventListener('input', function() {
      if (parseInt(this.value) > parseInt(priceMax.value)) {
        this.value = priceMax.value;
      }
      priceMinDisplay.textContent = '₹' + parseInt(this.value).toLocaleString('en-IN');
      applyFilters();
    });

    priceMax.addEventListener('input', function() {
      if (parseInt(this.value) < parseInt(priceMin.value)) {
        this.value = priceMin.value;
      }
      priceMaxDisplay.textContent = '₹' + parseInt(this.value).toLocaleString('en-IN');
      applyFilters();
    });

    console.log('Price slider initialized');
  }

  // ===== SETUP FILTER FORM =====
  function setupFilterForm() {
    const filtersForm = document.getElementById('filtersForm');

    if (!filtersForm) {
      console.error('Filters form not found');
      return;
    }

    filtersForm.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters();
    });

    filtersForm.addEventListener('reset', function() {
      setTimeout(() => {
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        const priceMinDisplay = document.getElementById('priceMinDisplay');
        const priceMaxDisplay = document.getElementById('priceMaxDisplay');

        priceMin.value = 5000;
        priceMax.value = 25000;
        priceMinDisplay.textContent = '₹5,000';
        priceMaxDisplay.textContent = '₹25,000';
        applyFilters();
      }, 0);
    });

    console.log('Filter form initialized');
  }

  // ===== SETUP SORT DROPDOWN =====
  function setupSortDropdown() {
    const sortBy = document.getElementById('sortBy');

    if (!sortBy) {
      console.error('Sort dropdown not found');
      return;
    }

    sortBy.addEventListener('change', function() {
      applySorting();
      renderTrucks();
    });

    console.log('Sort dropdown initialized');
  }

  // ===== APPLY FILTERS =====
  function applyFilters() {
    console.log('Applying filters...');

    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceMinVal = parseInt(priceMin?.value || 5000);
    const priceMaxVal = parseInt(priceMax?.value || 25000);

    const ratings = Array.from(document.querySelectorAll('input[name="rating"]:checked'))
      .map(el => parseInt(el.value));
    
    const availabilities = Array.from(document.querySelectorAll('input[name="availability"]:checked'))
      .map(el => el.value);

    filteredTrucks = allTrucks.filter(truck => {
      // Price filter
      if (truck.price < priceMinVal || truck.price > priceMaxVal) {
        return false;
      }

      // Rating filter (only if checked)
      if (ratings.length > 0) {
        const matchesRating = ratings.some(rating => truck.rating >= rating);
        if (!matchesRating) return false;
      }

      // Availability filter (only if checked)
      if (availabilities.length > 0) {
        const status = truck.status === 'Available' ? 'available' : 'scheduled';
        if (!availabilities.includes(status)) return false;
      }

      return true;
    });

    console.log('Filtered trucks count:', filteredTrucks.length);
    applySorting();
    renderTrucks();
  }

  // ===== APPLY SORTING =====
  function applySorting() {
    const sortBy = document.getElementById('sortBy');
    const sortValue = sortBy?.value || 'recommended';

    console.log('Sorting by:', sortValue);

    switch(sortValue) {
      case 'price-low':
        filteredTrucks.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredTrucks.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredTrucks.sort((a, b) => b.rating - a.rating);
        break;
      case 'availability':
        filteredTrucks.sort((a, b) => {
          if (a.status === b.status) return 0;
          return a.status === 'Available' ? -1 : 1;
        });
        break;
      default:
        // Recommended - sort by rating
        filteredTrucks.sort((a, b) => b.rating - a.rating);
    }
  }

  // ===== RENDER TRUCKS =====
  function renderTrucks() {
    console.log('Rendering trucks...');
    const grid = document.getElementById('resultsGrid');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');

    if (!grid) {
      console.error('Results grid not found!');
      return;
    }

    // Update result count
    if (resultCount) {
      resultCount.textContent = filteredTrucks.length;
    }

    // Clear grid
    grid.innerHTML = '';

    // Show/hide no results message
    if (filteredTrucks.length === 0) {
      if (noResults) noResults.hidden = false;
      console.log('No trucks found - showing no results message');
      return;
    }

    if (noResults) noResults.hidden = true;

    // Render truck cards
    filteredTrucks.forEach((truck, index) => {
      const card = createTruckCard(truck, index);
      grid.appendChild(card);
    });

    // Re-initialize feather icons
    if (typeof feather !== 'undefined') {
      feather.replace();
    }

    console.log('Rendered', filteredTrucks.length, 'trucks');
  }

  // ===== CREATE TRUCK CARD =====
  function createTruckCard(truck, index) {
    const card = document.createElement('article');
    card.className = 'truck-card';
    card.dataset.truckId = truck.id;
    card.dataset.truckIndex = index;
    card.style.cursor = 'pointer';

    card.innerHTML = `
      <div class="truck-card-image">
        <div class="truck-placeholder">🚚</div>
        <div class="truck-status-badge ${truck.status === 'Available' ? 'available' : 'scheduled'}">
          ${truck.status}
        </div>
      </div>

      <div class="truck-card-content">
        <div class="truck-header">
          <h3 class="truck-name">${truck.name}</h3>
          <div class="truck-rating">
            <span class="stars">★ ${truck.rating}</span>
          </div>
        </div>

        <div class="truck-specs">
          <div class="spec">
            <i data-feather="package" aria-hidden="true"></i>
            <span>${truck.capacity}</span>
          </div>
          <div class="spec">
            <i data-feather="box" aria-hidden="true"></i>
            <span>${truck.type}</span>
          </div>
          <div class="spec">
            <i data-feather="map-pin" aria-hidden="true"></i>
            <span>${truck.location}</span>
          </div>
        </div>

        <div class="truck-transporter">
          <strong>${truck.transporter}</strong>
          <p>${truck.trips} trips • ${truck.experience} exp</p>
        </div>

        <div class="truck-footer">
          <div class="truck-price">
            <span class="price-label">From</span>
            <span class="price-value truck-price-value">₹${truck.price.toLocaleString('en-IN')}</span>
          </div>
          <button class="btn btn-primary btn-sm btn-action" type="button">
            Book Now
          </button>
        </div>
      </div>
    `;

    // ===== CARD CLICK HANDLER (card itself) =====
    card.addEventListener('click', function(e) {
      // If clicking on "Book Now" button, redirect to truck details
      if (e.target.closest('.btn-action')) {
        console.log('Book Now button clicked for truck:', truck.name);
        navigateToTruckDetails(truck);
        return;
      }

      // If clicking anywhere else on card, also redirect
      console.log('Card clicked for truck:', truck.name);
      navigateToTruckDetails(truck);
    });

    // ===== HOVER EFFECTS =====
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'var(--shadow-md)';
    });

    return card;
  }

  // ===== NAVIGATE TO TRUCK DETAILS =====
  function navigateToTruckDetails(truck) {
    console.log('Navigating to truck-details.html for:', truck.name);

    const truckData = {
      id: truck.id,
      name: truck.name,
      rating: truck.rating,
      price: truck.price,
      type: truck.type,
      capacity: truck.capacity,
      transporter: truck.transporter,
      location: truck.location,
      status: truck.status
    };

    console.log('Storing truck data:', truckData);
    sessionStorage.setItem('selectedTruck', JSON.stringify(truckData));

    // Redirect after a small delay to ensure data is saved
    setTimeout(() => {
      window.location.href = 'truck-details.html';
    }, 100);
  }

  // ===== START ON PAGE LOAD =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose function globally for debugging
  window.debugFilters = function() {
    console.log('All trucks:', allTrucks);
    console.log('Filtered trucks:', filteredTrucks);
    console.log('Current filters:', {
      priceMin: document.getElementById('priceMin')?.value,
      priceMax: document.getElementById('priceMax')?.value,
      ratings: Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(el => el.value),
      availabilities: Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(el => el.value)
    });
  };

})();
