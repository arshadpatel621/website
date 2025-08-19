// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Initialize Particles.js
particlesJS('particles-js', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'repulse' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    }
  },
  retina_detect: true
});

// Initialize Typed.js for dynamic text
document.addEventListener('DOMContentLoaded', function() {
  // Check if Typed is available
  if (typeof Typed !== 'undefined') {
    new Typed('#typed-text', {
      strings: [
        'Your Business',
        'Your Dreams',
        'Your Success',
        'Your Future',
        'Your Growth'
      ],
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|',
      startDelay: 1000
    });
  } else {
    // Fallback if Typed.js doesn't load
    document.getElementById('typed-text').innerHTML = 'Your Dreams';
  }
});

// Animated Counters
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const inc = target / speed;

    if (count < target) {
      counter.innerText = Math.ceil(count + inc);
      setTimeout(() => animateCounters(), 1);
    } else {
      counter.innerText = target;
    }
  });
}

// Trigger counter animation when in view
const observerOptions = {
  threshold: 0.7
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe the stats section
document.addEventListener('DOMContentLoaded', function() {
  const statsSection = document.querySelector('#home');
  if (statsSection) {
    observer.observe(statsSection);
  }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
});

// Enhanced Navbar Background on Scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.classList.add('bg-white/95', 'backdrop-blur-md');
    nav.classList.remove('glass-effect');
  } else {
    nav.classList.remove('bg-white/95', 'backdrop-blur-md');
    nav.classList.add('glass-effect');
  }
});

// Book Consultation Button Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to all consultation booking buttons
  const consultationBtns = document.querySelectorAll('.book-consultation-btn');
  consultationBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Scroll to contact form
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Optional: Pre-fill the message field with consultation request
        setTimeout(() => {
          const messageField = document.getElementById('message');
          if (messageField && !messageField.value) {
            messageField.value = 'I would like to schedule a consultation to discuss my business needs.';
            messageField.focus();
          }
        }, 1000);
      }
    });
  });
});

// Enhanced Form Submission with Backend Integration
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        message: formData.get('message')
      };

      // Add loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...';
      submitBtn.disabled = true;

      try {
        // Send data to backend
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          // Success state
          submitBtn.innerHTML = '✓ Message Sent!';
          submitBtn.classList.remove('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
          submitBtn.classList.add('bg-green-500');
          
          // Show success notification
          showNotification(result.message, 'success');
          
          // Reset form after success
          setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.add('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
            submitBtn.classList.remove('bg-green-500');
          }, 3000);
        } else {
          // Error state
          submitBtn.innerHTML = '✗ Failed to Send';
          submitBtn.classList.remove('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
          submitBtn.classList.add('bg-red-500');
          
          // Show error notification
          showNotification(result.message, 'error');
          
          // Reset button after error
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.add('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
            submitBtn.classList.remove('bg-red-500');
          }, 3000);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        
        // Network error state
        submitBtn.innerHTML = '✗ Network Error';
        submitBtn.classList.remove('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
        submitBtn.classList.add('bg-red-500');
        
        // Show network error notification
        showNotification('Network error. Please check your connection and try again.', 'error');
        
        // Reset button after error
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.add('bg-gradient-to-r', 'from-yellow-400', 'to-orange-500');
          submitBtn.classList.remove('bg-red-500');
        }, 3000);
      }
    });
  }
});

// Enhanced Hover Effects
document.querySelectorAll('.hover-lift').forEach(element => {
  element.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px) scale(1.02)';
    this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  element.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.morphing-bg');
  if (parallax) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// Add loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');

  // Add stagger animation to elements
  const elements = document.querySelectorAll('[data-aos]');
  elements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
  });
});

// Add scroll progress indicator
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;

  // Create progress bar if it doesn't exist
  let progressBar = document.getElementById('scroll-progress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${scrolled}%;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      z-index: 9999;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
  } else {
    progressBar.style.width = scrolled + '%';
  }
});

// Add team member card interactions
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-15px) rotateY(5deg)';
    this.style.boxShadow = '25px 25px 80px #d9d9d9, -25px -25px 80px #ffffff';
  });

  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotateY(0deg)';
    this.style.boxShadow = '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff';
  });
});

// PDF Download Functionality
function generatePDF(data, type, filename) {
  // In a real application, this would make an API call to generate the PDF
  // For demo purposes, we'll create a simple text file
  const content = type === 'monthly' 
    ? `Monthly Report - ${data.month} ${data.year}\n\nOrder ID: ${data.order || 'All orders'}\nGenerated: ${new Date().toLocaleDateString()}\n\nThis is a sample PDF report for demonstration purposes.`
    : `Order Report\n\nOrder: ${data.order}\nMonth: ${data.month} ${data.year}\nGenerated: ${new Date().toLocaleDateString()}\n\nThis is a sample order report for demonstration purposes.`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Individual Order PDF Downloads
document.addEventListener('DOMContentLoaded', function() {
  const downloadButtons = document.querySelectorAll('.download-pdf');
  downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
      const month = this.getAttribute('data-month');
      const year = this.getAttribute('data-year');
      const order = this.getAttribute('data-order');
      
      // Add loading state
      const originalText = this.innerHTML;
      this.innerHTML = `
        <svg class="animate-spin w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
      `;
      this.disabled = true;
      
      setTimeout(() => {
        generatePDF(
          { month, year, order },
          'order',
          `${order}_Report_${month}_${year}.pdf`
        );
        
        this.innerHTML = '✓ Downloaded!';
        this.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
        this.classList.add('bg-green-500');
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
          this.classList.remove('bg-green-500');
        }, 2000);
      }, 1500);
    });
  });
});

