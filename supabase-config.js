// Supabase Configuration for Client-Side
const SUPABASE_URL = 'https://aqywlxxjrstdogneptns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeXdseHhqcnN0ZG9nbmVwdG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODM3MTUsImV4cCI6MjA3MDY1OTcxNX0.KONk-41etR2ixKofKBYRypWHY-OB56soNZxUyhYaz9M';

// API Configuration for backend communication
const API_BASE_URL = window.location.origin + '/api';

// Initialize Supabase client (for CDN usage)
let supabase = null;
if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully');
} else {
    console.log('⚠️ Supabase CDN not loaded, using backend API instead');
}

// API helper functions for backend communication
const API = {
    // Contact form submission
    async submitContact(contactData) {
        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData)
            });
            return await response.json();
        } catch (error) {
            console.error('Contact form submission error:', error);
            throw error;
        }
    },

    // Get services
    async getServices() {
        try {
            const response = await fetch(`${API_BASE_URL}/services`);
            return await response.json();
        } catch (error) {
            console.error('Services fetch error:', error);
            throw error;
        }
    },

    // Get team members
    async getTeam() {
        try {
            const response = await fetch(`${API_BASE_URL}/team`);
            return await response.json();
        } catch (error) {
            console.error('Team fetch error:', error);
            throw error;
        }
    },

    // Get company stats
    async getStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`);
            return await response.json();
        } catch (error) {
            console.error('Stats fetch error:', error);
            throw error;
        }
    },

    // Get testimonials
    async getTestimonials() {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials`);
            return await response.json();
        } catch (error) {
            console.error('Testimonials fetch error:', error);
            throw error;
        }
    },

    // Newsletter subscription
    async subscribeNewsletter(email, firstName = '', lastName = '') {
        try {
            const response = await fetch(`${API_BASE_URL}/newsletter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, firstName, lastName })
            });
            return await response.json();
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            throw error;
        }
    },

    // Health check
    async checkHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check error:', error);
            throw error;
        }
    }
};

// Export for use in other files
window.supabaseClient = supabase;
window.SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    key: SUPABASE_ANON_KEY
};
window.API = API;

console.log('✅ Maximus Consultancy API initialized successfully');
