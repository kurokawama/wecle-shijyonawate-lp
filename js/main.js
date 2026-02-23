/**
 * WECLE 四條畷店 LP - Main JavaScript
 * Features: FAQ accordion, sticky header, mobile CTA, smooth scroll,
 *           hamburger menu, GTM events, scroll depth tracking
 */

(function () {
  'use strict';

  // --- DOM References ---
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const headerNav = document.getElementById('header-nav');
  const mobileCta = document.getElementById('mobile-cta');
  const heroSection = document.getElementById('hero');
  const footerSection = document.getElementById('footer');
  const faqButtons = document.querySelectorAll('.faq__question');

  // --- GTM Helper ---
  function pushGTMEvent(eventName, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }

  // --- Sticky Header ---
  function handleStickyHeader() {
    if (!header) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const threshold = 50;

    if (scrollY > threshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  // --- Mobile Fixed CTA ---
  function handleMobileCta() {
    if (!mobileCta || !heroSection) return;

    const scrollY = window.scrollY || window.pageYOffset;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const footerTop = footerSection ? footerSection.offsetTop : documentHeight;

    // Show after hero, hide near footer
    const isPastHero = scrollY > heroBottom - 100;
    const isNearFooter = scrollY + windowHeight > footerTop - 50;

    if (isPastHero && !isNearFooter) {
      mobileCta.classList.add('is-visible');
    } else {
      mobileCta.classList.remove('is-visible');
    }
  }

  // --- FAQ Accordion ---
  function initFaqAccordion() {
    faqButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const targetId = this.getAttribute('aria-controls');
        const answer = document.getElementById(targetId);
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Toggle current
        this.setAttribute('aria-expanded', !isExpanded);

        if (isExpanded) {
          answer.hidden = true;
        } else {
          answer.hidden = false;

          // GTM event
          const questionText = this.querySelector('.faq__q-text');
          if (questionText) {
            pushGTMEvent('faq_open', {
              faq_question: questionText.textContent.trim(),
            });
          }
        }
      });

      // Keyboard support (Enter and Space already handled by button element)
    });
  }

  // --- Hamburger Menu ---
  function initHamburgerMenu() {
    if (!hamburgerBtn || !headerNav) return;

    hamburgerBtn.addEventListener('click', function () {
      const isActive = this.classList.contains('is-active');

      this.classList.toggle('is-active');
      headerNav.classList.toggle('is-open');

      // Update ARIA
      this.setAttribute('aria-expanded', !isActive);
      this.setAttribute('aria-label', isActive ? 'メニューを開く' : 'メニューを閉じる');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? '' : 'hidden';
    });

    // Close menu when nav link is clicked
    const navLinks = headerNav.querySelectorAll('.header__nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburgerBtn.classList.remove('is-active');
        headerNav.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scroll ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }

  // --- GTM CTA Click Tracking ---
  function initCTATracking() {
    document.querySelectorAll('[data-gtm]').forEach(function (element) {
      element.addEventListener('click', function () {
        const eventName = this.getAttribute('data-gtm');
        pushGTMEvent('cta_click', {
          cta_name: eventName,
          cta_text: this.textContent.trim(),
          cta_url: this.getAttribute('href') || '',
        });
      });
    });
  }

  // --- Scroll Depth Tracking ---
  function initScrollDepthTracking() {
    var depths = { 25: false, 50: false, 75: false, 100: false };

    function checkScrollDepth() {
      var scrollY = window.scrollY || window.pageYOffset;
      var windowHeight = window.innerHeight;
      var documentHeight = document.documentElement.scrollHeight;
      var scrollPercentage = Math.round(((scrollY + windowHeight) / documentHeight) * 100);

      [25, 50, 75, 100].forEach(function (depth) {
        if (scrollPercentage >= depth && !depths[depth]) {
          depths[depth] = true;
          pushGTMEvent('scroll_depth', {
            scroll_percentage: depth,
          });
        }
      });
    }

    window.addEventListener('scroll', throttle(checkScrollDepth, 200), { passive: true });
  }

  // --- Throttle Utility ---
  function throttle(func, limit) {
    var lastFunc;
    var lastRan;
    return function () {
      var context = this;
      var args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }

  // --- Scroll Event Listener ---
  function initScrollListeners() {
    var onScroll = throttle(function () {
      handleStickyHeader();
      handleMobileCta();
    }, 100);

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    handleStickyHeader();
    handleMobileCta();
  }

  // --- Phone Tap Tracking ---
  function initPhoneTapTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        pushGTMEvent('phone_tap', {
          phone_number: this.getAttribute('href').replace('tel:', ''),
        });
      });
    });
  }

  // --- Initialize ---
  function init() {
    initScrollListeners();
    initFaqAccordion();
    initHamburgerMenu();
    initSmoothScroll();
    initCTATracking();
    initScrollDepthTracking();
    initPhoneTapTracking();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
