# WhatsApp Business Integration Setup Guide

This guide will help you connect your website chat to your WhatsApp Business account so that messages from visitors go directly to your WhatsApp Business number.

## Overview

The integration supports two methods:
1. **WhatsApp Cloud API** (Free - Recommended) - Meta's official WhatsApp Business API
2. **Twilio WhatsApp API** (Paid) - Easier setup, requires Twilio account

## Option 1: WhatsApp Cloud API (Free - Recommended)

### Step 1: Create Meta Business Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Sign in with your Facebook account
3. Create a new app or use an existing one

### Step 2: Add WhatsApp Product
1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard

### Step 3: Get Your Credentials
1. Go to WhatsApp → API Setup
2. You'll need:
   - **Phone Number ID**: Found in the API Setup section
   - **Access Token**: Temporary token (24 hours) or Permanent token
   - **Business Phone Number**: Your WhatsApp Business number (e.g., 971561561570)

### Step 4: Configure Environment Variables
Add these to your `.env.local` file:

```env
# WhatsApp Cloud API Configuration
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_BUSINESS_NUMBER=971561561570
```

### Step 5: Get Permanent Access Token (Optional but Recommended)
1. Go to WhatsApp → API Setup → Access Tokens
2. Create a System User Token for permanent access
3. Replace the temporary token with the permanent one

### Step 6: Test the Integration
1. Visit your website
2. Open the chat widget
3. Send a test message
4. Check your WhatsApp Business account - you should receive the message!

## Option 2: Twilio WhatsApp API (Paid - Easier Setup)

### Step 1: Create Twilio Account
1. Sign up at [Twilio](https://www.twilio.com/)
2. Verify your account

### Step 2: Enable WhatsApp
1. Go to Messaging → Try it out → Send a WhatsApp message
2. Join the WhatsApp Sandbox (for testing) or request a production number
3. Get your credentials:
   - **Account SID**
   - **Auth Token**
   - **WhatsApp From Number** (format: `whatsapp:+14155238886`)

### Step 3: Configure Environment Variables
Add these to your `.env.local` file:

```env
# Twilio WhatsApp API Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_BUSINESS_NUMBER=971561561570
```

### Step 4: Test the Integration
1. Visit your website
2. Open the chat widget
3. Send a test message
4. Check your WhatsApp Business account

## How It Works

1. **Visitor sends message** on your website chat widget
2. **Message is sent** to `/api/whatsapp/send` endpoint
3. **API forwards message** to your WhatsApp Business account
4. **You receive message** directly in your WhatsApp Business app
5. **You can reply** from WhatsApp Business, and the visitor can continue the conversation

## Important Notes

- **WhatsApp Cloud API** is free but requires Meta Business Account verification
- **Twilio** offers a free trial but charges per message after that
- Messages are sent from the website to your WhatsApp Business number
- You can reply directly from your WhatsApp Business app
- The integration works in both directions (website → WhatsApp and WhatsApp → website if you set up webhooks)

## Troubleshooting

### Messages not arriving?
1. Check your environment variables are set correctly
2. Verify your access token is valid (not expired)
3. Check browser console for errors
4. Verify your WhatsApp Business number format (should be without + sign, e.g., `971561561570`)

### API errors?
1. Check server logs for detailed error messages
2. Verify API credentials are correct
3. For WhatsApp Cloud API, ensure your app is approved and phone number is verified

## Next Steps (Optional)

To enable two-way messaging (replies from WhatsApp appear on website):
1. Set up webhooks in your WhatsApp Business API
2. Create a webhook endpoint to receive incoming messages
3. Update the chat component to display incoming messages

## Support

For issues with:
- **WhatsApp Cloud API**: Check [Meta's Documentation](https://developers.facebook.com/docs/whatsapp)
- **Twilio**: Check [Twilio's Documentation](https://www.twilio.com/docs/whatsapp)

