/**
 * FREIGHTFLOW - ANIMATIONS & INTERACTIONS
 * Scroll animations, carousel, accordion, chatbot
 */

(function() {
  'use strict';

  // ===== SCROLL-TRIGGERED ANIMATIONS =====
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ===== TESTIMONIALS CAROUSEL =====
  const carousel = document.getElementById('testimonialsCarousel');
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const indicators = document.getElementById('carouselIndicators');

  if (carousel && track) {
    const slides = track.querySelectorAll('.testimonial-card');
    const slideCount = slides.length;
    let currentIndex = 0;

    // Create indicators
    if (indicators) {
      for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-indicator';
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        indicators.appendChild(dot);
      }
    }

    function goToSlide(index) {
      currentIndex = index;
      const offset = -100 * currentIndex;
      track.style.transform = `translateX(${offset}%)`;

      // Update indicators
      document.querySelectorAll('.carousel-indicator').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slideCount;
      goToSlide(currentIndex);
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slideCount) % slideCount;
      goToSlide(currentIndex);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play carousel
    let autoPlayInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });

    carousel.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });
  }

  // ===== FAQ ACCORDION =====
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(button => {
    button.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = document.getElementById(this.getAttribute('aria-controls'));

      // Close all other accordions (optional - remove for multi-open)
      faqQuestions.forEach(otherButton => {
        if (otherButton !== this) {
          otherButton.setAttribute('aria-expanded', 'false');
          const otherAnswer = document.getElementById(otherButton.getAttribute('aria-controls'));
          if (otherAnswer) {
            otherAnswer.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current accordion
      this.setAttribute('aria-expanded', !isExpanded);
      if (answer) {
        answer.setAttribute('aria-hidden', isExpanded);
      }
    });
  });

  // ===== FAQ CATEGORY FILTER =====
  const categoryButtons = document.querySelectorAll('.category-btn');
  const faqGroups = document.querySelectorAll('.faq-group');

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.category;

      // Update active button
      categoryButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter FAQ groups
      faqGroups.forEach(group => {
        if (category === 'all' || group.dataset.category === category) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // ===== FAQ SEARCH =====
  const faqSearch = document.getElementById('faqSearch');

  if (faqSearch) {
    faqSearch.addEventListener('input', function() {
      const query = this.value.toLowerCase();

      faqQuestions.forEach(button => {
        const text = button.textContent.toLowerCase();
        const item = button.closest('.faq-item');

        if (text.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // ===== CHATBOT WIDGET =====
  const chatbotBtn = document.getElementById('chatbotBtn');
  const chatbotWidget = document.getElementById('chatbotWidget');
  const chatbotClose = document.getElementById('chatbotClose');

  if (chatbotBtn && chatbotWidget) {
    chatbotBtn.addEventListener('click', function() {
      chatbotWidget.hidden = false;
    });
  }

  if (chatbotClose && chatbotWidget) {
    chatbotClose.addEventListener('click', function() {
      chatbotWidget.hidden = true;
    });
  }

  // ===== VIDEO PLACEHOLDER CLICK =====
  const videoPlaceholder = document.querySelector('.video-placeholder');

  if (videoPlaceholder) {
    videoPlaceholder.addEventListener('click', function() {
      alert('Video player would open here. In production, embed YouTube or Vimeo video.');
    });

    // Keyboard accessibility
    videoPlaceholder.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

})();
