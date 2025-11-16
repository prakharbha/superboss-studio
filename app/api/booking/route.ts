import { NextRequest, NextResponse } from 'next/server';
import { resend, emailConfig } from '@/lib/resend';
import { client, studiosQuery, equipmentQuery, propsQuery } from '@/lib/sanity';
import { formatCurrency } from '@/lib/utils';
import { generateBookingReference, formatBookingReference } from '@/lib/booking-reference';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studios,
      equipment,
      props,
      date,
      bookingType,
      timeSlots,
      name,
      email,
      phone,
      company,
      message,
      total,
    } = body;

    // Validate required fields
    if (!studios || !date || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Fetch data from Sanity
    const [studiosData, equipmentData, propsData] = await Promise.all([
      client.fetch(studiosQuery),
      client.fetch(equipmentQuery),
      client.fetch(propsQuery),
    ]);

    // Generate unique booking reference
    const bookingReference = generateBookingReference();
    const formattedReference = formatBookingReference(bookingReference);

    // Build email content
    const studiosDetails = studios.map((studioId: string) => {
      const studio = studiosData.find((s: any) => s.id === studioId);
      return studio ? `${studio.name} (${studio.size} ${studio.unit})` : studioId;
    }).join(', ');

    const equipmentDetails = equipment && equipment.length > 0
      ? equipment.map((item: { id: string; quantity: number }) => {
          const eq = equipmentData.find((e: any) => e.id === item.id);
          return eq ? `${eq.name} (Qty: ${item.quantity})` : '';
        }).filter(Boolean).join(', ')
      : 'None';

    const propsDetails = props && props.length > 0
      ? props.map((item: { id: string; quantity: number }) => {
          const prop = propsData.find((p: any) => p.id === item.id);
          return prop ? `${prop.name} (Qty: ${item.quantity})` : '';
        }).filter(Boolean).join(', ')
      : 'None';

    const timeInfo = bookingType === 'fullday'
      ? '8:00 AM - 10:00 PM (Full Day - 14 hours)'
      : timeSlots && timeSlots.length > 0
        ? `${timeSlots[0]} - ${timeSlots[timeSlots.length - 1]} (${timeSlots.length} hours)`
        : 'Not specified';

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      subject: `New Booking Request - ${formattedReference} - ${name}`,
      html: `
        <h2>New Studio Booking Request</h2>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin: 0; color: #111827;">Booking Reference: ${formattedReference}</h3>
        </div>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        
        <h3>Booking Details</h3>
        <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${timeInfo}</p>
        <p><strong>Booking Type:</strong> ${bookingType === 'fullday' ? 'Full Day' : 'Hourly'}</p>
        
        <h3>Selected Items</h3>
        <p><strong>Studios:</strong> ${studiosDetails}</p>
        <p><strong>Equipment:</strong> ${equipmentDetails}</p>
        <p><strong>Props:</strong> ${propsDetails}</p>
        
        <h3>Pricing</h3>
        <p><strong>Total Amount:</strong> ${formatCurrency(total, 'AED')}</p>
        
        ${message ? `<h3>Additional Notes</h3><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
        
        <hr>
        <p><em>Please contact the customer to confirm availability and arrange payment.</em></p>
      `,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send booking email' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    await resend.emails.send({
      from: emailConfig.from,
      to: email,
      subject: `Booking Confirmation - ${formattedReference} - SuperBoss Studio`,
      html: `
        <h2>Thank You for Your Booking Request!</h2>
        
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Your Booking Reference</p>
          <h3 style="margin: 8px 0 0 0; color: #111827; font-size: 24px; letter-spacing: 2px;">${formattedReference}</h3>
        </div>
        
        <p>Dear ${name},</p>
        
        <p>We have received your booking request for <strong>${new Date(date).toLocaleDateString()}</strong>.</p>
        
        <p style="background-color: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; margin: 16px 0;">
          <strong>Important:</strong> Please save your booking reference number <strong>${formattedReference}</strong> for future correspondence.
        </p>
        
        <h3>Your Booking Details</h3>
        <p><strong>Studios:</strong> ${studiosDetails}</p>
        <p><strong>Time:</strong> ${timeInfo}</p>
        <p><strong>Estimated Total:</strong> ${formatCurrency(total, 'AED')}</p>
        
        <h3>What's Next?</h3>
        <ul>
          <li>Our team will review your booking request</li>
          <li>We'll call you within 24 hours to confirm availability</li>
          <li>We'll discuss payment options and finalize your booking</li>
          <li>You'll receive a confirmation email once everything is set</li>
        </ul>
        
        <p>If you have any questions, please contact us and mention your booking reference <strong>${formattedReference}</strong>:</p>
        <p>📞 Phone: +971 56 156 1570</p>
        <p>📧 Email: info@superbossstudio.com</p>
        
        <p>Best regards,<br>SuperBoss Studio Team</p>
      `,
    });

    return NextResponse.json(
      { success: true, messageId: data?.id, bookingReference: formattedReference },
      { status: 200 }
    );
  } catch (error) {
    console.error('Booking form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

