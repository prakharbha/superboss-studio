import { NextRequest, NextResponse } from 'next/server';
import { resend, emailConfig } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Send notification email to business
    const { error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      subject: 'Catalog Download Request',
      html: `
        <h2>New Catalog Download</h2>
        <p>Someone has downloaded the studio catalog.</p>
        
        <h3>Contact Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        
        <hr>
        <p><em>Follow up with this lead to discuss their requirements.</em></p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Catalog download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

