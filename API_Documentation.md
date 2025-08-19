# Maximus Consultancy Services - Supabase Backend API Documentation

## Overview
This API serves as the backend for the Maximus Consultancy Services website, powered by Supabase database. All endpoints are RESTful and return JSON responses.

**Base URL:** `http://localhost:3000/api` (development)

## Database
- **Technology:** Supabase (PostgreSQL with real-time capabilities)
- **Authentication:** Supabase Auth (ready for future implementation)
- **Real-time:** WebSocket connections available
- **Security:** Row Level Security (RLS) enabled on sensitive tables

## Base URL
```
Production: https://your-domain.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Services](#services)
4. [Orders](#orders)
5. [Payments](#payments)
6. [Reports](#reports)
7. [Team Members](#team-members)
8. [Contact & Communication](#contact--communication)
9. [Testimonials](#testimonials)
10. [Company Stats](#company-stats)
11. [File Uploads](#file-uploads)
12. [Notifications](#notifications)

---

## 🔐 Authentication

### POST `/auth/register`
Register a new user account

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "password": "securePassword123",
  "company": "Doe Enterprises"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "company": "Doe Enterprises",
      "membership_type": "basic",
      "account_status": "active"
    },
    "token": "jwt_token_here"
  },
  "message": "Account created successfully"
}
```

### POST `/auth/login`
User login

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "company": "Doe Enterprises",
      "membership_type": "premium",
      "total_orders": 12,
      "total_spent": 24580.00
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### POST `/auth/logout`
User logout (Protected)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST `/auth/forgot-password`
Request password reset

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### POST `/auth/reset-password`
Reset password with token

**Request Body:**
```json
{
  "token": "reset_token",
  "new_password": "newSecurePassword123"
}
```

---

## 👤 User Management

### GET `/users/profile` (Protected)
Get current user profile

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john.smith@example.com",
    "phone": "+1-555-0123",
    "company": "Smith Enterprises",
    "profile_picture": "https://example.com/profiles/john.jpg",
    "membership_type": "premium",
    "account_status": "active",
    "total_orders": 12,
    "total_spent": 24580.00,
    "member_since": "2023-01-15T10:00:00Z",
    "last_login": "2024-01-13T15:30:00Z"
  }
}
```

### PUT `/users/profile` (Protected)
Update user profile

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+1-555-0456",
  "company": "Updated Company Name"
}
```

### POST `/users/upload-avatar` (Protected)
Upload profile picture

**Request:** Multipart form data with `avatar` file

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile_picture": "https://example.com/uploads/avatars/uuid.jpg"
  },
  "message": "Profile picture updated successfully"
}
```

---

## 🛠️ Services

### GET `/services`
Get all active services

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Limit results (default: 10)
- `offset` (optional): Offset for pagination

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "service_id": "uuid",
      "service_name": "Mobile App Development",
      "description": "Create powerful, user-friendly mobile applications for iOS and Android platforms with cutting-edge technology.",
      "short_description": "Native and cross-platform mobile app development",
      "category": "mobile_app",
      "price_range_min": 5000.00,
      "price_range_max": 25000.00,
      "duration_estimate_months": 3,
      "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
      "features": ["Native Development", "Cross-platform", "UI/UX Design", "App Store Deployment"],
      "technologies": ["React Native", "Flutter", "Swift", "Kotlin"]
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0
  }
}
```

### GET `/services/:serviceId`
Get specific service details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "service_id": "uuid",
    "service_name": "Mobile App Development",
    "description": "Detailed description...",
    "category": "mobile_app",
    "features": ["Feature 1", "Feature 2"],
    "technologies": ["Tech 1", "Tech 2"],
    "price_range_min": 5000.00,
    "price_range_max": 25000.00
  }
}
```

---

## 📦 Orders

### GET `/orders/user` (Protected)
Get current user's orders

**Query Parameters:**
- `status` (optional): Filter by status
- `limit` (optional): Results per page (default: 10)
- `page` (optional): Page number (default: 1)
- `sort` (optional): Sort order (newest, oldest, amount_high, amount_low)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "order_id": "uuid",
      "order_number": "MSC-2024-001",
      "project_title": "Business Strategy Consultation",
      "service": {
        "service_id": "uuid",
        "service_name": "Business Strategy",
        "category": "business_strategy"
      },
      "amount": 8500.00,
      "currency": "USD",
      "status": "completed",
      "progress_percentage": 100,
      "start_date": "2024-09-01",
      "end_date": "2024-12-01",
      "estimated_completion": "2024-12-01",
      "duration_months": 3,
      "project_manager": {
        "member_id": "uuid",
        "name": "Kenneth Jason",
        "profile_image": "https://example.com/team/kenneth.jpg"
      },
      "satisfaction_rating": 5,
      "client_feedback": "Excellent work and professional service delivery",
      "created_at": "2024-09-01T10:00:00Z",
      "updated_at": "2024-12-01T16:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 12,
    "total_pages": 2
  }
}
```

