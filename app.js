/**
 * Main Application Script for Maximus Consultancy Services
 * Handles Supabase integration, authentication, and real-time features
 */

// Initialize the application
class MaximusApp {
    constructor() {
        this.supabase = null;
        this.maximusAPI = null;
        this.currentUser = null;
        this.isAuthenticated = false;
        
        this.init();
    }

    async init() {
        try {
            // Wait for Supabase to be loaded
            await this.waitForSupabase();
            
            // Initialize Supabase client
            this.supabase = window.supabaseClient;
            
            // Initialize API service
            this.maximusAPI = new MaximusAPI();
            
            // Check authentication status
            await this.checkAuthStatus();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Initialize real-time features
            this.initRealTimeFeatures();
            
            console.log('✅ Maximus App initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Maximus App:', error);
            this.showNotification('Failed to initialize application', 'error');
        }
    }

    async waitForSupabase() {
        return new Promise((resolve) => {
            const checkSupabase = () => {
                if (window.supabaseClient && window.MaximusAPI) {
                    resolve();
                } else {
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
        });
    }

    async checkAuthStatus() {
        try {
            const { data: { user } } = await this.supabase.auth.getUser();
            
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                await this.loadUserData();
                this.updateUIForAuthenticatedUser();
            } else {
                this.updateUIForGuestUser();
            }
            
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    async loadUserData() {
        if (!this.currentUser) return;

        try {
            // Load user profile
            const profileResult = await this.maximusAPI.getUserProfile();
            if (profileResult.success) {
                this.userProfile = profileResult.data;
                this.updateProfileUI();
            }

            // Load user orders
            const ordersResult = await this.maximusAPI.getUserOrders();
            if (ordersResult.success) {
                this.userOrders = ordersResult.data;
                this.updateOrderHistoryUI();
            }

            // Load user payments
            const paymentsResult = await this.maximusAPI.getUserPayments();
            if (paymentsResult.success) {
                this.userPayments = paymentsResult.data;
                this.updatePaymentSummaryUI();
            }

        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    initEventListeners() {
        // Authentication listeners
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.loadUserData();
                this.updateUIForAuthenticatedUser();
                this.showNotification('Welcome back!', 'success');
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.updateUIForGuestUser();
                this.showNotification('Signed out successfully', 'info');
            }
        });

        // Contact form submission
        const contactForm = document.querySelector('#contact form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmission.bind(this));
        }

        // Newsletter subscription
        const newsletterForm = document.querySelector('footer input[type="email"]');
        if (newsletterForm) {
            const subscribeBtn = newsletterForm.nextElementSibling;
            subscribeBtn.addEventListener('click', this.handleNewsletterSubscription.bind(this));
        }

        // Profile editing
        const editProfileButtons = Array.from(document.querySelectorAll('button')).filter(btn => btn.textContent.includes('Edit Profile'));
        editProfileButtons.forEach(btn => {
            btn.addEventListener('click', this.handleEditProfile.bind(this));
        });

        // Auth modal triggers (if you add auth modals)
        this.initAuthModals();
    }

    async handleContactSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        const contactData = {
            first_name: formData.get('firstName') || form.querySelector('input[placeholder="John"]').value,
            last_name: formData.get('lastName') || form.querySelector('input[placeholder="Doe"]').value,
            email: formData.get('email') || form.querySelector('input[type="email"]').value,
            company: formData.get('company') || form.querySelector('input[placeholder="Your Company"]').value,
            message: formData.get('message') || form.querySelector('textarea').value
        };

        // Validate required fields
        if (!contactData.first_name || !contactData.email || !contactData.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
        `;
        submitBtn.disabled = true;

        try {
            const result = await this.maximusAPI.submitContactForm(contactData);
            
            if (result.success) {
                submitBtn.innerHTML = '✓ Message Sent!';
                submitBtn.classList.add('bg-green-500');
                form.reset();
                this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Error submitting contact form:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-green-500');
            }, 2000);
        }
    }

    async handleNewsletterSubscription() {
        const emailInput = document.querySelector('footer input[type="email"]');
        const subscribeBtn = emailInput.nextElementSibling;
        const email = emailInput.value.trim();

        if (!email || !this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        const originalText = subscribeBtn.innerHTML;
        subscribeBtn.innerHTML = `
            <svg class="animate-spin w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Subscribing...
        `;
        subscribeBtn.disabled = true;

        try {
            const result = await this.maximusAPI.subscribeNewsletter({ email });
            
            if (result.success) {
                emailInput.value = '';
                subscribeBtn.innerHTML = '✓ Subscribed!';
                subscribeBtn.classList.add('bg-green-500');
                this.showNotification('Successfully subscribed to our newsletter!', 'success');
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            this.showNotification('Failed to subscribe. Please try again.', 'error');
        } finally {
            setTimeout(() => {
                subscribeBtn.innerHTML = originalText;
                subscribeBtn.disabled = false;
                subscribeBtn.classList.remove('bg-green-500');
            }, 2000);
        }
    }

    initRealTimeFeatures() {
        if (!this.isAuthenticated) return;

        // Subscribe to order updates
        this.supabase
            .channel('orders')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `user_id=eq.${this.currentUser.id}`
            }, (payload) => {
                console.log('Order updated:', payload);
                this.handleOrderUpdate(payload.new);
            })
            .subscribe();

        // Subscribe to payment updates
        this.supabase
            .channel('payments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'payments',
                filter: `user_id=eq.${this.currentUser.id}`
            }, (payload) => {
                console.log('New payment:', payload);
                this.handleNewPayment(payload.new);
            })
            .subscribe();

        // Subscribe to notifications
        this.supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${this.currentUser.id}`
            }, (payload) => {
                console.log('New notification:', payload);
                this.handleNewNotification(payload.new);
            })
            .subscribe();
    }

