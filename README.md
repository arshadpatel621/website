# Maximus Consultancy Services - Backend System

This repository contains the backend database design and API implementation for Maximus Consultancy Services, a professional consultancy website.

## Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Development Setup](#development-setup)
- [Deployment Guide](#deployment-guide)
- [Security Considerations](#security-considerations)

## Project Overview

Maximus Consultancy Services is a professional business solutions company offering various services including:
- Mobile App Development
- Website Development
- Desktop Applications
- Market Analysis
- Business Strategy

This backend system provides all necessary functionality to support the company's frontend website, client portal, and admin dashboard.

## System Architecture

The system uses a modern stack with the following components:

- **Database**: PostgreSQL via Supabase
- **API Layer**: RESTful API (Node.js/Express)
- **Authentication**: JWT-based authentication
- **File Storage**: Supabase Storage
- **Deployment**: Vercel/Netlify/AWS

## Database Setup

### Prerequisites

- Supabase account (https://supabase.io)
- PostgreSQL client (optional, for direct database access)

### Database Creation

1. Create a new Supabase project
2. Navigate to the SQL Editor in your Supabase dashboard
3. Execute the SQL script from `database_setup.sql` to create all necessary tables
4. (Optional) Execute `sample_data.sql` to populate the database with sample data

### Important Tables

- `users` - User accounts and profiles
- `services` - Available services offered by the company
- `team_members` - Company team members and their details
- `orders` - Customer orders and project details
- `payments` - Payment records and transaction details
- `reports` - Generated reports and documents
- `contact_messages` - Contact form submissions
- `testimonials` - Client testimonials and reviews
- `company_stats` - Company statistics displayed on website

See `database_setup.sql` for complete schema details.

## API Documentation

Full API documentation is available in `API_Documentation.md`. The API provides endpoints for:

- User authentication and management
- Services management
- Order creation and tracking
- Payment processing
- Report generation and retrieval
- Team member information
- Contact form submission
- Newsletter subscriptions
- Testimonials management
- File uploads
- Notifications

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase CLI (optional, for local development)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password

# Storage
STORAGE_BUCKET=maximus-consultancy-files

# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=/api/v1
FRONTEND_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/maximus-consultancy-backend.git
cd maximus-consultancy-backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment Guide

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy with the following settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Deploying to AWS

1. Create an Elastic Beanstalk environment
2. Configure environment variables
3. Deploy with the following steps:
   ```bash
   npm run build
   eb init
   eb create
   eb deploy
   ```

## Security Considerations

- All authentication endpoints are protected with JWT tokens
- Password hashing is implemented using bcrypt
- Row-level security (RLS) is enabled in Supabase for sensitive tables
- API rate limiting is implemented to prevent abuse
- File uploads are scanned for viruses
- Input validation is performed on all API endpoints

## Database Schema Diagram

The database schema diagram illustrates the relationships between tables:

```
users
  ↑
  |
  ↓
orders → order_details
  ↑     ↑
  |     |
  ↓     ↓
payments reports
```

Key relationships:
- A user can have multiple orders
- An order can have multiple payments
- An order can have multiple reports
- Each order has one order detail record
- Each order is assigned to one team member as project manager

## Maintenance and Backups

- Regular database backups are configured in Supabase
- Database migrations should be versioned and tracked
- Monitor API usage and performance metrics
- Implement logging for error tracking
- Set up automated testing for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For any questions or support, please contact:
- Email: support@maximusconsultancy.com
- Phone: +91-6361960662
