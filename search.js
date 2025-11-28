/**
 * FREIGHTFLOW - SEARCH & RESULTS
 * Handles truck search results and card interactions
 */

(function() {
  'use strict';

  // ===== ATTACH CLICK HANDLERS TO EXISTING CARDS =====
  function attachClickHandlersToCards() {
    console.log('Attaching click handlers to truck cards...');
    
    const cards = document.querySelectorAll('.truck-card');
    console.log('Found', cards.length, 'truck cards');

    cards.forEach((card, index) => {
      // Remove any existing listeners
      const newCard = card.cloneNode(true);
      card.parentNode.replaceChild(newCard, card);
      
      // Add click listener to the new card
      newCard.addEventListener('click', function(e) {
        console.log('Card clicked:', index);
        
        // Don't trigger if clicking the "Book Now" button
        if (e.target.closest('.btn-action')) {
          console.log('Book Now button clicked, not navigating');
          return;
        }

        // Get truck name from card
        const truckName = this.querySelector('.truck-name')?.textContent || 'Unknown Truck';
        const truckRating = this.querySelector('.truck-rating')?.textContent || '4.5';
        const truckPrice = this.querySelector('.truck-price-value')?.textContent || '₹12,500';

        // Store truck data
        const truckData = {
          id: `truck-${index}`,
          name: truckName,
          rating: truckRating,
          price: truckPrice,
          index: index
        };

        console.log('Navigating to truck details:', truckData);
        sessionStorage.setItem('selectedTruck', JSON.stringify(truckData));
        
        // Redirect
        window.location.href = 'truck-details.html';
      });

      // Add hover effect
      newCard.style.cursor = 'pointer';
      newCard.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      });

      newCard.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-md)';
      });

      console.log(`Card ${index} click handler attached`);
    });
  }

  // ===== INITIALIZE =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachClickHandlersToCards);
  } else {
    attachClickHandlersToCards();
  }

})();
