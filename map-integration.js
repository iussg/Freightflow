/**
 * FREIGHTFLOW - MAP INTEGRATION
 * MapmyIndia API integration for live tracking
 */

(function() {
  'use strict';

  // ===== MAP CONFIGURATION =====
  const MAP_CONFIG = {
    center: [19.0760, 72.8777], // Mumbai coordinates
    zoom: 12,
    apiKey: 'YOUR_MAPMYINDIA_API_KEY' // Replace with actual API key
  };

  // Mock vehicle location (in production, fetch from real-time API)
  let vehicleLocation = {
    lat: 19.0760,
    lng: 72.8777,
    heading: 45,
    speed: 65
  };

  let map;
  let vehicleMarker;
  let routePolyline;

  // ===== INITIALIZE MAP =====
  function initializeMap() {
    const mapContainer = document.getElementById('trackingMap');
    if (!mapContainer) return;

    // Fallback: Show placeholder if MapmyIndia SDK not loaded
    if (typeof L === 'undefined') {
      console.warn('MapmyIndia SDK not loaded. Using placeholder map.');
      showPlaceholderMap(mapContainer);
      return;
    }

    try {
      // Initialize MapmyIndia map
      map = L.map('trackingMap').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© MapmyIndia | © OpenStreetMap contributors'
      }).addTo(map);

      // Add vehicle marker
      addVehicleMarker();

      // Draw route
      drawRoute();

      // Start real-time updates
      startLocationUpdates();

    } catch (error) {
      console.error('Map initialization error:', error);
      showPlaceholderMap(mapContainer);
    }
  }

  // ===== ADD VEHICLE MARKER =====
  function addVehicleMarker() {
    const truckIcon = L.divIcon({
      className: 'truck-marker',
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #2E5EFF, #FF6B35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transform: rotate(${vehicleLocation.heading}deg);
        ">🚚</div>
      `,
      iconSize: [40, 40]
    });

    vehicleMarker = L.marker(
      [vehicleLocation.lat, vehicleLocation.lng],
      { icon: truckIcon }
    ).addTo(map);

    vehicleMarker.bindPopup(`
      <div style="text-align: center; font-family: Inter, sans-serif;">
        <strong>Tata 407</strong><br>
        <span style="font-size: 12px;">MH12AB1234</span><br>
        <span style="font-size: 12px; color: #10B981;">Speed: ${vehicleLocation.speed} km/h</span>
      </div>
    `).openPopup();
  }

  // ===== DRAW ROUTE =====
  function drawRoute() {
    // Mock route coordinates (Mumbai to Pune via NH48)
    const routeCoords = [
      [19.0760, 72.8777], // Mumbai
      [19.1136, 73.0000],
      [19.1500, 73.2000],
      [18.9000, 73.5000],
      [18.5204, 73.8567]  // Pune
    ];

    routePolyline = L.polyline(routeCoords, {
      color: '#2E5EFF',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 10'
    }).addTo(map);

    // Add pickup marker
    L.marker([19.0760, 72.8777], {
      icon: L.divIcon({
        className: 'location-marker',
        html: '<div style="width: 24px; height: 24px; background: #10B981; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>'
      })
    }).addTo(map).bindPopup('Pickup: Mumbai');

    // Add delivery marker
    L.marker([18.5204, 73.8567], {
      icon: L.divIcon({
        className: 'location-marker',
        html: '<div style="width: 24px; height: 24px; background: #EF4444; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>'
      })
    }).addTo(map).bindPopup('Delivery: Pune');

    // Fit bounds to show entire route
    map.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
  }

  // ===== REAL-TIME LOCATION UPDATES =====
  function startLocationUpdates() {
    setInterval(() => {
      // Simulate vehicle movement (in production, fetch from server)
      vehicleLocation.lat += 0.001;
      vehicleLocation.lng += 0.0015;
      vehicleLocation.speed = 60 + Math.random() * 20;

      // Update marker position
      if (vehicleMarker) {
        vehicleMarker.setLatLng([vehicleLocation.lat, vehicleLocation.lng]);
        vehicleMarker.getPopup().setContent(`
          <div style="text-align: center; font-family: Inter, sans-serif;">
            <strong>Tata 407</strong><br>
            <span style="font-size: 12px;">MH12AB1234</span><br>
            <span style="font-size: 12px; color: #10B981;">Speed: ${Math.round(vehicleLocation.speed)} km/h</span>
          </div>
        `);
      }

      // Update current location text
      const currentLocationEl = document.getElementById('currentLocation');
      if (currentLocationEl) {
        currentLocationEl.textContent = `Lat: ${vehicleLocation.lat.toFixed(4)}, Lng: ${vehicleLocation.lng.toFixed(4)}`;
      }

    }, 5000); // Update every 5 seconds
  }

  // ===== CENTER MAP ON VEHICLE =====
  window.centerMapOnVehicle = function() {
    if (map && vehicleMarker) {
      map.setView(vehicleMarker.getLatLng(), 14, { animate: true });
    }
  };

  // ===== PLACEHOLDER MAP =====
  function showPlaceholderMap(container) {
    container.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
        padding: 40px;
      ">
        <div style="font-size: 64px; margin-bottom: 20px;">🗺️</div>
        <h3 style="font-family: 'Space Grotesk', sans-serif; font-size: 24px; margin-bottom: 10px;">
          Live Tracking Map
        </h3>
        <p style="font-size: 14px; opacity: 0.9;">
          Vehicle Location: Mumbai, Maharashtra<br>
          Current Speed: 65 km/h<br>
          ETA to Pune: 2 hours 15 mins
        </p>
        <div style="
          margin-top: 20px;
          padding: 12px 24px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          font-size: 12px;
        ">
          📍 Real-time tracking active
        </div>
      </div>
    `;
  }

  // ===== INITIALIZE ON PAGE LOAD =====
  if (document.getElementById('trackingMap')) {
    // Wait for MapmyIndia SDK to load
    if (typeof L !== 'undefined') {
      initializeMap();
    } else {
      window.addEventListener('load', initializeMap);
    }
  }

})();