    handleOrderUpdate(order) {
        // Update the order in the UI
        this.showNotification(`Order ${order.order_number} has been updated`, 'info');
        
        // Refresh order data
        this.loadUserData();
    }

    handleNewPayment(payment) {
        this.showNotification(`Payment of $${payment.amount} has been processed`, 'success');
        
        // Refresh payment data
        this.loadUserData();
    }

    handleNewNotification(notification) {
        this.showNotification(notification.message, notification.type || 'info');
        
        // Update notification count if you have one
        this.updateNotificationCount();
    }

    updateUIForAuthenticatedUser() {
        // Show authenticated user elements
        const authElements = document.querySelectorAll('[data-auth="true"]');
        authElements.forEach(el => el.style.display = 'block');
        
        // Hide guest elements
        const guestElements = document.querySelectorAll('[data-auth="false"]');
        guestElements.forEach(el => el.style.display = 'none');
        
        // Update profile section visibility
        const profileSection = document.getElementById('profile-history');
        if (profileSection) {
            profileSection.style.display = 'block';
        }
    }

    updateUIForGuestUser() {
        // Hide authenticated user elements
        const authElements = document.querySelectorAll('[data-auth="true"]');
        authElements.forEach(el => el.style.display = 'none');
        
        // Show guest elements
        const guestElements = document.querySelectorAll('[data-auth="false"]');
        guestElements.forEach(el => el.style.display = 'block');
        
        // Hide profile section
        const profileSection = document.getElementById('profile-history');
        if (profileSection) {
            profileSection.style.display = 'none';
        }
    }

    updateProfileUI() {
        if (!this.userProfile) return;

        // Update profile name
        const profileName = document.querySelector('.profile-name');
        if (profileName) {
            profileName.textContent = `${this.userProfile.first_name} ${this.userProfile.last_name}`;
        }

        // Update profile info
        const profileInfo = document.querySelector('.profile-info');
        if (profileInfo) {
            profileInfo.innerHTML = `
                <div class="text-center mb-8">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span class="text-2xl font-bold text-white">
                            ${this.userProfile.first_name[0]}${this.userProfile.last_name[0]}
                        </span>
                    </div>
                    <h4 class="text-2xl font-bold text-gray-900 mb-2">
                        ${this.userProfile.first_name} ${this.userProfile.last_name}
                    </h4>
                    <p class="text-gray-600 mb-4">${this.userProfile.user_type || 'Premium Client'}</p>
                    <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Active Account
                    </div>
                </div>
            `;
        }
    }

    updateOrderHistoryUI() {
        if (!this.userOrders) return;

        const ordersList = document.querySelector('.orders-list');
        if (!ordersList) return;

        ordersList.innerHTML = '';

        this.userOrders.forEach((order, index) => {
            const orderElement = this.createOrderElement(order, index);
            ordersList.appendChild(orderElement);
        });
    }

