/**
 * The Canvas - Interactive Features
 * Senior Frontend Developer Code Test
 */

(function () {
  'use strict';

  // ============================================
  // DOM Elements
  // ============================================

  const header = document.querySelector('.header');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const heroForm = document.getElementById('hero-form');
  const contactForm = document.getElementById('contact-form');
  const carouselTrack = document.querySelector('.carousel__track');
  const prevBtn = document.querySelector('.carousel-btn--prev');
  const nextBtn = document.querySelector('.carousel-btn--next');

  // ============================================
  // Mobile Navigation
  // ============================================

  function initMobileNav() {
    if (!hamburger || !nav) return;

    // Create mobile nav overlay if it doesn't exist
    let mobileNav = document.querySelector('.nav--mobile');
    if (!mobileNav) {
      mobileNav = document.createElement('div');
      mobileNav.className = 'nav nav--mobile';
      mobileNav.setAttribute('aria-label', 'Mobile navigation');
      mobileNav.innerHTML = `
        <ul class="nav__list" style="flex-direction: column; display: flex;">
          ${Array.from(navLinks)
            .map(
              (link) =>
                `<li><a href="${link.getAttribute('href')}" class="nav__link">${link.textContent}</a></li>`
            )
            .join('')}
        </ul>
      `;
      document.body.appendChild(mobileNav);

      // Close on link click (for anchor links)
      mobileNav.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileNav();
        });
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
      });

      // Close on click outside
      mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) closeMobileNav();
      });
    }

    function openMobileNav() {
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function toggleMobileNav() {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMobileNav() : openMobileNav();
    }

    hamburger.addEventListener('click', toggleMobileNav);
  }

  // ============================================
  // Header Scroll Effect
  // ============================================

  function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('scrolled', currentScroll > scrollThreshold);
      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // ============================================
  // Smooth Scroll for Anchor Links
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  // ============================================
  // Form Validation & Submission
  // ============================================

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateEmail(email) {
    return EMAIL_REGEX.test(email.trim());
  }

  function showFormError(input, message) {
    input.classList.add('error');
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFormError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');

    if (!emailInput) return;

    clearFormError(emailInput);

    const email = emailInput.value.trim();

    if (!email) {
      showFormError(emailInput, 'Please enter your email address.');
      emailInput.focus();
      return false;
    }

    if (!validateEmail(email)) {
      showFormError(emailInput, 'Please enter a valid email address.');
      emailInput.focus();
      return false;
    }

    // Simulate form submission (replace with actual API call)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Joining...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Joined! ✓';
      submitBtn.style.background = '#28a745';
      emailInput.value = '';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 2000);
    }, 800);

    return false;
  }

  function initForms() {
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => handleFormSubmit(e));
      heroForm.querySelector('input[type="email"]')?.addEventListener('input', function () {
        clearFormError(this);
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => handleFormSubmit(e));
      contactForm.querySelector('input[type="email"]')?.addEventListener('input', function () {
        clearFormError(this);
      });
    }
  }

  // ============================================
  // Testimonial Carousel
  // ============================================

  function initCarousel() {
    if (!carouselTrack || !prevBtn || !nextBtn) return;
  
    const cards = carouselTrack.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
  
    let currentIndex = 0;
  
    function updateCarousel() {
      // Dynamically calculate actual width + gap from CSS
      const cardWidth = cards[0].offsetWidth;
      const style = window.getComputedStyle(carouselTrack);
      const gap = parseFloat(style.gap) || 0;
      
      // Calculate precise offset
      const offset = -currentIndex * (cardWidth + gap);
      carouselTrack.style.transform = `translateX(${offset}px)`;
  
      // Calculate maximum index based on container visibility
      const containerWidth = carouselTrack.parentElement.offsetWidth;
      const visibleCards = Math.floor(containerWidth / cardWidth);
      const maxIndex = Math.max(0, cards.length - visibleCards);
  
      // Update button states
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }
  
    // Use the existing logic but ensure it triggers the update
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
  
    nextBtn.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth;
      const style = window.getComputedStyle(carouselTrack);
      const gap = parseFloat(style.gap) || 0;
      const containerWidth = carouselTrack.parentElement.offsetWidth;
      const visibleCards = Math.floor(containerWidth / cardWidth);
      const maxIndex = Math.max(0, cards.length - visibleCards);
  
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
      }
    });
  
    window.addEventListener('resize', updateCarousel);
    updateCarousel();
  }

  // ============================================
  // Scroll Animations
  // ============================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.partners, .problem, .solution, .process, .testimonials, .charity, .contact-cta, .partner-card, .process__step, .testimonial-card, .charity__card'
    );

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll', 'is-visible');
        }
      });
    }, observerOptions);

    animatedElements.forEach((el) => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  // ============================================
  // Image Lazy Loading Enhancement
  // ============================================

  function initImageLoading() {
    const images = document.querySelectorAll('img[src]');
    images.forEach((img) => {
      if (!img.loading && img.getAttribute('loading') !== 'lazy') {
        img.loading = 'lazy';
      }
    });
  }

  // ============================================
  // Initialize All
  // ============================================

  function init() {
    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initForms();
    initCarousel();
    initScrollAnimations();
    initImageLoading();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
