// API Services for Maximus Consultancy Services
// This file contains all the API calls to interact with the Supabase backend

class MaximusAPI {
    constructor() {
        this.supabase = window.supabaseClient;
        this.currentUser = null;
    }

    // ===============================
    // AUTHENTICATION SERVICES
    // ===============================

    async register(userData) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        phone: userData.phone,
                        company: userData.company
                    }
                }
            });

            if (error) throw error;

            // Also insert into our custom users table
            if (data.user) {
                const { error: insertError } = await this.supabase
                    .from('users')
                    .insert([{
                        user_id: data.user.id,
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        phone: userData.phone,
                        company: userData.company,
                        password_hash: 'handled_by_supabase_auth'
                    }]);

                if (insertError) console.error('Error inserting user data:', insertError);
            }

            return { success: true, data, message: 'Registration successful!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.currentUser = data.user;
            
            // Get user profile data
            const profile = await this.getUserProfile();
            
            return { 
                success: true, 
                data: { user: data.user, profile: profile.data }, 
                message: 'Login successful!' 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            return { success: true, message: 'Logged out successfully!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        const { data: { user } } = await this.supabase.auth.getUser();
        this.currentUser = user;
        return user;
    }

    // ===============================
    // USER PROFILE SERVICES
    // ===============================

    async getUserProfile() {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('No authenticated user');

            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateUserProfile(profileData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('No authenticated user');

            const { data, error } = await this.supabase
                .from('users')
                .update(profileData)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data, message: 'Profile updated successfully!' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // SERVICES
    // ===============================

    async getServices(category = null) {
        try {
            let query = this.supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('sort_order');

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getServiceById(serviceId) {
        try {
            const { data, error } = await this.supabase
                .from('services')
                .select('*')
                .eq('service_id', serviceId)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // TEAM MEMBERS
    // ===============================

    async getTeamMembers() {
        try {
            const { data, error } = await this.supabase
                .from('team_members')
                .select('*')
                .eq('is_active', true)
                .order('is_founder', { ascending: false })
                .order('years_experience', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // TESTIMONIALS
    // ===============================

    async getTestimonials() {
        try {
            const { data, error } = await this.supabase
                .from('testimonials')
                .select('*')
                .eq('is_featured', true)
                .eq('is_approved', true)
                .order('display_order');

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // COMPANY STATS
    // ===============================

    async getCompanyStats() {
        try {
            const { data, error } = await this.supabase
                .from('company_stats')
                .select('*')
                .eq('is_active', true)
                .order('display_order');

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // CONTACT & COMMUNICATION
    // ===============================

    async submitContactForm(contactData) {
        try {
            const { data, error } = await this.supabase
                .from('contact_messages')
                .insert([contactData])
                .select()
                .single();

            if (error) throw error;

            return { 
                success: true, 
                data, 
                message: 'Thank you for your message. We\'ll get back to you within 24 hours!' 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async subscribeToNewsletter(email, firstName = '', lastName = '') {
        try {
            const { data, error } = await this.supabase
                .from('newsletter_subscriptions')
                .insert([{
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    subscription_source: 'website'
                }])
                .select()
                .single();

            if (error) throw error;

            return { 
                success: true, 
                data, 
                message: 'Successfully subscribed to newsletter!' 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // ORDERS (Protected - requires authentication)
    // ===============================

    async getUserOrders(page = 1, limit = 10, status = null) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('Authentication required');

            let query = this.supabase
                .from('orders')
                .select(`
                    *,
                    services:service_id(service_name, category),
                    team_members:project_manager_id(name, profile_image)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;
            
            const { data, error, count } = await query
                .range(from, to)
                .limit(limit);

            if (error) throw error;

            return { 
                success: true, 
                data, 
                pagination: {
                    page,
                    per_page: limit,
                    total: count,
                    total_pages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createOrder(orderData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('Authentication required');

            const { data, error } = await this.supabase
                .from('orders')
                .insert([{
                    ...orderData,
                    user_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;

            return { 
                success: true, 
                data, 
                message: 'Order created successfully. Our team will contact you within 24 hours!' 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // PAYMENTS (Protected)
    // ===============================

    async getUserPayments() {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('Authentication required');

            const { data, error } = await this.supabase
                .from('payments')
                .select(`
                    *,
                    orders:order_id(order_number, project_title)
                `)
                .eq('user_id', user.id)
                .order('payment_date', { ascending: false });

            if (error) throw error;

            // Calculate summary
            const totalPaid = data
                .filter(payment => payment.payment_status === 'paid')
                .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

            const pendingPayments = data
                .filter(payment => payment.payment_status === 'pending')
                .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

            return { 
                success: true, 
                data,
                summary: {
                    total_paid: totalPaid,
                    pending_payments: pendingPayments,
                    total_invoices: data.length
                }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // REPORTS (Protected)
    // ===============================

    async getUserReports(type = null, year = null, month = null) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('Authentication required');

            let query = this.supabase
                .from('reports')
                .select(`
                    *,
                    orders:order_id(order_number, project_title)
                `)
                .eq('user_id', user.id)
                .eq('is_available', true)
                .order('generated_date', { ascending: false });

            if (type) query = query.eq('report_type', type);
            if (year) query = query.eq('report_year', year);
            if (month) query = query.eq('report_month', month);

            const { data, error } = await query;
            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ===============================
    // NOTIFICATIONS (Protected)
    // ===============================

    async getUserNotifications(isRead = null, limit = 20) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('Authentication required');

            let query = this.supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (isRead !== null) {
                query = query.eq('is_read', isRead);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Get unread count
            const { count: unreadCount } = await this.supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            return { 
                success: true, 
                data,
                unread_count: unreadCount 
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async markNotificationAsRead(notificationId) {
        try {
            const { data, error } = await this.supabase
                .from('notifications')
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq('notification_id', notificationId)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Initialize the API service
window.MaximusAPI = new MaximusAPI();
console.log('✅ Maximus API service initialized successfully');
