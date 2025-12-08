import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP services
  // For production, use a proper email service like SendGrid, AWS SES, etc.
  
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPassword = process.env.EMAIL_PASSWORD?.trim();
  const emailService = process.env.EMAIL_SERVICE?.trim() || 'gmail';

  // Validate email configuration
  if (!emailUser || !emailPassword) {
    throw new Error('EMAIL_USER and EMAIL_PASSWORD must be set in .env file');
  }

  // Gmail configuration with explicit SMTP settings
  if (emailService.toLowerCase() === 'gmail') {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPassword, // Use App Password for Gmail (16 characters, no spaces)
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  }

  // Generic SMTP configuration for other services
  return nodemailer.createTransport({
    service: emailService,
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });
};

// Email template for appointment approval
const getApprovalEmailTemplate = (ownerName, petName, clinicName, appointmentDate, appointmentTime, service, vetName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B6B 0%, #FFB49A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50; }
        .info-item { margin: 10px 0; }
        .info-label { font-weight: bold; color: #555; }
        .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #FF6B6B; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🐾 Appointment Approved!</h1>
        </div>
        <div class="content">
          <p>Dear ${ownerName},</p>
          
          <p>Great news! Your appointment request has been <strong>approved</strong> by ${clinicName}.</p>
          
          <div class="info-box">
            <div class="info-item">
              <span class="info-label">Pet:</span> ${petName}
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span> ${appointmentDate}
            </div>
            <div class="info-item">
              <span class="info-label">Time:</span> ${appointmentTime}
            </div>
            <div class="info-item">
              <span class="info-label">Service:</span> ${service}
            </div>
            ${vetName ? `<div class="info-item"><span class="info-label">Assigned Veterinarian:</span> Dr. ${vetName}</div>` : ''}
          </div>
          
          <p>Please make sure to arrive on time for your appointment. If you need to reschedule or cancel, please contact the clinic as soon as possible.</p>
          
          <p>We look forward to seeing you and ${petName}!</p>
          
          <p>Best regards,<br>The ${clinicName} Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email from VetSync. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for appointment rejection
const getRejectionEmailTemplate = (ownerName, petName, clinicName, appointmentDate, appointmentTime, service, rejectionReason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B6B 0%, #FFB49A 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B6B; }
        .reason-box { background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
        .info-item { margin: 10px 0; }
        .info-label { font-weight: bold; color: #555; }
        .footer { text-align: center; margin-top: 20px; color: #777; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #FF6B6B; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Appointment Update</h1>
        </div>
        <div class="content">
          <p>Dear ${ownerName},</p>
          
          <p>We regret to inform you that your appointment request has been <strong>declined</strong> by ${clinicName}.</p>
          
          <div class="info-box">
            <div class="info-item">
              <span class="info-label">Pet:</span> ${petName}
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span> ${appointmentDate}
            </div>
            <div class="info-item">
              <span class="info-label">Time:</span> ${appointmentTime}
            </div>
            <div class="info-item">
              <span class="info-label">Service:</span> ${service}
            </div>
          </div>
          
          ${rejectionReason ? `
          <div class="reason-box">
            <p><strong>Reason:</strong></p>
            <p>${rejectionReason}</p>
          </div>
          ` : ''}
          
          <p>We apologize for any inconvenience this may cause. Please feel free to book another appointment at a time that works better for both parties.</p>
          
          <p>If you have any questions or concerns, please don't hesitate to contact ${clinicName} directly.</p>
          
          <p>Best regards,<br>The ${clinicName} Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email from VetSync. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email function
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    // Check if email is configured
    const emailUser = process.env.EMAIL_USER?.trim();
    const emailPassword = process.env.EMAIL_PASSWORD?.trim();
    
    if (!emailUser || !emailPassword) {
      console.warn('Email service not configured. Skipping email send.');
      console.warn('To enable emails, set EMAIL_USER and EMAIL_PASSWORD in your .env file');
      return { success: false, message: 'Email service not configured' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailUser)) {
      console.error('Invalid EMAIL_USER format:', emailUser);
      return { success: false, error: 'Invalid email format in EMAIL_USER' };
    }

    // Verify transporter can be created
    let transporter;
    try {
      transporter = createTransporter();
    } catch (transporterError) {
      console.error('Error creating email transporter:', transporterError.message);
      return { success: false, error: `Transporter error: ${transporterError.message}` };
    }

    // Verify connection before sending
    try {
      await transporter.verify();
      console.log('Email server connection verified successfully');
    } catch (verifyError) {
      console.error('Email server verification failed:', verifyError.message);
      
      // Provide helpful error messages
      if (verifyError.code === 'EAUTH') {
        console.error('\n⚠️  Authentication Error - Common fixes:');
        console.error('1. Make sure you\'re using an App Password (not your regular Gmail password)');
        console.error('2. Generate a new App Password: https://myaccount.google.com/apppasswords');
        console.error('3. Ensure EMAIL_USER matches the Gmail account exactly');
        console.error('4. Remove any spaces or quotes from EMAIL_PASSWORD in .env file');
        console.error('5. Make sure 2-Step Verification is enabled on your Google account');
      }
      
      return { success: false, error: `Email server verification failed: ${verifyError.message}` };
    }

    const mailOptions = {
      from: `"VetSync" <${emailUser}>`, // From address must match authenticated email
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Plain text fallback
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Provide specific error guidance
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Gmail Authentication Troubleshooting:');
      console.error('1. Verify EMAIL_USER in .env matches your Gmail address exactly');
      console.error('2. Generate a NEW App Password: https://myaccount.google.com/apppasswords');
      console.error('   - Select "Mail" and your device');
      console.error('   - Copy the 16-character password (no spaces)');
      console.error('3. Update EMAIL_PASSWORD in .env with the new app password');
      console.error('4. Restart your server after updating .env');
      console.error('5. Ensure 2-Step Verification is enabled');
    }
    
    // Don't throw error - email failure shouldn't break the main flow
    return { success: false, error: error.message, code: error.code };
  }
};

// Send appointment approval email
export const sendAppointmentApprovalEmail = async (appointmentData) => {
  const {
    ownerName,
    ownerEmail,
    petName,
    clinicName,
    appointmentDate,
    appointmentTime,
    service,
    vetName
  } = appointmentData;

  const subject = `Appointment Approved - ${petName} at ${clinicName}`;
  const html = getApprovalEmailTemplate(
    ownerName,
    petName,
    clinicName,
    appointmentDate,
    appointmentTime,
    service,
    vetName
  );

  return await sendEmail(ownerEmail, subject, html);
};

// Send appointment rejection email
export const sendAppointmentRejectionEmail = async (appointmentData) => {
  const {
    ownerName,
    ownerEmail,
    petName,
    clinicName,
    appointmentDate,
    appointmentTime,
    service,
    rejectionReason
  } = appointmentData;

  const subject = `Appointment Update - ${petName} at ${clinicName}`;
  const html = getRejectionEmailTemplate(
    ownerName,
    petName,
    clinicName,
    appointmentDate,
    appointmentTime,
    service,
    rejectionReason
  );

  return await sendEmail(ownerEmail, subject, html);
};

