/**
 * AllSEOMarketing.com - Main JavaScript
 * Handles navigation, animations, and interactive features
 */

(function() {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  const contactForm = document.getElementById('contactForm');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const teardownsGrid = document.getElementById('teardownsGrid');

  /**
   * Header scroll effect
   * Adds shadow to header when page is scrolled
   */
  function handleHeaderScroll() {
    if (!header) return;

    const scrollThreshold = 50;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Initial check
  }

  /**
   * Mobile navigation toggle
   */
  function handleMobileNav() {
    if (!navToggle || !navList) return;

    navToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      navToggle.setAttribute('aria-expanded',
        navList.classList.contains('active').toString()
      );
    });

    // Close nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav') && navList.classList.contains('active')) {
        navList.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close nav when pressing Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navList.classList.contains('active')) {
        navList.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Teardowns filter functionality
   */
  function handleTeardownsFilter() {
    if (!filterBtns.length || !teardownsGrid) return;

    const teardownCards = teardownsGrid.querySelectorAll('.teardown-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.dataset.filter;

        // Update active button
        filterBtns.forEach(b => {
          b.classList.remove('btn--primary');
          b.classList.add('btn--secondary');
        });
        this.classList.remove('btn--secondary');
        this.classList.add('btn--primary');

        // Filter cards
        teardownCards.forEach(card => {
          const category = card.dataset.category;

          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            // Trigger reflow for animation
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /**
   * Contact form handling
   */
  function handleContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      // Basic validation
      const requiredFields = ['firstName', 'lastName', 'email', 'website'];
      const missingFields = requiredFields.filter(field => !data[field]);

      if (missingFields.length > 0) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // URL validation
      try {
        new URL(data.website);
      } catch {
        showFormMessage('Please enter a valid website URL (including https://).', 'error');
        return;
      }

      // Simulate form submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="32"/>
        </svg>
        Submitting...
      `;

      // Simulate API call
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        showFormMessage('Thank you! Your submission has been received. We\'ll be in touch within 24-48 hours.', 'success');
        contactForm.reset();
      }, 1500);
    });
  }

  /**
   * Show form message
   */
  function showFormMessage(message, type) {
    // Remove existing message
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();

    // Create message element
    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message--${type}`;
    msgEl.style.cssText = `
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      ${type === 'success'
        ? 'background: rgba(16, 185, 129, 0.1); color: #059669; border: 1px solid rgba(16, 185, 129, 0.2);'
        : 'background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2);'
      }
    `;
    msgEl.textContent = message;

    // Insert before form
    contactForm.insertBefore(msgEl, contactForm.firstChild);

    // Auto-remove after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        msgEl.style.opacity = '0';
        msgEl.style.transition = 'opacity 0.3s ease';
        setTimeout(() => msgEl.remove(), 300);
      }, 5000);
    }
  }

  /**
   * Intersection Observer for scroll animations
   */
  function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .framework-card, .teardown-card');

    if (!animatedElements.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  /**
   * Add CSS animation keyframes
   */
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize all functionality
   */
  function init() {
    addAnimationStyles();
    handleHeaderScroll();
    handleMobileNav();
    handleSmoothScroll();
    handleTeardownsFilter();
    handleContactForm();
    handleScrollAnimations();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
