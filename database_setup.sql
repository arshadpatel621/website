-- ================================================
-- MAXIMUS CONSULTANCY SERVICES DATABASE SETUP
-- Supabase SQL Queries
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. USERS TABLE
-- ================================================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    profile_picture TEXT,
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended')),
    membership_type VARCHAR(20) DEFAULT 'basic' CHECK (membership_type IN ('basic', 'premium', 'enterprise')),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 2. SERVICES TABLE
-- ================================================
CREATE TABLE services (
    service_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    category VARCHAR(50) NOT NULL CHECK (category IN ('mobile_app', 'website', 'desktop', 'market_analysis', 'business_strategy', 'consulting')),
    price_range_min DECIMAL(10,2),
    price_range_max DECIMAL(10,2),
    duration_estimate_months INTEGER,
    image_url TEXT,
    features JSONB,
    technologies JSONB,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 3. TEAM MEMBERS TABLE
-- ================================================
CREATE TABLE team_members (
    member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    bio TEXT,
    skills JSONB,
    profile_image TEXT,
    social_links JSONB,
    years_experience INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    specialization VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_founder BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 4. ORDERS TABLE
-- ================================================
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(service_id) ON DELETE RESTRICT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    start_date DATE,
    end_date DATE,
    estimated_completion DATE,
    duration_months INTEGER,
    project_manager_id UUID REFERENCES team_members(member_id),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    client_feedback TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 5. ORDER DETAILS TABLE
-- ================================================
CREATE TABLE order_details (
    detail_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    requirement_description TEXT,
    deliverables JSONB,
    additional_notes TEXT,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 6. PAYMENTS TABLE
-- ================================================
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled')),
    transaction_id VARCHAR(255),
    payment_gateway VARCHAR(50),
    gateway_response JSONB,
    payment_date TIMESTAMP,
    due_date DATE,
    invoice_number VARCHAR(100),
    invoice_url TEXT,
    is_milestone_payment BOOLEAN DEFAULT false,
    milestone_description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 7. REPORTS TABLE
-- ================================================
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('monthly', 'order_specific', 'annual', 'quarterly', 'project_summary')),
    report_title VARCHAR(255) NOT NULL,
    report_month INTEGER CHECK (report_month >= 1 AND report_month <= 12),
    report_year INTEGER CHECK (report_year >= 2020),
    file_path TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    file_format VARCHAR(10) DEFAULT 'pdf',
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_available BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 8. CONTACT MESSAGES TABLE
-- ================================================
CREATE TABLE contact_messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'responded', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES team_members(member_id),
    response_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 9. NEWSLETTER SUBSCRIPTIONS TABLE
-- ================================================
CREATE TABLE newsletter_subscriptions (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscription_source VARCHAR(50) DEFAULT 'website',
    interests JSONB,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    last_email_sent TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 10. TESTIMONIALS TABLE
-- ================================================
CREATE TABLE testimonials (
    testimonial_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    position VARCHAR(255),
    testimonial_text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    client_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    order_id UUID REFERENCES orders(order_id),
    approved_by UUID REFERENCES team_members(member_id),
    approved_at TIMESTAMP,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 11. COMPANY STATS TABLE
-- ================================================
CREATE TABLE company_stats (
    stat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_name VARCHAR(100) UNIQUE NOT NULL,
    stat_value INTEGER NOT NULL,
    stat_label VARCHAR(255),
    stat_description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 12. ORDER STATUS HISTORY TABLE
-- ================================================
CREATE TABLE order_status_history (
    history_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by UUID REFERENCES team_members(member_id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 13. PROJECT MILESTONES TABLE
-- ================================================
CREATE TABLE project_milestones (
    milestone_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completion_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed')),
    payment_percentage DECIMAL(5,2) DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 14. FILE UPLOADS TABLE
-- ================================================
CREATE TABLE file_uploads (
    file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by UUID REFERENCES users(user_id),
    related_type VARCHAR(50), -- 'order', 'user_profile', 'report', etc.
    related_id UUID,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 15. NOTIFICATIONS TABLE
-- ================================================
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'order_update', 'payment', 'general', etc.
    related_id UUID, -- can reference orders, payments, etc.
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

-- ================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(account_status);
CREATE INDEX idx_users_membership ON users(membership_type);

-- Orders table indexes  
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_project_manager ON orders(project_manager_id);

-- Payments table indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Reports table indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_order_id ON reports(order_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_year_month ON reports(report_year, report_month);

-- Contact messages indexes
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_email ON contact_messages(email);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ================================================
-- FUNCTIONS AND TRIGGERS FOR AUTO-UPDATES
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_details_updated_at BEFORE UPDATE ON order_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_subscriptions_updated_at BEFORE UPDATE ON newsletter_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_suffix VARCHAR(4);
    order_count INTEGER;
    new_order_number VARCHAR(50);
BEGIN
    year_suffix := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    
    SELECT COUNT(*) + 1 INTO order_count 
    FROM orders 
    WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE);
    
    new_order_number := 'MSC-' || year_suffix || '-' || LPAD(order_count::VARCHAR, 3, '0');
    
    NEW.order_number := new_order_number;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply order number generation trigger
CREATE TRIGGER generate_order_number_trigger 
    BEFORE INSERT ON orders 
    FOR EACH ROW 
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Function to update user stats when order is created/updated
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users 
        SET total_orders = total_orders + 1,
            total_spent = total_spent + NEW.amount
        WHERE user_id = NEW.user_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- If amount changed, update the total_spent
        IF OLD.amount != NEW.amount THEN
            UPDATE users 
            SET total_spent = total_spent - OLD.amount + NEW.amount
            WHERE user_id = NEW.user_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users 
        SET total_orders = total_orders - 1,
            total_spent = total_spent - OLD.amount
        WHERE user_id = OLD.user_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Apply user stats trigger
CREATE TRIGGER update_user_stats_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON orders 
    FOR EACH ROW 
    EXECUTE FUNCTION update_user_stats();

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_details ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own payments
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own reports
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = user_id);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- INITIAL DATA SETUP
-- ================================================

-- Insert default company stats
INSERT INTO company_stats (stat_name, stat_value, stat_label, display_order) VALUES
('happy_clients', 10, 'Happy Clients', 1),
('success_rate', 98, 'Success Rate %', 2),
('years_experience', 3, 'Years Experience', 3),
('projects_completed', 5, 'Projects Completed', 4);

-- Insert default services
INSERT INTO services (service_name, description, short_description, category, image_url, features, technologies) VALUES
(
    'Mobile App Development',
    'Create powerful, user-friendly mobile applications for iOS and Android platforms with cutting-edge technology.',
    'Native and cross-platform mobile app development',
    'mobile_app',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
    '["Native Development", "Cross-platform", "UI/UX Design", "App Store Deployment"]',
    '["React Native", "Flutter", "Swift", "Kotlin"]'
),
(
    'Website Development',
    'Build responsive, modern websites that engage users and drive business growth with latest web technologies.',
    'Modern, responsive website development',
    'website',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d',
    '["Responsive Design", "SEO Optimization", "CMS Integration", "E-commerce"]',
    '["React", "Next.js", "Node.js", "Tailwind CSS"]'
),
(
    'Desktop Application',
    'Develop robust desktop applications with intuitive interfaces and powerful functionality for all platforms.',
    'Cross-platform desktop application development',
    'desktop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3',
    '["Cross-platform", "Native Performance", "Rich UI", "Database Integration"]',
    '["Electron", "Qt", "Java", ".NET"]'
),
(
    'Market Analysis',
    'Comprehensive market research and analysis to identify opportunities and strategic positioning.',
    'Data-driven market research and competitive analysis',
    'market_analysis',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    '["Market Research", "Competitive Analysis", "Consumer Insights", "Data Visualization"]',
    '["Analytics Tools", "Survey Platforms", "Data Mining"]'
),
(
    'Business Strategy',
    'Strategic planning and roadmap development to achieve sustainable business growth and success.',
    'Strategic consulting for business growth',
    'business_strategy',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    '["Strategic Planning", "Growth Roadmap", "Process Optimization", "Performance Metrics"]',
    '["Business Analysis", "Strategic Frameworks", "KPI Development"]'
);

-- Insert team members
INSERT INTO team_members (name, position, bio, skills, profile_image, social_links, years_experience, projects_completed, is_founder) VALUES
(
    'Kenneth Jason',
    'Backend Development Expert & Co-Founder',
    'Passionate backend development expert and co-founder creating exceptional user business transformation and organizational development.',
    '["Java", "React", "JavaScript", "Backend Development", "System Architecture"]',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    '{"linkedin": "#", "github": "#", "twitter": "#"}',
    5,
    15,
    true
),
(
    'Arshad Patel',
    'Frontend Developer & AI/ML Expert',
    'Frontend developer technology expert and specialist in AI and artificial intelligence and machine learning.',
    '["Machine Learning", "JavaScript", "AI/ML", "Frontend", "Python"]',
    'WhatsApp Image 2025-06-03 at 18.30.32_e74c1635.jpg',
    '{"linkedin": "#", "github": "#", "twitter": "#"}',
    4,
    12,
    true
),
(
    'Hanok Alure',
    'Backend Development Expert & Co-Founder',
    'Backend development expert and co-founder architecting robust server-side solutions and database systems.',
    '["Backend", "Databases", "APIs", "Designer", "System Design"]',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    '{"linkedin": "#", "github": "#", "twitter": "#"}',
    4,
    10,
    true
),
(
    'Abhishek Patil',
    'Frontend Developer & Creative Designer',
    'Frontend developer creative designer and frontend developer specializing in user experience and interface design.',
    '["Design", "Frontend", "Python", "Java", "UI/UX"]',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    '{"linkedin": "#", "github": "#", "twitter": "#"}',
    3,
    8,
    false
);

COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON TABLE services IS 'Available services offered by the company';
COMMENT ON TABLE team_members IS 'Company team members and their details';
COMMENT ON TABLE orders IS 'Customer orders and project details';
COMMENT ON TABLE payments IS 'Payment records and transaction details';
COMMENT ON TABLE reports IS 'Generated reports and documents';
COMMENT ON TABLE contact_messages IS 'Contact form submissions';
COMMENT ON TABLE newsletter_subscriptions IS 'Newsletter email subscriptions';
COMMENT ON TABLE testimonials IS 'Client testimonials and reviews';
COMMENT ON TABLE company_stats IS 'Company statistics displayed on website';
COMMENT ON TABLE notifications IS 'User notifications and alerts';

-- ================================================
-- END OF DATABASE SETUP
-- ================================================
