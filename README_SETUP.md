# Maximus Consultancy Website - Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Your database table `contact_submissions` should be already created

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` file with your PostgreSQL credentials:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

### 3. Start the Server
```bash
npm start
```

The website will be available at: `http://localhost:3000`

## API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contacts` - View all submissions (admin)
- **GET** `/api/health` - Health check

## Features

✅ **Contact Form Integration**
- Form data is saved to PostgreSQL `contact_submissions` table
- Real-time validation
- Success/error notifications
- Loading states with animations

✅ **Form Fields**
- First Name (required)
- Last Name (required) 
- Email (required, validated)
- Company (optional)
- Message (required)

✅ **Database Storage**
- All form submissions stored in PostgreSQL
- Automatic timestamps
- Input validation and sanitization

## Testing the Contact Form

1. Fill out the contact form on the website
2. Submit the form
3. Check your PostgreSQL database:
```sql
SELECT * FROM contact_submissions ORDER BY submitted_at DESC;
```

## Viewing Submissions
Visit `http://localhost:3000/api/contacts` to see all contact form submissions in JSON format.

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Ensure database exists and table is created

### Form Not Submitting
- Check browser console for errors
- Verify server is running on port 3000
- Check network tab in browser developer tools

## Production Deployment
- Set environment variables on your hosting platform
- Use a production PostgreSQL database
- Consider adding rate limiting and CSRF protection
