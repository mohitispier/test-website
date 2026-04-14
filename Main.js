// ============================================
// REDDRPULSE - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Form Validation
  const forms = document.querySelectorAll('.validate-form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let valid = true;
      const inputs = form.querySelectorAll('.form-input[required]');
      inputs.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      if (!valid) {
        e.preventDefault();
      }
    });
  });

  // Navbar Scroll Effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 100) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }
  });

  // Animated Counter
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-num[data-count]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '+';
        }
      };
      updateCounter();
    });
  };

  // Run counter animation when element is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Tab Switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(tab).classList.add('active');
    });
  });

  // Notification Toast
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#2d9d6a' : '#e55'};
      color: white;
      border-radius: 10px;
      font-weight: 500;
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // Copy to Clipboard
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
      });
    });
  });

  // Tooltip
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = el.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: absolute;
        background: #111;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 13px;
        white-space: nowrap;
        z-index: 1000;
        transform: translateY(-100%);
        margin-top: -8px;
      `;
      el.style.position = 'relative';
      el.appendChild(tooltip);
    });
    el.addEventListener('mouseleave', () => {
      const tooltip = el.querySelector('.tooltip');
      if (tooltip) tooltip.remove();
    });
  });

  // Chart Animation (Simple)
  const chartBars = document.querySelectorAll('.bar');
  chartBars.forEach((bar, index) => {
    bar.style.animation = `growBar 0.5s ease-out ${index * 0.1}s both`;
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes growBar {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
  `;
  document.head.appendChild(style);

  console.log('ReddrPulse - Scripts loaded successfully');
});
