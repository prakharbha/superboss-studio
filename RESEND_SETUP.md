# Resend Email Setup Guide

This guide will help you set up Resend for email functionality in your SuperBoss Studio website.

## 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a **free account** (3,000 emails/month, 100 emails/day)
3. Verify your email address

## 2. Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "SuperBoss Studio")
5. Copy the API key (it starts with `re_`)

## 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# Resend API Configuration
RESEND_API_KEY=re_your_actual_api_key_here

# Email Configuration
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_EMAIL=info@superbossstudio.com
```

**Important Notes:**
- Replace `re_your_actual_api_key_here` with your actual API key
- For testing, you can use `onboarding@resend.dev` as the FROM email
- Update `CONTACT_EMAIL` to your actual business email

## 4. Verify Your Domain (Optional but Recommended)

For production use, you should verify your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `superbossstudio.com`)
4. Add the DNS records provided by Resend to your domain
5. Wait for verification (usually takes a few minutes)
6. Once verified, update `.env.local`:
   ```
   RESEND_FROM_EMAIL=noreply@superbossstudio.com
   ```

## 5. Test the Integration

### Test Contact Form:
1. Start your dev server: `npm run dev`
2. Go to `/contact`
3. Fill out and submit the form
4. Check your email (the one set in `CONTACT_EMAIL`)

### Test Booking Form:
1. Go to `/book`
2. Complete all steps and submit
3. Check your email for booking notification
4. The customer should also receive a confirmation email

## 6. Email Features Implemented

### Contact Form (`/contact`)
- Sends email to your business email
- Includes all form fields
- Reply-to set to customer's email

### Booking Form (`/book`)
- Sends detailed booking request to your business email
- Includes:
  - Customer information
  - Selected studios, equipment, and props
  - Date, time, and booking type (hourly/full day)
  - Total pricing
  - Additional notes
- Sends confirmation email to customer
- Reply-to set to customer's email

## 7. Free Plan Limits

Resend Free Plan includes:
- ✅ 3,000 emails per month
- ✅ 100 emails per day
- ✅ 1 verified domain
- ✅ All email APIs
- ✅ Email logs and analytics

This should be more than enough for testing and initial launch!

## 8. Monitoring

View email logs in Resend dashboard:
1. Go to **Logs** section
2. See all sent emails
3. Check delivery status
4. View email content

## 9. Troubleshooting

### Emails not sending?
- Check your API key is correct in `.env.local`
- Restart your dev server after adding `.env.local`
- Check Resend dashboard logs for errors
- Verify your FROM email is correct

### Emails going to spam?
- Verify your domain in Resend
- Add SPF, DKIM, and DMARC records
- Use a professional FROM email address

### Rate limiting?
- Free plan: 100 emails/day
- If you hit the limit, upgrade to paid plan or wait 24 hours

## 10. Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform:
   ```
   RESEND_API_KEY=re_your_api_key
   RESEND_FROM_EMAIL=noreply@superbossstudio.com
   CONTACT_EMAIL=info@superbossstudio.com
   ```

2. Make sure your domain is verified in Resend

3. Test the forms after deployment

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- Resend Discord: https://resend.com/discord

---

**Note:** Never commit your `.env.local` file to Git. It's already in `.gitignore`.

