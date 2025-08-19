# 📧 Email Notification Setup for Consultation Requests

Now you can receive email notifications whenever someone books a consultation or submits a contact form! Here's how to set it up:

## 🚀 Quick Setup (Gmail - Recommended)

### Step 1: Set up Gmail App Password
1. Go to your [Google Account settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Go to **App passwords**
4. Select **Mail** and **Other (Custom name)** → Enter "Maximus Consultancy"
5. Copy the 16-character app password (looks like: `abcd efgh ijkl mnop`)

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env` file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your email configuration:
```env
# Your Gmail address
EMAIL_USER=your-email@gmail.com

# The 16-character app password from Step 1
EMAIL_PASS=abcd efgh ijkl mnop

# Where you want to receive consultation notifications
NOTIFICATION_EMAIL=arshadpatel1431@gmail.com
```

### Step 3: Test Email Setup
1. Start your server: `npm start`
2. Test email configuration by sending a POST request to:
   ```
   POST http://localhost:3000/api/test-email
   ```
   
   Or use curl:
   ```bash
   curl -X POST http://localhost:3000/api/test-email
   ```

3. Check your email inbox for the test notification!

## 📧 What Happens Now

### When Someone Books a Consultation:
1. **Customer clicks "Book Consultation"** → Form opens with pre-filled consultation message
2. **Customer submits form** → Data is saved to database
3. **You receive an email notification** with:
   - 🎯 Special "CONSULTATION REQUEST" badge
   - Customer details (name, email, phone, company)
   - Their message
   - Direct reply button
   - Link to admin dashboard

4. **Customer receives auto-reply** with:
   - Confirmation of consultation request
   - What happens next
   - Your contact information
   - Professional, branded email template

### Email Features:
- ✅ **Smart Detection**: Automatically detects consultation vs. regular contact
- 🎨 **Professional Templates**: Beautiful HTML emails with your branding
- 📱 **Mobile Friendly**: Emails look great on all devices
- 🔄 **Auto-Reply**: Customers get immediate confirmation
- 📧 **Easy Reply**: Click to reply directly from notification email

## 🔧 Advanced Configuration

### Use Different Email Service (Outlook, Yahoo, etc.)
Edit `lib/emailService.js` and change the transporter configuration:

```javascript
// For Outlook/Hotmail
this.transporter = nodemailer.createTransporter({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// For custom SMTP
this.transporter = nodemailer.createTransporter({
    host: 'your-smtp-server.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
```

### Customize Email Templates
Edit the email templates in `lib/emailService.js`:
- `sendConsultationNotification()` - Email you receive
- `sendAutoReply()` - Email customer receives

## 🧪 Testing

### Test with Real Form Submission:
1. Go to your website: `http://localhost:3000`
2. Click "Book Consultation"
3. Fill out the form with your email as the customer
4. Submit the form
5. Check both email addresses for notifications!

### Test Email Delivery:
```bash
# Send test email
curl -X POST http://localhost:3000/api/test-email

# Check server logs for email status
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"Authentication failed" error**:
   - Make sure you're using App Password, not your regular Gmail password
   - Ensure 2-Step Verification is enabled
   - Check EMAIL_USER and EMAIL_PASS in .env file

2. **Emails not being received**:
   - Check spam/junk folder
   - Verify NOTIFICATION_EMAIL is correct
   - Test with `POST /api/test-email`

3. **Gmail blocking emails**:
   - Try sending test email first
   - Check Google Account security notifications
   - Verify App Password is correct

### Check Email Status:
Look at your server console for email status:
- ✅ `Email notification sent successfully`
- ❌ `Email notification failed`

## 🎯 What's Next?

Your consultation booking system is now complete with:
- ✅ Beautiful consultation booking buttons
- ✅ Smart form pre-filling
- ✅ Database storage
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Auto-reply to customers

### Optional Enhancements:
- 📅 **Calendar Integration**: Add Calendly or Google Calendar booking
- 📱 **SMS Notifications**: Add Twilio for SMS alerts
- 🔔 **Slack Integration**: Get notifications in Slack
- 📊 **Analytics**: Track consultation request conversion

## 📞 Need Help?

If you have any issues with the email setup:
1. Check the server console for error messages
2. Test with the `/api/test-email` endpoint
3. Verify your `.env` file configuration
4. Make sure your email provider allows app passwords

Your consultation booking system is ready to go! 🚀
