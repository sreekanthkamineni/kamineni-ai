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
  const navContainer = document.getElementById('nav-menu');
  
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
            link.setAttribute('aria-current', 'location');
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

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    if (liveRegion) liveRegion.textContent = 'Submitting form. Please wait...';

    // Collect data parameters
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const endpoint = form.getAttribute('action') && form.getAttribute('action') !== '#'
      ? form.getAttribute('action')
      : 'https://formspree.io/f/mnqeogww';

    fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Re-enable and reset form parent layout
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        const formCardParent = form.parentElement;
        
        // Beautiful accessibility-focused success markup (no inline onclick)
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
            <button class="btn btn-secondary btn-reload" style="margin-top: 1rem; width: 100%;">Send Another Inquiry</button>
          </div>
        `;

        formCardParent.innerHTML = successMarkup;
        
        const successCard = document.getElementById('success-message-card');
        if (successCard) successCard.focus();

        const reloadBtn = formCardParent.querySelector('.btn-reload');
        if (reloadBtn) {
          reloadBtn.addEventListener('click', () => {
            window.location.reload();
          });
        }
        
        if (liveRegion) {
          liveRegion.textContent = 'Your message has been sent successfully. We will contact you soon.';
        }
      } else {
        throw new Error('Form backend error response');
      }
    })
    .catch(err => {
      console.error('Submission failed:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      if (liveRegion) {
        liveRegion.textContent = 'Failed to send message. Please try again or contact founders@kamineni-ai.com directly.';
      }
      alert('There was a problem submitting your inquiry. Please try again or contact founders@kamineni-ai.com directly.');
    });
  });
}