    createOrderElement(order, index) {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover-lift';
        
        const statusColor = this.getStatusColor(order.status);
        const serviceIcon = this.getServiceIcon(order.service_id);
        
        orderDiv.innerHTML = `
            <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div class="flex items-center space-x-4 mb-4 lg:mb-0">
                    <div class="w-16 h-16 ${serviceIcon.bgColor} rounded-xl flex items-center justify-center">
                        ${serviceIcon.svg}
                    </div>
                    <div>
                        <h5 class="font-bold text-gray-900 text-lg">${order.services?.name || 'Service'}</h5>
                        <p class="text-gray-600">Order #${order.order_number} • ${this.formatDate(order.created_at)}</p>
                        <div class="flex items-center mt-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bgColor} ${statusColor.textColor}">
                                <div class="w-1.5 h-1.5 ${statusColor.dotColor} rounded-full mr-1"></div>
                                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span class="text-gray-400 ml-3">Duration: ${order.duration || '2-3 months'}</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-gray-900 mb-2">$${order.total_amount}</div>
                    <button class="download-pdf bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300" 
                            data-order-id="${order.id}" data-order-number="${order.order_number}">
                        <svg class="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2v13l4-4m-4 4l-4-4m4 4v0M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H7l-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        Download Report
                    </button>
                </div>
            </div>
            <div class="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div class="text-center p-3 bg-blue-50 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">Payment Status</div>
                    <div class="font-semibold ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}">
                        ${order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </div>
                </div>
                <div class="text-center p-3 bg-purple-50 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">Project Manager</div>
                    <div class="font-semibold text-gray-900">${order.team_members?.name || 'Assigned Manager'}</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-lg">
                    <div class="text-sm text-gray-600 mb-1">Progress</div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-green-500 h-2 rounded-full" style="width: ${this.getProgressPercentage(order.status)}%"></div>
                    </div>
                    <div class="text-sm font-semibold text-green-600 mt-1">${this.getProgressPercentage(order.status)}%</div>
                </div>
            </div>
        `;

        // Add event listener for download button
        const downloadBtn = orderDiv.querySelector('.download-pdf');
        downloadBtn.addEventListener('click', () => this.downloadOrderReport(order));

        return orderDiv;
    }

    updatePaymentSummaryUI() {
        if (!this.userPayments) return;

        const totalSpent = this.userPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        const paidInvoices = this.userPayments.filter(p => p.status === 'completed').length;
        const pendingPayments = this.userPayments.filter(p => p.status === 'pending').length;

        // Update payment summary cards
        const totalSpentEl = document.querySelector('.total-spent');
        if (totalSpentEl) totalSpentEl.textContent = `$${totalSpent.toLocaleString()}`;

        const paidInvoicesEl = document.querySelector('.paid-invoices');
        if (paidInvoicesEl) paidInvoicesEl.textContent = paidInvoices;

        const pendingEl = document.querySelector('.pending-payments');
        if (pendingEl) pendingEl.textContent = pendingPayments;
    }

    async downloadOrderReport(order) {
        try {
            const result = await this.maximusAPI.generateOrderReport(order.id);
            
            if (result.success) {
                // Create and trigger download
                const blob = new Blob([result.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${order.order_number}_Report.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                this.showNotification('Report downloaded successfully', 'success');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error downloading report:', error);
            this.showNotification('Failed to download report', 'error');
        }
    }

    // Utility methods
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getStatusColor(status) {
        const colors = {
            'pending': { bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', dotColor: 'bg-yellow-500' },
            'in_progress': { bgColor: 'bg-blue-100', textColor: 'text-blue-800', dotColor: 'bg-blue-500' },
            'completed': { bgColor: 'bg-green-100', textColor: 'text-green-800', dotColor: 'bg-green-500' },
            'cancelled': { bgColor: 'bg-red-100', textColor: 'text-red-800', dotColor: 'bg-red-500' }
        };
        return colors[status] || colors['pending'];
    }

    getServiceIcon(serviceId) {
        // This would normally come from your services data
        const icons = {
            1: {
                bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
                svg: '<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>'
            },
            2: {
                bgColor: 'bg-gradient-to-br from-green-500 to-teal-600',
                svg: '<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>'
            }
        };
        return icons[serviceId] || icons[1];
    }

    getProgressPercentage(status) {
        const percentages = {
            'pending': 10,
            'in_progress': 60,
            'completed': 100,
            'cancelled': 0
        };
        return percentages[status] || 0;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const colors = {
            'success': 'bg-green-500',
            'error': 'bg-red-500',
            'info': 'bg-blue-500',
            'warning': 'bg-yellow-500'
        };

        notification.className = `
            fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full
            ${colors[type]} text-white max-w-sm
        `;

        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'info' ? 'ℹ' : '⚠';

        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span class="font-bold">${icon}</span>
                <span>${message}</span>
                <button class="ml-2 font-bold hover:opacity-75" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('translate-x-full');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    initAuthModals() {
        // This is where you'd initialize login/register modals
        // For now, we'll just add basic auth functionality to existing buttons
        
        const loginButtons = Array.from(document.querySelectorAll('button, a')).filter(el => el.textContent.includes('Sign In'));
        const registerButtons = Array.from(document.querySelectorAll('button, a')).filter(el => el.textContent.includes('Sign Up'));

        // Add simple authentication for demo purposes
        // In a real app, you'd have proper modals/forms for this
    }

    updateNotificationCount() {
        // Update notification badge if you have one
        // This would count unread notifications
    }

    async handleEditProfile() {
        // This would open a profile editing modal or navigate to a profile page
        this.showNotification('Profile editing feature would be implemented here', 'info');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for all scripts to load
    setTimeout(() => {
        window.maximusApp = new MaximusApp();
    }, 1000);
});

// Export for global access
window.MaximusApp = MaximusApp;
