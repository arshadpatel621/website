-- ================================================
-- SAMPLE DATA FOR MAXIMUS CONSULTANCY SERVICES
-- Run this after creating the main database structure
-- ================================================

-- Insert sample testimonials
INSERT INTO testimonials (client_name, company, position, testimonial_text, rating, client_image, is_featured, is_approved, display_order) VALUES
(
    'Olivia Carter',
    'TechStart Inc.',
    'CEO',
    'Maximus Consultancy Services transformed our business strategy completely. Their insights were invaluable and the results exceeded our expectations. We saw a 200% increase in revenue within the first year.',
    5,
    'https://images.unsplash.com/photo-1494790108755-2616b612b786',
    true,
    true,
    1
),
(
    'Ethan Harper',
    'GrowthCorp',
    'Founder',
    'The market analysis provided by Maximus was instrumental in our successful expansion into three new markets. Their data-driven approach gave us the confidence to make bold decisions.',
    5,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    true,
    true,
    2
),
(
    'Sophia Lin',
    'InnovateLab',
    'COO',
    'We saw significant improvements in our operational efficiency thanks to Maximus. Their process optimization reduced our costs by 40% while improving quality and customer satisfaction.',
    5,
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    true,
    true,
    3
);

-- Insert sample user (for demonstration - password should be hashed in real implementation)
INSERT INTO users (first_name, last_name, email, phone, password_hash, company, membership_type, total_orders, total_spent) VALUES
(
    'John',
    'Smith',
    'john.smith@example.com',
    '+1-555-0123',
    '$2b$10$example_hashed_password_here', -- This should be a properly hashed password
    'Smith Enterprises',
    'premium',
    12,
    24580.00
);

-- Get the user_id for sample orders (replace with actual UUID after user creation)
-- You'll need to replace this with the actual user_id from the users table
-- For now, let's assume we have the user_id

