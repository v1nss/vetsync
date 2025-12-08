import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend client (will be created lazily if API key is available)
let resend = null;

const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (apiKey) {
      resend = new Resend(apiKey);
    }
  }
  return resend;
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
    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev';
    
    if (!resendApiKey) {
      console.warn('Resend API key not configured. Skipping email send.');
      console.warn('To enable emails, set RESEND_API_KEY in your .env file');
      return { success: false, message: 'Email service not configured' };
    }

    // Validate email format for recipient
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      console.error('Invalid recipient email format:', to);
      return { success: false, error: 'Invalid recipient email format' };
    }

    // Get Resend client
    const resendClient = getResendClient();
    if (!resendClient) {
      return { success: false, error: 'Resend client not initialized' };
    }

    // Send email using Resend
    const { data, error } = await resendClient.emails.send({
      from: fromEmail,
      to: to,
      subject: subject,
      html: html,
      ...(text && { text: text }),
    });

    if (error) {
      console.error('❌ Error sending email via Resend:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    console.log('✅ Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    
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

