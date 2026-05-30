/**
 * Kamineni Solutions - Core Client Logic
 * Light, native JavaScript for high-performance and accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollspy();
  initContactForm();
});

/**
 * Mobile Menu Toggle & Keyboard trapping
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navContainer = document.querySelector('.nav-links');
  
  if (!menuToggle || !navContainer) return;

  const toggleMenu = (show) => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    const shouldExpand = show !== undefined ? show : !isExpanded;
    
    menuToggle.setAttribute('aria-expanded', shouldExpand);
    navContainer.classList.toggle('nav-links--open', shouldExpand);
    document.body.classList.toggle('no-scroll', shouldExpand);
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when navigation links are clicked
  const navLinks = navContainer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navContainer.classList.contains('nav-links--open')) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });

  // Click outside to close mobile menu
  document.addEventListener('click', (e) => {
    if (navContainer.classList.contains('nav-links--open') && !navContainer.contains(e.target) && !menuToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/**
 * Scrollspy - Highlights active section in navigation header
 */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -50% 0px', // Center-screen triggers
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('nav-link--active');
            link.setAttribute('aria-current', 'page');
          } else {
            link.classList.remove('nav-link--active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Accessible Contact Form Handler
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  const liveRegion = document.getElementById('form-live-status');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Simple visual sending state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    if (liveRegion) liveRegion.textContent = 'Submitting form. Please wait...';

    // Mock API delay
    setTimeout(() => {
      // Re-enable and reset form
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      
      // Hide the form visual state and replace with a success layout card
      const formCardParent = form.parentElement;
      
      // Beautiful accessibility-focused success markup
      const successMarkup = `
        <div class="success-card" id="success-message-card" tabindex="-1">
          <div class="success-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Inquiry Received Successfully</h3>
          <p>Thank you for contacting Kamineni Solutions. Our founding team will review your project details and get back to you shortly at the email address provided.</p>
          <button class="btn btn-secondary" onclick="window.location.reload();" style="margin-top: 1rem; width: 100%;">Send Another Inquiry</button>
        </div>
      `;

      formCardParent.innerHTML = successMarkup;
      
      const successCard = document.getElementById('success-message-card');
      if (successCard) successCard.focus();
      
      if (liveRegion) {
        liveRegion.textContent = 'Your message has been sent successfully. We will contact you soon.';
      }
    }, 1200);
  });
}
