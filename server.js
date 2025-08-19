const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import Supabase configuration
const { db, testConnection } = require('./lib/supabase');

// Import Email Service
const emailService = require('./lib/emailService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Test Supabase connection on startup
testConnection();

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Handle contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, company, message, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (First Name, Last Name, Email, Message)'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Insert into Supabase database
    const contactData = {
      firstName,
      lastName,
      email,
      phone,
      company,
      message
    };

    const result = await db.createContactMessage(contactData);

    console.log('📧 New contact form submission:', {
      id: result.message_id,
      name: `${firstName} ${lastName}`,
      email: email,
      company: company || 'N/A',
      submitted_at: result.created_at
    });

    // Send email notifications (but don't fail the request if email fails)
    try {
      // Send notification to admin
      await emailService.sendConsultationNotification(contactData);
      
      // Send auto-reply to customer
      await emailService.sendAutoReply(contactData);
      
      console.log('✅ Email notifications sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email notification failed (but form submission succeeded):', emailError);
    }

    res.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you soon.',
      submissionId: result.message_id
    });

  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error sending your message. Please try again later.'
    });
  }
});

// Get all contact submissions (for admin purposes)
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await db.getContactMessages();
    res.json({
      success: true,
      contacts: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submissions'
    });
  }
});

// Update contact status (admin)
app.put('/api/contacts/:contactId/status', async (req, res) => {
  try {
    const { contactId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['new', 'read', 'in_progress', 'responded', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const result = await db.updateContactStatus(contactId, status);
    
    res.json({
      success: true,
      message: 'Contact status updated successfully',
      contact: result
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status'
    });
  }
});

// Delete contact (admin)
app.delete('/api/contacts/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    
    await db.deleteContact(contactId);
    
    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact'
    });
  }
});

// Get services
app.get('/api/services', async (req, res) => {
  try {
    const services = await db.getServices();
    res.json({
      success: true,
      services: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services'
    });
  }
});

// Get team members
app.get('/api/team', async (req, res) => {
  try {
    const teamMembers = await db.getTeamMembers();
    res.json({
      success: true,
      team: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team members'
    });
  }
});

// Get company stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await db.getCompanyStats();
    res.json({
      success: true,
      stats: stats
    });
  } catch (error) {
    console.error('Error fetching company stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching company stats'
    });
  }
});

// Get testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await db.getTestimonials();
    res.json({
      success: true,
      testimonials: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials'
    });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    const result = await db.createNewsletterSubscription(email, firstName, lastName);

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriptionId: result.subscription_id
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    if (error.code === '23505') { // Duplicate email
      res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error subscribing to newsletter'
      });
    }
  }
});

// Email test endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    // Test email configuration
    const testResult = await emailService.testConnection();
    
    if (!testResult) {
      return res.status(500).json({
        success: false,
        message: 'Email service connection failed. Please check your email configuration.'
      });
    }

    // Send test email
    const testContactData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      company: 'Test Company',
      message: 'This is a test consultation request to verify email notifications are working.',
      phone: '+91-1234567890'
    };

    const emailResult = await emailService.sendConsultationNotification(testContactData);
    
    res.json({
      success: emailResult.success,
      message: emailResult.success 
        ? 'Test email sent successfully! Check your inbox.' 
        : 'Failed to send test email: ' + emailResult.error,
      details: emailResult
    });
  } catch (error) {
    console.error('Error testing email:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing email service',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: isConnected ? 'Supabase connected' : 'Supabase connection failed',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'Supabase connection failed',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏠 Website: http://localhost:${PORT}`);
  console.log(`👨‍💼 Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`📝 Contact form endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`📊 View submissions: http://localhost:${PORT}/api/contacts`);
  console.log(`📊 Services: http://localhost:${PORT}/api/services`);
  console.log(`👥 Team: http://localhost:${PORT}/api/team`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`✨ Testimonials: http://localhost:${PORT}/api/testimonials`);
  console.log(`📰 Newsletter: http://localhost:${PORT}/api/newsletter`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  console.log('Thank you for using Maximus Consultancy backend!');
  process.exit(0);
});
