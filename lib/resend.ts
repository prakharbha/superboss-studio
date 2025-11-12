import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const emailConfig = {
  from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', // Use your verified domain
  to: process.env.CONTACT_EMAIL || 'info@superbossstudio.com',
};

