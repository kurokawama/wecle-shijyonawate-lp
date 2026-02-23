/**
 * WECLE 四條畷店 LP - Main JavaScript
 * Features: FAQ accordion, sticky header, mobile CTA, smooth scroll,
 *           hamburger menu, GTM events, scroll depth tracking
 */

(function () {
  'use strict';

  // --- Error Handler Wrapper ---
  function safeExecute(fn, context) {
    return function () {
      try {
        return fn.apply(context || this, arguments);
      } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
          console.error('WECLE LP Error:', error);
        }
      }
    };
  }

  // --- Feature Detection ---
  var supportsPassive = false;
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
        return true;
      },
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {
    supportsPassive = false;
  }

  var passiveOption = supportsPassive ? { passive: true } : false;

  // --- DOM References ---
  function getElements() {
    return {
      header: document.getElementById('header'),
      hamburgerBtn: document.getElementById('hamburger-btn'),
      headerNav: document.getElementById('header-nav'),
      mobileCta: document.getElementById('mobile-cta'),
      heroSection: document.getElementById('hero'),
      footerSection: document.getElementById('footer'),
      faqButtons: document.querySelectorAll('.faq__question'),
      mainContent: document.getElementById('main-content'),
    };
  }

  var elements = null;

  // --- GTM Helper ---
  function pushGTMEvent(eventName, params) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    } catch (error) {
      if (typeof console !== 'undefined' && console.error) {
        console.error('GTM push error:', error);
      }
    }
  }

  // --- Check Reduced Motion Preference ---
  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  // --- Sticky Header ---
  var handleStickyHeader = safeExecute(function () {
    if (!elements || !elements.header) return;

    var scrollY = window.scrollY || window.pageYOffset || 0;
    var threshold = 50;

    if (scrollY > threshold) {
      elements.header.classList.add('header--scrolled');
    } else {
      elements.header.classList.remove('header--scrolled');
    }
  });

  // --- Mobile Fixed CTA ---
  var handleMobileCta = safeExecute(function () {
    if (!elements || !elements.mobileCta || !elements.heroSection) return;

    var scrollY = window.scrollY || window.pageYOffset || 0;
    var heroBottom =
      elements.heroSection.offsetTop + elements.heroSection.offsetHeight;
    var windowHeight = window.innerHeight;
    var documentHeight = document.documentElement.scrollHeight;
    var footerTop = elements.footerSection
      ? elements.footerSection.offsetTop
      : documentHeight;

    var isPastHero = scrollY > heroBottom - 100;
    var isNearFooter = scrollY + windowHeight > footerTop - 50;

    if (isPastHero && !isNearFooter) {
      elements.mobileCta.classList.add('is-visible');
    } else {
      elements.mobileCta.classList.remove('is-visible');
    }
  });

  // --- FAQ Accordion ---
  var initFaqAccordion = safeExecute(function () {
    if (!elements || !elements.faqButtons || elements.faqButtons.length === 0)
      return;

    var faqButtonsArray = Array.prototype.slice.call(elements.faqButtons);

    faqButtonsArray.forEach(function (button, index) {
      button.addEventListener(
        'click',
        safeExecute(function () {
          var targetId = button.getAttribute('aria-controls');
          if (!targetId) return;

          var answer = document.getElementById(targetId);
          if (!answer) return;

          var isExpanded = button.getAttribute('aria-expanded') === 'true';

          button.setAttribute('aria-expanded', String(!isExpanded));

          if (isExpanded) {
            answer.hidden = true;
          } else {
            answer.hidden = false;

            var questionText = button.querySelector('.faq__q-text');
            if (questionText) {
              pushGTMEvent('faq_open', {
                faq_question: questionText.textContent.trim(),
                faq_index: index + 1,
              });
            }
          }
        })
      );

      button.addEventListener(
        'keydown',
        safeExecute(function (e) {
          var key = e.key || e.keyCode;
          var currentIndex = index;
          var nextButton = null;

          if (key === 'ArrowDown' || key === 40) {
            e.preventDefault();
            nextButton = faqButtonsArray[currentIndex + 1] || faqButtonsArray[0];
          } else if (key === 'ArrowUp' || key === 38) {
            e.preventDefault();
            nextButton =
              faqButtonsArray[currentIndex - 1] ||
              faqButtonsArray[faqButtonsArray.length - 1];
          } else if (key === 'Home' || key === 36) {
            e.preventDefault();
            nextButton = faqButtonsArray[0];
          } else if (key === 'End' || key === 35) {
            e.preventDefault();
            nextButton = faqButtonsArray[faqButtonsArray.length - 1];
          }

          if (nextButton) {
            nextButton.focus();
          }
        })
      );
    });
  });

  // --- Hamburger Menu ---
  var initHamburgerMenu = safeExecute(function () {
    if (!elements || !elements.hamburgerBtn || !elements.headerNav) return;

    var hamburgerBtn = elements.hamburgerBtn;
    var headerNav = elements.headerNav;
    var focusableElements = null;
    var firstFocusable = null;
    var lastFocusable = null;

    function updateFocusableElements() {
      focusableElements = headerNav.querySelectorAll(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        firstFocusable = focusableElements[0];
        lastFocusable = focusableElements[focusableElements.length - 1];
      }
    }

    function openMenu() {
      hamburgerBtn.classList.add('is-active');
      headerNav.classList.add('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      hamburgerBtn.setAttribute('aria-label', 'メニューを閉じる');
      document.body.style.overflow = 'hidden';
      updateFocusableElements();

      if (firstFocusable) {
        setTimeout(function () {
          firstFocusable.focus();
        }, 100);
      }
    }

    function closeMenu() {
      hamburgerBtn.classList.remove('is-active');
      headerNav.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
      hamburgerBtn.focus();
    }

    hamburgerBtn.addEventListener(
      'click',
      safeExecute(function () {
        var isActive = hamburgerBtn.classList.contains('is-active');
        if (isActive) {
          closeMenu();
        } else {
          openMenu();
        }
      })
    );

    document.addEventListener(
      'keydown',
      safeExecute(function (e) {
        if (!headerNav.classList.contains('is-open')) return;

        var key = e.key || e.keyCode;

        if (key === 'Escape' || key === 27) {
          closeMenu();
          return;
        }

        if (key === 'Tab' || key === 9) {
          if (!focusableElements || focusableElements.length === 0) return;

          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      })
    );

    var navLinks = headerNav.querySelectorAll('.header__nav-link');
    Array.prototype.slice.call(navLinks).forEach(function (link) {
      link.addEventListener(
        'click',
        safeExecute(function () {
          closeMenu();
        })
      );
    });
  });

  // --- Smooth Scroll ---
  var initSmoothScroll = safeExecute(function () {
    var anchors = document.querySelectorAll('a[href^="#"]');
    if (!anchors || anchors.length === 0) return;

    Array.prototype.slice.call(anchors).forEach(function (anchor) {
      anchor.addEventListener(
        'click',
        safeExecute(function (e) {
          var targetId = anchor.getAttribute('href');
          if (!targetId || targetId === '#') return;

          var targetElement = null;
          try {
            targetElement = document.querySelector(targetId);
          } catch (err) {
            return;
          }

          if (!targetElement) return;

          e.preventDefault();

          var headerHeight = elements && elements.header ? elements.header.offsetHeight : 0;
          var targetPosition =
            targetElement.getBoundingClientRect().top +
            (window.scrollY || window.pageYOffset) -
            headerHeight;

          if (prefersReducedMotion()) {
            window.scrollTo(0, targetPosition);
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
            });
          }

          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus({ preventScroll: true });
          targetElement.removeAttribute('tabindex');
        })
      );
    });
  });

  // --- GTM CTA Click Tracking ---
  var initCTATracking = safeExecute(function () {
    var ctaElements = document.querySelectorAll('[data-gtm]');
    if (!ctaElements || ctaElements.length === 0) return;

    Array.prototype.slice.call(ctaElements).forEach(function (element) {
      element.addEventListener(
        'click',
        safeExecute(function () {
          var eventName = element.getAttribute('data-gtm');
          if (!eventName) return;

          pushGTMEvent('cta_click', {
            cta_name: eventName,
            cta_text: element.textContent ? element.textContent.trim() : '',
            cta_url: element.getAttribute('href') || '',
          });
        })
      );
    });
  });

  // --- Scroll Depth Tracking ---
  var initScrollDepthTracking = safeExecute(function () {
    var depths = { 25: false, 50: false, 75: false, 100: false };

    var checkScrollDepth = safeExecute(function () {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      var documentHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;

      if (documentHeight <= windowHeight) return;

      var scrollPercentage = Math.round(
        ((scrollY + windowHeight) / documentHeight) * 100
      );

      [25, 50, 75, 100].forEach(function (depth) {
        if (scrollPercentage >= depth && !depths[depth]) {
          depths[depth] = true;
          pushGTMEvent('scroll_depth', {
            scroll_percentage: depth,
          });
        }
      });
    });

    window.addEventListener(
      'scroll',
      throttle(checkScrollDepth, 200),
      passiveOption
    );
  });

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

  // --- Debounce Utility ---
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  // --- Scroll Event Listener ---
  var initScrollListeners = safeExecute(function () {
    var onScroll = throttle(function () {
      handleStickyHeader();
      handleMobileCta();
    }, 100);

    window.addEventListener('scroll', onScroll, passiveOption);

    handleStickyHeader();
    handleMobileCta();
  });

  // --- Phone Tap Tracking ---
  var initPhoneTapTracking = safeExecute(function () {
    var phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    if (!phoneLinks || phoneLinks.length === 0) return;

    Array.prototype.slice.call(phoneLinks).forEach(function (link) {
      link.addEventListener(
        'click',
        safeExecute(function () {
          var phoneHref = link.getAttribute('href');
          pushGTMEvent('phone_tap', {
            phone_number: phoneHref ? phoneHref.replace('tel:', '') : '',
          });
        })
      );
    });
  });

  // --- Resize Handler for Mobile CTA ---
  var initResizeHandler = safeExecute(function () {
    var onResize = debounce(function () {
      handleMobileCta();
    }, 250);

    window.addEventListener('resize', onResize, passiveOption);
  });

  // --- Initialize ---
  function init() {
    try {
      elements = getElements();

      initScrollListeners();
      initFaqAccordion();
      initHamburgerMenu();
      initSmoothScroll();
      initCTATracking();
      initScrollDepthTracking();
      initPhoneTapTracking();
      initResizeHandler();
    } catch (error) {
      if (typeof console !== 'undefined' && console.error) {
        console.error('WECLE LP initialization error:', error);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
