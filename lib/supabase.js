const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client for public operations (using anon key)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase admin client for server-side operations (using service key)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database helper functions
const db = {
  // Contact messages operations
  async createContactMessage(contactData) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        first_name: contactData.firstName,
        last_name: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone || null,
        company: contactData.company || null,
        subject: contactData.subject || 'Contact Form Submission',
        message: contactData.message,
        source: 'website',
        status: 'new'
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error creating contact message:', error);
      throw error;
    }

    return data;
  },

  async getContactMessages(limit = 50) {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase error fetching contact messages:', error);
      throw error;
    }

    return data;
  },

  async updateContactStatus(contactId, status) {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('message_id', contactId)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error updating contact status:', error);
      throw error;
    }

    return data;
  },

  async deleteContact(contactId) {
    const { data, error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('message_id', contactId);

    if (error) {
      console.error('Supabase error deleting contact:', error);
      throw error;
    }

    return data;
  },

  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error creating user:', error);
      throw error;
    }

    return data;
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Supabase error fetching user:', error);
      throw error;
    }

    return data;
  },

  // Services operations
  async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error fetching services:', error);
      throw error;
    }

    return data;
  },

  // Team members operations
  async getTeamMembers() {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error fetching team members:', error);
      throw error;
    }

    return data;
  },

  // Company stats operations
  async getCompanyStats() {
    const { data, error } = await supabase
      .from('company_stats')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error fetching company stats:', error);
      throw error;
    }

    return data;
  },

  // Newsletter subscription
  async createNewsletterSubscription(email, firstName, lastName) {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{
        email,
        first_name: firstName,
        last_name: lastName,
        status: 'active',
        subscription_source: 'website'
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error creating newsletter subscription:', error);
      throw error;
    }

    return data;
  },

  // Testimonials operations
  async getTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase error fetching testimonials:', error);
      throw error;
    }

    return data;
  },

  // Orders operations (for future use)
  async createOrder(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error creating order:', error);
      throw error;
    }

    return data;
  },

  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        services (
          service_name,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching user orders:', error);
      throw error;
    }

    return data;
  }
};

// Test database connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('company_stats')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase database successfully');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
    return false;
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  db,
  testConnection
};