### GET `/orders/:orderId` (Protected)
Get specific order details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order_id": "uuid",
    "order_number": "MSC-2024-001",
    "project_title": "Business Strategy Consultation",
    "service": {
      "service_name": "Business Strategy",
      "category": "business_strategy"
    },
    "amount": 8500.00,
    "status": "completed",
    "progress_percentage": 100,
    "project_manager": {
      "name": "Kenneth Jason",
      "email": "kenneth@maximusconsultancy.com"
    },
    "milestones": [
      {
        "milestone_id": "uuid",
        "milestone_name": "Initial Analysis",
        "description": "Complete business analysis and requirements gathering",
        "due_date": "2024-09-15",
        "completion_date": "2024-09-14",
        "status": "completed",
        "payment_percentage": 25.00
      }
    ],
    "order_details": {
      "requirement_description": "Detailed requirements...",
      "deliverables": ["Strategy Document", "Implementation Plan"],
      "additional_notes": "Special requirements..."
    }
  }
}
```

### POST `/orders` (Protected)
Create new order

**Request Body:**
```json
{
  "service_id": "uuid",
  "project_title": "My New Project",
  "requirement_description": "Detailed project requirements...",
  "deliverables": ["Deliverable 1", "Deliverable 2"],
  "estimated_budget": 10000.00,
  "preferred_start_date": "2024-02-01",
  "additional_notes": "Special requirements or preferences..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "order_id": "uuid",
    "order_number": "MSC-2024-015",
    "status": "pending",
    "message": "Order created successfully. Our team will contact you within 24 hours."
  }
}
```

### PUT `/orders/:orderId/rating` (Protected)
Submit satisfaction rating and feedback

**Request Body:**
```json
{
  "satisfaction_rating": 5,
  "client_feedback": "Excellent work and professional service delivery"
}
```

---

## 💳 Payments

### GET `/payments/user` (Protected)
Get current user's payment history

**Query Parameters:**
- `status` (optional): Filter by payment status
- `limit` (optional): Results per page
- `page` (optional): Page number

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "payment_id": "uuid",
      "order": {
        "order_id": "uuid",
        "order_number": "MSC-2024-001",
        "project_title": "Business Strategy Consultation"
      },
      "amount": 8500.00,
      "currency": "USD",
      "payment_method": "credit_card",
      "payment_status": "paid",
      "transaction_id": "txn_1234567890",
      "payment_date": "2024-12-01T10:30:00Z",
      "invoice_number": "INV-MSC-2024-001",
      "invoice_url": "https://example.com/invoices/INV-MSC-2024-001.pdf"
    }
  ],
  "summary": {
    "total_paid": 24580.00,
    "pending_payments": 0.00,
    "total_invoices": 12
  }
}
```

### POST `/payments` (Protected)
Process payment

**Request Body:**
```json
{
  "order_id": "uuid",
  "amount": 8500.00,
  "payment_method": "credit_card",
  "payment_details": {
    "card_token": "stripe_token_here",
    "billing_address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "US"
    }
  }
}
```

### GET `/payments/:paymentId/invoice` (Protected)
Download payment invoice

**Response:** PDF file download

---

## 📊 Reports

### GET `/reports/user` (Protected)
Get available reports for user

**Query Parameters:**
- `type` (optional): Filter by report type
- `year` (optional): Filter by year
- `month` (optional): Filter by month

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "report_id": "uuid",
      "report_type": "monthly",
      "report_title": "Monthly Summary Report - December 2024",
      "report_month": 12,
      "report_year": 2024,
      "file_name": "Monthly_Report_December_2024.pdf",
      "file_size": 1024000,
      "generated_date": "2024-12-31T23:59:00Z",
      "download_count": 3,
      "order": {
        "order_number": "MSC-2024-001",
        "project_title": "Business Strategy Consultation"
      }
    }
  ]
}
```

### POST `/reports/generate` (Protected)
Generate new report

**Request Body:**
```json
{
  "report_type": "monthly",
  "month": 12,
  "year": 2024,
  "order_id": "uuid" // Optional, for order-specific reports
}
```

### GET `/reports/:reportId/download` (Protected)
Download report file

**Response:** PDF file download

---

## 👥 Team Members

### GET `/team`
Get all active team members

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "member_id": "uuid",
      "name": "Kenneth Jason",
      "position": "Backend Development Expert & Co-Founder",
      "bio": "Passionate backend development expert and co-founder creating exceptional user business transformation and organizational development.",
      "skills": ["Java", "React", "JavaScript", "Backend Development", "System Architecture"],
      "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "social_links": {
        "linkedin": "https://linkedin.com/in/kenneth-jason",
        "github": "https://github.com/kenneth-jason",
        "twitter": "https://twitter.com/kenneth_jason"
      },
      "years_experience": 5,
      "projects_completed": 15,
      "is_founder": true,
      "specialization": "Backend Development"
    }
  ]
}
```