// Monthly Report PDF Downloads
document.addEventListener('DOMContentLoaded', function() {
  const monthlyButtons = document.querySelectorAll('.download-monthly-pdf');
  monthlyButtons.forEach(button => {
    button.addEventListener('click', function() {
      const month = this.getAttribute('data-month');
      const year = this.getAttribute('data-year');
      
      // Add loading state
      const originalText = this.innerHTML;
      this.innerHTML = `
        <svg class="animate-spin w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating...
      `;
      this.disabled = true;
      
      setTimeout(() => {
        generatePDF(
          { month, year },
          'monthly',
          `Monthly_Report_${month}_${year}.pdf`
        );
        
        this.innerHTML = '✓ Downloaded!';
        this.classList.remove('bg-red-600', 'hover:bg-red-700');
        this.classList.add('bg-green-500');
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.classList.add('bg-red-600', 'hover:bg-red-700');
          this.classList.remove('bg-green-500');
        }, 2000);
      }, 1500);
    });
  });
});

// Download All Reports
document.addEventListener('DOMContentLoaded', function() {
  const downloadAllButton = document.querySelector('.download-all-pdf');
  if (downloadAllButton) {
    downloadAllButton.addEventListener('click', function() {
      // Add loading state
      const originalText = this.innerHTML;
      this.innerHTML = `
        <svg class="animate-spin w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating Archive...
      `;
      this.disabled = true;
      
      setTimeout(() => {
        // Generate multiple files in sequence
        const months = ['December', 'November', 'October'];
        const year = '2024';
        
        months.forEach((month, index) => {
          setTimeout(() => {
            generatePDF(
              { month, year },
              'monthly',
              `Monthly_Report_${month}_${year}.pdf`
            );
          }, index * 500);
        });
        
        this.innerHTML = '✓ All Downloaded!';
        this.classList.remove('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
        this.classList.add('bg-green-500');
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-purple-600');
          this.classList.remove('bg-green-500');
        }, 3000);
      }, 2000);
    });
  }
});

// Enhanced Order History Interactions
document.addEventListener('DOMContentLoaded', function() {
  // Add filter functionality (demo)
  const filterButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('Filter'));
  if (filterButtons.length > 0) {
    filterButtons[0].addEventListener('click', function() {
      // In a real application, this would open a filter modal
      alert('Filter functionality would be implemented here to filter orders by date, status, amount, etc.');
    });
  }
  
  // Add export functionality (demo)
  const exportButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('Export All'));
  if (exportButtons.length > 0) {
    exportButtons[0].addEventListener('click', function() {
      // Add loading state
      const originalText = this.innerHTML;
      this.innerHTML = `
        <svg class="w-4 h-4 inline mr-1 animate-spin" fill="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Exporting...
      `;
      this.disabled = true;
      
      setTimeout(() => {
        // Generate CSV export
        const csvContent = 'Order ID,Service,Date,Amount,Status,Project Manager\n' +
          'MSC-2024-001,Business Strategy Consultation,December 2024,$8500,Completed,Kenneth Jason\n' +
          'MSC-2024-002,Market Analysis & Research,November 2024,$6200,In Progress,Arshad Patel\n' +
          'MSC-2024-003,Website Development & SEO,October 2024,$9880,Completed,Hanok Alure';
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Order_History_Export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.innerHTML = '✓ Exported!';
        this.classList.remove('bg-green-100', 'text-green-600', 'hover:bg-green-200');
        this.classList.add('bg-green-500', 'text-white');
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          this.classList.add('bg-green-100', 'text-green-600', 'hover:bg-green-200');
          this.classList.remove('bg-green-500', 'text-white');
        }, 2000);
      }, 1500);
    });
  }
  
  // Add Load More functionality
  const loadMoreButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('Load More Orders'));
  if (loadMoreButtons.length > 0) {
    loadMoreButtons[0].addEventListener('click', function() {
      // In a real application, this would load more orders from the API
      this.innerHTML = `
        <svg class="w-5 h-5 inline mr-2 animate-spin" fill="currentColor" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading More Orders...
      `;
      this.disabled = true;
      
      setTimeout(() => {
        alert('In a real application, this would load more historical orders from your database.');
        this.innerHTML = 'Load More Orders';
        this.disabled = false;
      }, 2000);
    });
  }
});

// Add notification system for downloads
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `
    fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full
    ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
  `;
  notification.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

console.log('🚀 Maximus Consultancy Services - Enhanced Website with Profile & History Section Loaded Successfully!');
