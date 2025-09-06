// Demo Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const watchDemoBtn = document.getElementById('watch-demo-btn');
    const demoBackdrop = document.getElementById('demo-backdrop');
    const demoContent = document.getElementById('demo-content');
    const closeModalBtn = document.getElementById('close-demo');
    const demoTabs = document.querySelectorAll('.demo-tab');
    const demoSections = document.querySelectorAll('.demo-section');
    const scheduleConsultationBtn = document.getElementById('schedule-consultation');
    const getQuoteBtn = document.getElementById('get-quote');

    // Animate progress bars in business strategy section
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width || bar.getAttribute('data-width') || '0%';
            bar.style.width = '0%';
            bar.style.transition = 'width 1.5s ease-in-out';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }

    // Open modal
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Watch Demo button clicked'); // Debug log
            if (demoBackdrop) {
                document.body.classList.add('demo-modal-show');
                demoContent.classList.add('modal-slide-in');
                demoContent.classList.remove('modal-slide-out');
                console.log('Modal should be showing'); // Debug log
            } else {
                console.error('Modal backdrop not found');
            }
        });
    } else {
        console.error('Watch Demo button not found');
    }

    // Close modal function
    function closeModal() {
        demoContent.classList.add('modal-slide-out');
        demoContent.classList.remove('modal-slide-in');
        
        setTimeout(() => {
            document.body.classList.remove('demo-modal-show');
        }, 200);
    }

    // Close modal events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (demoBackdrop) {
        demoBackdrop.addEventListener('click', function(e) {
            if (e.target === demoBackdrop) {
                closeModal();
            }
        });
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('demo-modal-show')) {
            closeModal();
        }
    });

    // Tab switching functionality
    demoTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            console.log('Tab clicked:', tab.getAttribute('data-target')); // Debug log
            
            // Remove active class from all tabs
            demoTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all sections
            demoSections.forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show corresponding section based on data-target
            const targetName = tab.getAttribute('data-target');
            const targetSection = document.getElementById(targetName + '-section');
            if (targetSection) {
                targetSection.classList.remove('hidden');
            } else {
                // Fallback to index-based selection
                const fallbackSection = demoSections[index];
                if (fallbackSection) {
                    fallbackSection.classList.remove('hidden');
                }
            }
            
            // Animate progress bars if overview tab is selected
            if (targetName === 'overview') {
                setTimeout(animateProgressBars, 300);
            }
        });
    });

    // Consultation and Quote button handlers
    if (scheduleConsultationBtn) {
        scheduleConsultationBtn.addEventListener('click', function() {
            // Close modal first
            closeModal();
            
            // Scroll to contact section
            setTimeout(() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Focus on the first form field if it exists
                    setTimeout(() => {
                        const firstInput = contactSection.querySelector('input, textarea');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }, 500);
                }
            }, 300);
        });
    }

    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            // Close modal first
            closeModal();
            
            // Scroll to services section
            setTimeout(() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    servicesSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300);
        });
    }

    // Progressive enhancement for demo mockups
    const demoMockups = document.querySelectorAll('.demo-mockup');
    demoMockups.forEach(mockup => {
        mockup.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        mockup.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add interactive features to the modal
    const featureItems = document.querySelectorAll('.demo-section ul li');
    featureItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(59, 130, 246, 0.1)';
            this.style.borderRadius = '8px';
            this.style.padding = '8px 12px';
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.padding = '4px 0';
            this.style.transform = 'translateX(0)';
        });
    });

    // Run progress bar animation when business strategy tab is clicked
    const businessTab = document.querySelector('.demo-tab[data-target="business"]');
    if (businessTab) {
        businessTab.addEventListener('click', function() {
            setTimeout(animateProgressBars, 300);
        });
    }

    // Initialize first tab as active on page load
    if (demoTabs.length > 0 && demoSections.length > 0) {
        demoTabs[0].classList.add('active');
        demoSections.forEach((section, index) => {
            if (index === 0) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
});

// Additional utility functions for enhanced modal experience
function createSparkleEffect(element) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-effect';
    sparkle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #fbbf24, transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: sparkle 1s ease-out forwards;
    `;
    
    const rect = element.getBoundingClientRect();
    sparkle.style.left = Math.random() * rect.width + 'px';
    sparkle.style.top = Math.random() * rect.height + 'px';
    
    element.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1000);
}

// Add sparkle animation CSS
const sparkleCSS = `
@keyframes sparkle {
    0% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
    }
    50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
    }
    100% {
        opacity: 0;
        transform: scale(0) rotate(360deg);
    }
}
`;

// Inject sparkle CSS
const style = document.createElement('style');
style.textContent = sparkleCSS;
document.head.appendChild(style);
