const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = null;
        this.init();
    }

    async init() {
        try {
            // Configure email transporter
            this.transporter = nodemailer.createTransport({
                // Using Gmail as an example - you can change this to your preferred email service
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER, // Your email address
                    pass: process.env.EMAIL_PASS  // Your app password (not regular password)
                }
            });

            // Alternative configuration for other email services:
            // 
            // For Outlook/Hotmail:
            // service: 'hotmail'
            //
            // For custom SMTP:
            // host: 'your-smtp-server.com',
            // port: 587,
            // secure: false,
            // auth: { user: 'your-email', pass: 'your-password' }

            console.log('✅ Email service initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing email service:', error);
        }
    }

    async sendConsultationNotification(contactData) {
        try {
            if (!this.transporter) {
                throw new Error('Email transporter not initialized');
            }

            const { firstName, lastName, email, company, message, phone } = contactData;
            
            // Check if this is a consultation request
            const isConsultationRequest = message.toLowerCase().includes('consultation') || 
                                        message.toLowerCase().includes('schedule') ||
                                        message.toLowerCase().includes('meeting');

            const subject = isConsultationRequest 
                ? `🚀 New Consultation Request from ${firstName} ${lastName}`
                : `📧 New Contact Form Submission from ${firstName} ${lastName}`;

            const emailContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .field { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea; }
                        .field-label { font-weight: bold; color: #555; margin-bottom: 5px; }
                        .field-value { color: #333; }
                        .consultation-badge { background: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; margin: 10px 0; }
                        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
                        .button { background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎯 ${isConsultationRequest ? 'New Consultation Request!' : 'New Contact Form Submission'}</h1>
                            <p>Maximus Consultancy Services</p>
                        </div>
                        
                        <div class="content">
                            ${isConsultationRequest ? '<div class="consultation-badge">⭐ CONSULTATION REQUEST</div>' : ''}
                            
                            <div class="field">
                                <div class="field-label">👤 Full Name:</div>
                                <div class="field-value">${firstName} ${lastName}</div>
                            </div>
                            
                            <div class="field">
                                <div class="field-label">📧 Email Address:</div>
                                <div class="field-value">${email}</div>
                            </div>
                            
                            ${phone ? `
                            <div class="field">
                                <div class="field-label">📱 Phone Number:</div>
                                <div class="field-value">${phone}</div>
                            </div>
                            ` : ''}
                            
                            ${company ? `
                            <div class="field">
                                <div class="field-label">🏢 Company:</div>
                                <div class="field-value">${company}</div>
                            </div>
                            ` : ''}
                            
                            <div class="field">
                                <div class="field-label">💬 Message:</div>
                                <div class="field-value">${message}</div>
                            </div>
                            
                            <div class="field">
                                <div class="field-label">🕒 Received At:</div>
                                <div class="field-value">${new Date().toLocaleString()}</div>
                            </div>
                            
                            ${isConsultationRequest ? `
                            <div style="text-align: center; margin: 30px 0;">
                                <p><strong>🎯 Action Required:</strong> This appears to be a consultation request. Please respond promptly to schedule their consultation.</p>
                                <a href="mailto:${email}" class="button">📧 Reply to ${firstName}</a>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div class="footer">
                            <p>This notification was sent from your Maximus Consultancy Services website.</p>
                            <p>You can also view this submission in your <a href="http://localhost:3000/admin">Admin Dashboard</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const mailOptions = {
                from: `"Maximus Consultancy Services" <${process.env.EMAIL_USER}>`,
                to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER, // Your email where you want to receive notifications
                subject: subject,
                html: emailContent,
                replyTo: email // So you can easily reply to the client
            };

            const result = await this.transporter.sendMail(mailOptions);
            
            console.log('✅ Email notification sent successfully:', {
                messageId: result.messageId,
                to: mailOptions.to,
                subject: mailOptions.subject,
                isConsultation: isConsultationRequest
            });

            return { success: true, messageId: result.messageId };
            
        } catch (error) {
            console.error('❌ Error sending email notification:', error);
            return { success: false, error: error.message };
        }
    }

    async sendAutoReply(contactData) {
        try {
            if (!this.transporter) {
                throw new Error('Email transporter not initialized');
            }

            const { firstName, lastName, email, message } = contactData;
            
            const isConsultationRequest = message.toLowerCase().includes('consultation') || 
                                        message.toLowerCase().includes('schedule') ||
                                        message.toLowerCase().includes('meeting');

            const autoReplyContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Thank You for Contacting Maximus Consultancy!</h1>
                        </div>
                        
                        <div class="content">
                            <h2>Hello ${firstName},</h2>
                            
                            <p>Thank you for ${isConsultationRequest ? 'your consultation request' : 'contacting us'}! We have received your message and appreciate your interest in Maximus Consultancy Services.</p>
                            
                            ${isConsultationRequest ? `
                            <p><strong>🎯 Consultation Request Received!</strong></p>
                            <p>We understand you're looking to schedule a consultation. Our team will review your request and get back to you within <strong>24 hours</strong> to discuss your business needs and schedule a convenient time for your consultation.</p>
                            ` : `
                            <p>Our team will review your message and respond to you within <strong>24 hours</strong>.</p>
                            `}
                            
                            <p><strong>What happens next:</strong></p>
                            <ul>
                                <li>✅ We'll review your ${isConsultationRequest ? 'consultation request' : 'message'}</li>
                                <li>📞 Our team will reach out to you directly</li>
                                ${isConsultationRequest ? '<li>📅 We\'ll schedule your consultation at a convenient time</li>' : ''}
                                <li>🚀 We'll discuss how we can help transform your business</li>
                            </ul>
                            
                            <p><strong>Need immediate assistance?</strong></p>
                            <p>Feel free to contact us directly:</p>
                            <p>📱 Phone: +91-6361960662<br>
                            📧 Email: arshadpatel1431@gmail.com</p>
                            
                            <p>Thank you for choosing Maximus Consultancy Services!</p>
                            
                            <p>Best regards,<br>
                            <strong>The Maximus Consultancy Team</strong></p>
                        </div>
                        
                        <div class="footer">
                            <p>Maximus Consultancy Services - Transforming Businesses with Expert Guidance</p>
                            <p>Bangalore, Karnataka, India</p>
                        </div>
                    </div>
                </body>
                </html>
            `;

            const autoReplyOptions = {
                from: `"Maximus Consultancy Services" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: isConsultationRequest 
                    ? `✅ Your Consultation Request Received - We'll Be In Touch Soon!`
                    : `✅ Thank You for Contacting Maximus Consultancy Services`,
                html: autoReplyContent
            };

            const result = await this.transporter.sendMail(autoReplyOptions);
            
            console.log('✅ Auto-reply sent successfully:', {
                messageId: result.messageId,
                to: email,
                isConsultation: isConsultationRequest
            });

            return { success: true, messageId: result.messageId };
            
        } catch (error) {
            console.error('❌ Error sending auto-reply:', error);
            return { success: false, error: error.message };
        }
    }

    async testConnection() {
        try {
            if (!this.transporter) {
                throw new Error('Email transporter not initialized');
            }

            await this.transporter.verify();
            console.log('✅ Email service connection test successful');
            return true;
        } catch (error) {
            console.error('❌ Email service connection test failed:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