-- Insert sample orders (you'll need to replace user_id and service_id with actual UUIDs)
-- First, let's get some IDs for our sample data

-- You can get the actual UUIDs by running these queries after the initial setup:
-- SELECT user_id FROM users WHERE email = 'john.smith@example.com';
-- SELECT service_id FROM services WHERE service_name = 'Business Strategy';
-- SELECT member_id FROM team_members WHERE name = 'Kenneth Jason';

-- Example orders (replace UUIDs with actual ones from your database)
/*
INSERT INTO orders (user_id, service_id, project_title, amount, status, progress_percentage, start_date, end_date, duration_months, project_manager_id, satisfaction_rating, client_feedback) VALUES
(
    'USER_UUID_HERE', -- Replace with actual user UUID
    'SERVICE_UUID_HERE', -- Replace with Business Strategy service UUID
    'Business Strategy Consultation',
    8500.00,
    'completed',
    100,
    '2024-09-01',
    '2024-12-01',
    3,
    'KENNETH_MEMBER_ID_HERE', -- Replace with Kenneth's member UUID
    5,
    'Excellent work and professional service delivery'
),
(
    'USER_UUID_HERE', -- Replace with actual user UUID
    'SERVICE_UUID_HERE', -- Replace with Market Analysis service UUID
    'Market Analysis & Research',
    6200.00,
    'in_progress',
    70,
    '2024-10-01',
    '2024-12-01',
    2,
    'ARSHAD_MEMBER_ID_HERE', -- Replace with Arshad's member UUID
    NULL,
    NULL
),
(
    'USER_UUID_HERE', -- Replace with actual user UUID
    'SERVICE_UUID_HERE', -- Replace with Website Development service UUID
    'Website Development & SEO',
    9880.00,
    'completed',
    100,
    '2024-06-01',
    '2024-10-01',
    4,
    'HANOK_MEMBER_ID_HERE', -- Replace with Hanok's member UUID
    5,
    'Outstanding website development and SEO optimization'
);
*/

-- Insert sample contact messages
INSERT INTO contact_messages (first_name, last_name, email, phone, company, subject, message, status, priority) VALUES
(
    'Alice',
    'Johnson',
    'alice.johnson@company.com',
    '+1-555-0234',
    'Johnson & Associates',
    'Inquiry about Business Strategy Services',
    'Hi, I am interested in learning more about your business strategy consulting services. Our company is looking to expand into new markets and would like to schedule a consultation.',
    'new',
    'high'
),
(
    'Michael',
    'Brown',
    'michael.brown@startup.io',
    '+1-555-0345',
    'InnovateTech Startup',
    'Mobile App Development Quote',
    'We need a mobile app developed for both iOS and Android platforms. The app will be a productivity tool for small businesses. Can you provide a quote and timeline?',
    'read',
    'medium'
),
(
    'Sarah',
    'Davis',
    'sarah.davis@retailcorp.com',
    '+1-555-0456',
    'RetailCorp Inc.',
    'Website Redesign Project',
    'Our current website needs a complete redesign. We are looking for a modern, responsive design that will improve user experience and conversion rates.',
    'in_progress',
    'medium'
);

-- Insert newsletter subscriptions
INSERT INTO newsletter_subscriptions (email, first_name, last_name, subscription_source, interests) VALUES
('subscriber1@email.com', 'Emma', 'Wilson', 'website', '["business_strategy", "digital_transformation"]'),
('subscriber2@email.com', 'David', 'Miller', 'website', '["mobile_development", "web_development"]'),
('subscriber3@email.com', 'Lisa', 'Garcia', 'social_media', '["market_analysis", "business_consulting"]'),
('subscriber4@email.com', 'James', 'Rodriguez', 'website', '["all_services"]');

-- Insert sample reports (you'll need actual order UUIDs)
/*
INSERT INTO reports (order_id, user_id, report_type, report_title, report_month, report_year, file_name, file_format) VALUES
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID
    'USER_UUID_HERE', -- Replace with actual user UUID
    'order_specific',
    'Business Strategy Consultation Report - December 2024',
    12,
    2024,
    'MSC-2024-001_Report_December_2024.pdf',
    'pdf'
),
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID
    'USER_UUID_HERE', -- Replace with actual user UUID
    'order_specific',
    'Market Analysis Report - November 2024',
    11,
    2024,
    'MSC-2024-002_Report_November_2024.pdf',
    'pdf'
),
(
    NULL, -- Monthly report not tied to specific order
    'USER_UUID_HERE', -- Replace with actual user UUID
    'monthly',
    'Monthly Summary Report - December 2024',
    12,
    2024,
    'Monthly_Report_December_2024.pdf',
    'pdf'
);
*/

-- Insert sample payments (you'll need actual order and user UUIDs)
/*
INSERT INTO payments (order_id, user_id, amount, currency, payment_method, payment_status, transaction_id, payment_date, invoice_number) VALUES
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID
    'USER_UUID_HERE', -- Replace with actual user UUID
    8500.00,
    'USD',
    'credit_card',
    'paid',
    'txn_1234567890',
    '2024-12-01 10:30:00',
    'INV-MSC-2024-001'
),
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID
    'USER_UUID_HERE', -- Replace with actual user UUID
    3100.00,
    'USD',
    'bank_transfer',
    'paid',
    'txn_1234567891',
    '2024-11-15 14:20:00',
    'INV-MSC-2024-002'
),
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID
    'USER_UUID_HERE', -- Replace with actual user UUID
    9880.00,
    'USD',
    'credit_card',
    'paid',
    'txn_1234567892',
    '2024-10-30 16:45:00',
    'INV-MSC-2024-003'
);
*/

-- Insert sample notifications (you'll need actual user UUID)
/*
INSERT INTO notifications (user_id, title, message, type, is_read, action_url) VALUES
(
    'USER_UUID_HERE', -- Replace with actual user UUID
    'Order Completed',
    'Your Business Strategy Consultation project has been completed successfully!',
    'order_update',
    false,
    '/profile-history#orders'
),
(
    'USER_UUID_HERE', -- Replace with actual user UUID
    'Payment Received',
    'We have received your payment for Order #MSC-2024-002. Thank you!',
    'payment',
    true,
    '/profile-history#payments'
),
(
    'USER_UUID_HERE', -- Replace with actual user UUID
    'New Report Available',
    'Your monthly report for December 2024 is now available for download.',
    'report',
    false,
    '/profile-history#reports'
);
*/

-- Insert sample project milestones (you'll need actual order UUIDs)
/*
INSERT INTO project_milestones (order_id, milestone_name, description, due_date, completion_date, status, payment_percentage, sort_order) VALUES
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID for Business Strategy
    'Initial Analysis',
    'Complete business analysis and requirements gathering',
    '2024-09-15',
    '2024-09-14',
    'completed',
    25.00,
    1
),
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID for Business Strategy
    'Strategy Development',
    'Develop comprehensive business strategy document',
    '2024-10-15',
    '2024-10-12',
    'completed',
    35.00,
    2
),
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID for Business Strategy
    'Implementation Plan',
    'Create detailed implementation roadmap',
    '2024-11-15',
    '2024-11-10',
    'completed',
    25.00,
    3
),
(
    'ORDER_UUID_HERE', -- Replace with actual order UUID for Business Strategy
    'Final Review',
    'Final strategy review and presentation',
    '2024-12-01',
    '2024-11-28',
    'completed',
    15.00,
    4
);
*/

-- ================================================
-- HELPER QUERIES TO GET UUIDS FOR SAMPLE DATA
-- ================================================

-- Run these queries after the initial setup to get the UUIDs you need:

-- Get user UUID
-- SELECT user_id, email FROM users WHERE email = 'john.smith@example.com';

-- Get service UUIDs
-- SELECT service_id, service_name FROM services;

-- Get team member UUIDs
-- SELECT member_id, name FROM team_members;

-- After getting the UUIDs, you can replace the placeholder values in the commented INSERT statements above

-- ================================================
-- USEFUL QUERIES FOR TESTING
-- ================================================

-- Check all tables have been created
/*
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
*/

-- Check company stats
-- SELECT * FROM company_stats ORDER BY display_order;

-- Check services
-- SELECT service_name, category, is_active FROM services WHERE is_active = true;

-- Check team members
-- SELECT name, position, years_experience FROM team_members WHERE is_active = true ORDER BY is_founder DESC, years_experience DESC;

-- Check testimonials
-- SELECT client_name, company, rating FROM testimonials WHERE is_approved = true AND is_featured = true;

-- ================================================
-- SAMPLE API RESPONSE FORMATS
-- ================================================

-- Sample response for GET /api/services
/*
{
  "services": [
    {
      "service_id": "uuid",
      "service_name": "Mobile App Development",
      "description": "Create powerful, user-friendly mobile applications...",
      "category": "mobile_app",
      "features": ["Native Development", "Cross-platform", "UI/UX Design"],
      "technologies": ["React Native", "Flutter", "Swift", "Kotlin"],
      "price_range_min": 5000,
      "price_range_max": 25000,
      "duration_estimate_months": 3
    }
  ]
}
*/

-- Sample response for GET /api/team
/*
{
  "team_members": [
    {
      "member_id": "uuid",
      "name": "Kenneth Jason",
      "position": "Backend Development Expert & Co-Founder",
      "bio": "Passionate backend development expert...",
      "skills": ["Java", "React", "JavaScript", "Backend Development"],
      "profile_image": "https://images.unsplash.com/...",
      "social_links": {
        "linkedin": "#",
        "github": "#",
        "twitter": "#"
      },
      "years_experience": 5,
      "projects_completed": 15,
      "is_founder": true
    }
  ]
}
*/

-- Sample response for GET /api/orders/user/{userId}
/*
{
  "orders": [
    {
      "order_id": "uuid",
      "order_number": "MSC-2024-001",
      "project_title": "Business Strategy Consultation",
      "service_name": "Business Strategy",
      "amount": 8500.00,
      "currency": "USD",
      "status": "completed",
      "progress_percentage": 100,
      "start_date": "2024-09-01",
      "end_date": "2024-12-01",
      "duration_months": 3,
      "project_manager": {
        "name": "Kenneth Jason",
        "member_id": "uuid"
      },
      "satisfaction_rating": 5,
      "created_at": "2024-09-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 12,
    "total_pages": 2
  }
}
*/