### GET `/team/:memberId`
Get specific team member details

---

## 📞 Contact & Communication

### POST `/contact`
Submit contact form

**Request Body:**
```json
{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@company.com",
  "phone": "+1-555-0234",
  "company": "Johnson & Associates",
  "subject": "Inquiry about Business Strategy Services",
  "message": "Hi, I am interested in learning more about your business strategy consulting services..."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message_id": "uuid",
    "status": "received"
  },
  "message": "Thank you for your message. We'll get back to you within 24 hours."
}
```

### POST `/newsletter/subscribe`
Subscribe to newsletter

**Request Body:**
```json
{
  "email": "subscriber@email.com",
  "first_name": "John",
  "last_name": "Doe",
  "interests": ["business_strategy", "digital_transformation"]
}
```

### POST `/newsletter/unsubscribe`
Unsubscribe from newsletter

**Request Body:**
```json
{
  "email": "subscriber@email.com"
}
```

---

## 🌟 Testimonials

### GET `/testimonials`
Get featured testimonials

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "testimonial_id": "uuid",
      "client_name": "Olivia Carter",
      "company": "TechStart Inc.",
      "position": "CEO",
      "testimonial_text": "Maximus Consultancy Services transformed our business strategy completely...",
      "rating": 5,
      "client_image": "https://images.unsplash.com/photo-1494790108755-2616b612b786"
    }
  ]
}
```

### POST `/testimonials` (Protected)
Submit new testimonial

**Request Body:**
```json
{
  "order_id": "uuid",
  "testimonial_text": "Excellent service and professional delivery...",
  "rating": 5
}
```

---

## 📈 Company Stats

### GET `/stats`
Get company statistics

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "stat_id": "uuid",
      "stat_name": "happy_clients",
      "stat_value": 10,
      "stat_label": "Happy Clients",
      "display_order": 1
    },
    {
      "stat_id": "uuid",
      "stat_name": "success_rate",
      "stat_value": 98,
      "stat_label": "Success Rate %",
      "display_order": 2
    },
    {
      "stat_id": "uuid",
      "stat_name": "years_experience",
      "stat_value": 3,
      "stat_label": "Years Experience",
      "display_order": 3
    },
    {
      "stat_id": "uuid",
      "stat_name": "projects_completed",
      "stat_value": 5,
      "stat_label": "Projects Completed",
      "display_order": 4
    }
  ]
}
```

---

## 📁 File Uploads

### POST `/files/upload` (Protected)
Upload file

**Request:** Multipart form data with file and metadata

**Request Body (form-data):**
- `file`: File to upload
- `related_type`: Type of related entity (order, user_profile, etc.)
- `related_id`: UUID of related entity
- `is_public`: Boolean, whether file is publicly accessible

**Response (201):**
```json
{
  "success": true,
  "data": {
    "file_id": "uuid",
    "file_name": "generated_filename.pdf",
    "original_name": "document.pdf",
    "file_path": "https://example.com/uploads/documents/uuid/document.pdf",
    "file_size": 1024000,
    "mime_type": "application/pdf"
  }
}
```

### GET `/files/:fileId` (Protected)
Download file

**Response:** File download

---

## 🔔 Notifications

### GET `/notifications` (Protected)
Get user notifications

**Query Parameters:**
- `is_read` (optional): Filter by read status
- `type` (optional): Filter by notification type
- `limit` (optional): Results per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "notification_id": "uuid",
      "title": "Order Completed",
      "message": "Your Business Strategy Consultation project has been completed successfully!",
      "type": "order_update",
      "is_read": false,
      "action_url": "/profile-history#orders",
      "created_at": "2024-12-01T18:00:00Z",
      "related_data": {
        "order_id": "uuid",
        "order_number": "MSC-2024-001"
      }
    }
  ],
  "unread_count": 3
}
```

### PUT `/notifications/:notificationId/read` (Protected)
Mark notification as read

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### PUT `/notifications/mark-all-read` (Protected)
Mark all notifications as read

---

## 🚫 Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details if available"
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Sample Error Responses

**Validation Error (422):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Email is required"],
      "password": ["Password must be at least 8 characters"]
    }
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

**Not Found (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

## 📝 Additional Notes

### Rate Limiting
- Public endpoints: 100 requests per hour per IP
- Authenticated endpoints: 1000 requests per hour per user
- File upload endpoints: 10 requests per minute per user

### File Upload Limits
- Maximum file size: 10MB
- Allowed formats: PDF, DOC, DOCX, JPG, PNG, GIF
- Profile pictures: Maximum 2MB, JPG/PNG only

### Data Retention
- User data: Retained as per privacy policy
- Order history: Retained indefinitely
- Reports: Available for 2 years from generation
- Contact messages: Retained for 1 year

### Security Features
- JWT token expiration: 24 hours
- Password hashing: bcrypt with 12 rounds
- File uploads: Virus scanning enabled
- SQL injection protection: Parameterized queries
- CORS: Configured for specific domains only
