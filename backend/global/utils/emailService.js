import dotenv from 'dotenv';
import brevo from "@getbrevo/brevo";

dotenv.config();

// Brevo (Sendinblue) configuration
const getBrevoConfig = () => {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim() || 'noreply@sendinblue.com';
  const fromName = process.env.BREVO_FROM_NAME?.trim() || 'VetSync';

  if (!apiKey) {
    throw new Error('BREVO_API_KEY must be set in .env file');
  }

  // Validate API key format (should start with 'xkeysib-')
  if (!apiKey.startsWith('xkeysib-')) {
    console.warn('⚠️  Warning: API key format might be incorrect. Brevo API keys usually start with "xkeysib-"');
  }

  return {
    apiKey,
    fromEmail,
    fromName
  };
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

// Send email function using Brevo (Sendinblue) API
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    // Check if Brevo is configured
    let brevoConfig;
    try {
      brevoConfig = getBrevoConfig();
    } catch (configError) {
      console.warn('Brevo not configured. Skipping email send.');
      console.warn('To enable emails, set BREVO_API_KEY in your .env file');
      console.warn('For Brevo free tier setup:');
      console.warn('1. Sign up at https://www.brevo.com/');
      console.warn('2. Get your API key from Brevo dashboard (Settings → API Keys)');
      console.warn('3. Add BREVO_API_KEY to .env');
      console.warn('4. Optionally set BREVO_FROM_EMAIL and BREVO_FROM_NAME');
      return { success: false, message: 'Email service not configured' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error('Invalid recipient email format:', to);
      return { success: false, error: 'Invalid recipient email format' };
    }

    // Initialize Brevo client with API key
    const apiInstance = new brevo.TransactionalEmailsApi();
    
    // Set API key for authentication
    // Try multiple methods for compatibility
    if (apiInstance.setApiKey) {
      apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoConfig.apiKey);
    } else if (apiInstance.authentications && apiInstance.authentications['api-key']) {
      apiInstance.authentications['api-key'].apiKey = brevoConfig.apiKey;
    } else {
      // Direct assignment as fallback
      apiInstance.apiKey = brevoConfig.apiKey;
    }

    // Generate plain text version from HTML if not provided
    const plainText = text || html.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n').trim();

    // Prepare email data
    const sendSmtpEmail = {
      sender: { 
        email: brevoConfig.fromEmail, 
        name: brevoConfig.fromName 
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
      textContent: plainText
    };

    // Send email via Brevo API
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log('✅ Email sent successfully via Brevo:', response.messageId);
    return { 
      success: true, 
      messageId: response.messageId,
      provider: 'brevo'
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
    // Provide helpful error guidance
    if (error.response) {
      console.error('Brevo API error details:', error.response.body || error.response.text);
    }
    
    // Log API key preview for debugging (first 10 chars only)
    const apiKeyPreview = brevoConfig?.apiKey ? `${brevoConfig.apiKey.substring(0, 10)}...` : 'not set';
    console.error('API Key preview:', apiKeyPreview);
    
    console.error('\n🔧 Brevo Setup Troubleshooting:');
    console.error('1. Verify BREVO_API_KEY in .env is correct (get it from: https://app.brevo.com/settings/keys/api)');
    console.error('2. Make sure there are NO spaces or quotes around the API key in .env');
    console.error('3. The API key should look like: xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.error('4. Check your Brevo account has available credits (free tier: 300 emails/day)');
    console.error('5. Verify BREVO_FROM_EMAIL is set (or uses default)');
    console.error('6. Make sure your Brevo account is verified');
    console.error('7. Restart your server after updating .env file');
    console.error('\n💡 Note: You only need the API KEY, NOT the SMTP credentials for this setup.');
    console.error('   SMTP credentials are for a different method (nodemailer), not needed here.');
    
    // Don't throw error - email failure shouldn't break the main flow
    return { 
      success: false, 
      error: error.message || 'Failed to send email',
      details: error.response?.body || error.response?.text,
      statusCode: error.response?.statusCode || error.statusCode
    };
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

