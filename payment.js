/**
 * FREIGHTFLOW - PAYMENT & CHECKOUT LOGIC
 * Handles booking flow, payment methods, and confirmation
 */

(function() {
  'use strict';

  // ===== TRUCK DETAILS PAGE =====
  const proceedBookingBtn = document.getElementById('proceedBooking');
  
  if (proceedBookingBtn) {
    proceedBookingBtn.addEventListener('click', function() {
      window.location.href = 'checkout.html';
    });
  }

  // ===== CHECKOUT PAGE =====
  
  // Payment Tab Switching
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const paymentPanels = document.querySelectorAll('.payment-panel');

  paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const method = this.dataset.method;
      
      // Update active tab
      paymentTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Show corresponding panel
      paymentPanels.forEach(panel => {
        panel.classList.remove('active');
      });
      
      const targetPanel = document.getElementById(`${method}Panel`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // UPI Method Toggle
  const upiMethods = document.querySelectorAll('input[name="upiMethod"]');
  const upiIdInput = document.getElementById('upiIdInput');

  upiMethods.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'upi-id' && upiIdInput) {
        upiIdInput.style.display = 'flex';
      } else if (upiIdInput) {
        upiIdInput.style.display = 'none';
      }
    });
  });

  // Insurance Checkbox
  const insuranceCheckbox = document.getElementById('insurance');
  const insuranceLine = document.getElementById('insuranceLine');
  const totalAmountEl = document.getElementById('totalAmount');
  const confirmPaymentBtn = document.getElementById('confirmPayment');
  
  let baseTotal = 12500;
  const insuranceCost = 500;

  if (insuranceCheckbox && insuranceLine && totalAmountEl) {
    insuranceCheckbox.addEventListener('change', function() {
      if (this.checked) {
        insuranceLine.hidden = false;
        const newTotal = baseTotal + insuranceCost;
        totalAmountEl.textContent = `₹${newTotal.toLocaleString('en-IN')}`;
        if (confirmPaymentBtn) {
          confirmPaymentBtn.innerHTML = `
            <i data-feather="lock" aria-hidden="true"></i>
            <span>Pay ₹${newTotal.toLocaleString('en-IN')}</span>
          `;
          feather.replace();
        }
      } else {
        insuranceLine.hidden = true;
        totalAmountEl.textContent = `₹${baseTotal.toLocaleString('en-IN')}`;
        if (confirmPaymentBtn) {
          confirmPaymentBtn.innerHTML = `
            <i data-feather="lock" aria-hidden="true"></i>
            <span>Pay ₹${baseTotal.toLocaleString('en-IN')}</span>
          `;
          feather.replace();
        }
      }
    });
  }

  // Form Validation
  const loadDetailsForm = document.getElementById('loadDetailsForm');
  
  if (loadDetailsForm) {
    // Set minimum date to today
    const pickupDateInput = document.getElementById('pickupDate');
    if (pickupDateInput) {
      const today = new Date().toISOString().split('T')[0];
      pickupDateInput.min = today;
    }
  }

  // Payment Confirmation
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', handlePayment);
  }

  function handlePayment() {
    // Validate load details form
    if (loadDetailsForm && !loadDetailsForm.checkValidity()) {
      loadDetailsForm.reportValidity();
      return;
    }

    // Check terms acceptance
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      showNotification('Please accept the Terms & Conditions', 'error');
      termsCheckbox.focus();
      return;
    }

    // Get active payment method
    const activeTab = document.querySelector('.payment-tab.active');
    const paymentMethod = activeTab ? activeTab.dataset.method : 'upi';

    // Validate payment method
    if (paymentMethod === 'upi') {
      const selectedUpiMethod = document.querySelector('input[name="upiMethod"]:checked');
      if (selectedUpiMethod && selectedUpiMethod.value === 'upi-id') {
        const upiIdField = document.querySelector('#upiIdInput input');
        if (upiIdField && !upiIdField.value.trim()) {
          showNotification('Please enter your UPI ID', 'error');
          upiIdField.focus();
          return;
        }
      }
    } else if (paymentMethod === 'card') {
      const cardNumber = document.getElementById('cardNumber');
      if (cardNumber && !cardNumber.value.trim()) {
        showNotification('Please enter card details', 'error');
        cardNumber.focus();
        return;
      }
    }

    // Show loading state
    confirmPaymentBtn.disabled = true;
    confirmPaymentBtn.innerHTML = `
      <span>Processing...</span>
    `;

    // Simulate payment processing
    setTimeout(() => {
      processPayment(paymentMethod);
    }, 2000);
  }

  function processPayment(method) {
    // Generate booking ID
    const bookingId = generateBookingId();
    
    // Show success modal
    showSuccessModal(bookingId);
    
    // Reset button
    if (confirmPaymentBtn) {
      confirmPaymentBtn.disabled = false;
      confirmPaymentBtn.innerHTML = `
        <i data-feather="lock" aria-hidden="true"></i>
        <span>Pay ₹${baseTotal.toLocaleString('en-IN')}</span>
      `;
      feather.replace();
    }

    // Log booking details (in production, send to server)
    console.log('Booking Confirmed:', {
      bookingId,
      paymentMethod: method,
      amount: insuranceCheckbox && insuranceCheckbox.checked ? baseTotal + insuranceCost : baseTotal,
      timestamp: new Date().toISOString()
    });
  }

  function generateBookingId() {
    const prefix = 'FF';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Success Modal
  const successModal = document.getElementById('successModal');
  const trackBookingBtn = document.getElementById('trackBooking');
  const downloadInvoiceBtn = document.getElementById('downloadInvoice');

  function showSuccessModal(bookingId) {
    if (!successModal) return;

    const bookingIdEl = document.getElementById('bookingId');
    if (bookingIdEl) {
      bookingIdEl.textContent = bookingId;
    }

    successModal.hidden = false;
    document.body.style.overflow = 'hidden';
    feather.replace();
  }

  function hideSuccessModal() {
    if (!successModal) return;
    
    successModal.hidden = true;
    document.body.style.overflow = '';
  }

  if (trackBookingBtn) {
    trackBookingBtn.addEventListener('click', function() {
      hideSuccessModal();
      showNotification('Redirecting to tracking page...', 'info');
      setTimeout(() => {
        console.log('Navigate to tracking page');
        // window.location.href = 'tracking.html';
      }, 1000);
    });
  }

  if (downloadInvoiceBtn) {
    downloadInvoiceBtn.addEventListener('click', function() {
      showNotification('Invoice download started', 'success');
      console.log('Generate and download invoice');
      // In production, trigger PDF download
    });
  }

  // Close modal on overlay click
  if (successModal) {
    const overlay = successModal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', hideSuccessModal);
    }
  }

  // UPI App Selection
  const appButtons = document.querySelectorAll('.app-btn');
  
  appButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const appName = this.dataset.app;
      showNotification(`Opening ${appName.toUpperCase()}...`, 'info');
      
      // In production, trigger UPI intent
      console.log('UPI Intent:', appName);
      
      setTimeout(() => {
        showSuccessModal(generateBookingId());
      }, 2000);
    });
  });

  // Card Number Formatting
  const cardNumberInput = document.getElementById('cardNumber');
  
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\s/g, '');
      let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
      e.target.value = formattedValue;
    });
  }

  // Expiry Date Formatting
  const cardExpiryInput = document.getElementById('cardExpiry');
  
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      e.target.value = value;
    });
  }

  // Notification Helper
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

})();
