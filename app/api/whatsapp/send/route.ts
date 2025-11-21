import { NextRequest, NextResponse } from 'next/server';

/**
 * WhatsApp Business API Integration
 * 
 * This endpoint sends messages from the website chat to your WhatsApp Business account.
 * 
 * Setup Options:
 * 
 * Option 1: WhatsApp Cloud API (Free - Recommended)
 * 1. Go to https://developers.facebook.com/
 * 2. Create a Meta App
 * 3. Add WhatsApp product
 * 4. Get your Phone Number ID and Access Token
 * 5. Add to .env.local:
 *    WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
 *    WHATSAPP_ACCESS_TOKEN=your_access_token
 *    WHATSAPP_BUSINESS_NUMBER=971561561570 (your WhatsApp Business number)
 * 
 * Option 2: Twilio WhatsApp API (Paid - Easier setup)
 * 1. Sign up at https://www.twilio.com/
 * 2. Get WhatsApp Sandbox or Production credentials
 * 3. Add to .env.local:
 *    TWILIO_ACCOUNT_SID=your_account_sid
 *    TWILIO_AUTH_TOKEN=your_auth_token
 *    TWILIO_WHATSAPP_FROM=whatsapp:+14155238886 (or your Twilio WhatsApp number)
 *    WHATSAPP_BUSINESS_NUMBER=971561561570
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const whatsappBusinessNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '971561561570';
    
    // Format the message for WhatsApp
    const whatsappMessage = `*New Message from SuperBoss Studio Website*

*Name:* ${name}
*Email:* ${email}${phone ? `\n*Phone:* ${phone}` : ''}

*Message:*
${message}

---
_This message was sent from the website chat._`;

    // Try WhatsApp Cloud API first (if configured)
    if (process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN) {
      try {
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
        const toNumber = `971${whatsappBusinessNumber.replace(/[^0-9]/g, '')}`;

        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: toNumber,
              type: 'text',
              text: {
                body: whatsappMessage,
              },
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          return NextResponse.json(
            { success: true, message: 'Message sent to WhatsApp successfully' },
            { status: 200 }
          );
        } else {
          console.error('WhatsApp Cloud API error:', data);
          // Fall through to Twilio or email fallback
        }
      } catch (error) {
        console.error('WhatsApp Cloud API request failed:', error);
        // Fall through to Twilio or email fallback
      }
    }

    // Try Twilio WhatsApp API (if configured)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
      try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const from = process.env.TWILIO_WHATSAPP_FROM;
        const to = `whatsapp:+${whatsappBusinessNumber.replace(/[^0-9]/g, '')}`;

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              From: from,
              To: to,
              Body: whatsappMessage,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          return NextResponse.json(
            { success: true, message: 'Message sent to WhatsApp successfully' },
            { status: 200 }
          );
        } else {
          console.error('Twilio WhatsApp API error:', data);
        }
      } catch (error) {
        console.error('Twilio WhatsApp API request failed:', error);
      }
    }

    // Fallback: Return success but log that WhatsApp API is not configured
    // The frontend will still show the WhatsApp link as fallback
    console.warn('WhatsApp API not configured. Message details:', {
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message received. WhatsApp API not configured - please set up WhatsApp Cloud API or Twilio.',
        fallback: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

