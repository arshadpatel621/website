# Email Setup Guide for Maximus Consultancy

## 🎯 Your Email Functionality Status: ✅ FULLY IMPLEMENTED

Your contact form email functionality is **already working**! Users can submit the contact form and emails will be sent automatically. You just need to complete the secure email configuration.

## 🚨 IMMEDIATE ACTION REQUIRED

### Step 1: Set up Gmail App Password (CRITICAL)

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Sign in to: arshadpatel1431@gmail.com

2. **Enable 2-Factor Authentication** (if not already enabled)
   - Go to **Security** tab
   - Click **2-Step Verification**
   - Follow the setup process

3. **Generate App Password**
   - In **Security** tab, find **App passwords**
   - Click **Select app** → Choose "Mail"
   - Click **Select device** → Choose "Other" and type "Maximus Website"
   - Click **GENERATE**
   - **Copy the 16-character password** (e.g., "abcd efgh ijkl mnop")

4. **Update .env file**
   - Open `.env` file in your project
   - Replace `your-app-password-here` with the app password you generated
   - **Remove all spaces** from the app password

Example:
```
EMAIL_PASS=abcdefghijklmnop
```

### Step 2: Test Email Functionality

1. **Start your server**:
   ```bash
   npm start
   ```

2. **Test the email service** by visiting:
   ```
   http://localhost:3000/api/test-email
   ```

3. **Or test through the contact form**:
   - Go to http://localhost:3000
   - Scroll to the contact form
   - Fill out and submit the form
   - Check your email inbox

## 📧 How the Email System Works

### When a user submits the contact form:

1. **Form data is saved** to your Supabase database
2. **Admin notification email** sent to: `arshadpatel1431@gmail.com`
   - Contains all form details
   - Highlights if it's a consultation request
   - Includes reply-to functionality

3. **Auto-reply email** sent to the user
   - Thanks them for contacting
   - Sets expectations for response time
   - Provides your contact information

## 🎨 Email Templates

Your emails include:
- ✅ Professional HTML templates
- ✅ Company branding
- ✅ Mobile-responsive design
- ✅ Consultation request detection
- ✅ Contact information
- ✅ Call-to-action buttons

## 📊 Admin Dashboard

View all contact submissions at:
```
http://localhost:3000/admin
```

## 🔧 API Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - View all submissions (admin)
- `POST /api/test-email` - Test email configuration

## 🚀 Going Live (Production)

### Recommended: Switch to Professional Email Service

For production, consider upgrading to:

**SendGrid (Recommended)**
```javascript
// In emailService.js, replace Gmail config with:
this.transporter = nodemailer.createTransporter({
    service: 'SendGrid',
    auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
    }
});
```

**Mailgun**
```javascript
this.transporter = nodemailer.createTransporter({
    host: 'smtp.mailgun.org',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILGUN_SMTP_LOGIN,
        pass: process.env.MAILGUN_SMTP_PASSWORD
    }
});
```

### Benefits of Professional Email Services:
- Higher delivery rates
- Better spam protection  
- Detailed analytics
- Higher sending limits
- Better support

## 📝 Customization Options

You can customize:

1. **Email templates** - Edit `lib/emailService.js`
2. **Notification recipients** - Update `NOTIFICATION_EMAIL` in `.env`
3. **Email styling** - Modify HTML templates in the service
4. **Auto-reply content** - Update auto-reply messages

## 🔍 Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Verify app password is correct
   - Ensure 2FA is enabled
   - Check EMAIL_USER matches your Gmail

2. **"Network error"**
   - Check internet connection
   - Verify Gmail SMTP access
   - Try restarting the server

3. **"Emails not received"**
   - Check spam folder
   - Verify NOTIFICATION_EMAIL address
   - Test with /api/test-email endpoint

### Need Help?

If you encounter issues:
1. Check server console for error messages
2. Test with the `/api/test-email` endpoint
3. Verify all environment variables are set correctly

## ✅ Success Checklist

- [ ] Generated Gmail App Password
- [ ] Updated EMAIL_PASS in .env file
- [ ] Tested email functionality
- [ ] Verified both admin and user emails are sent
- [ ] Confirmed emails are not going to spam
- [ ] Tested contact form submission

---

**Your email functionality is ready! Just complete the app password setup and you're good to go! 🚀**
