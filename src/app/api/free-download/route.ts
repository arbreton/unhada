import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getFreeDownloadEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, productId } = await request.json();

    if (!email || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine content based on Product ID
    let subject = '🎁 Tu Regalo de Unhada';
    let downloadLink = 'https://example.com/download-placeholder.pdf'; // TODO: Replace with real link
    let productName = 'Regalo Mágico';

    if (productId === 'self-love-ritual') {
      subject = '✨ Tu Guía de Rituales de Amor Propio';
      productName = 'Rituales de Amor Propio (7 Días)';
      // Typically you would host this file in public/downloads/ or AWS S3
    }

    // Send the email
    await resend.emails.send({
      from: 'magia@resend.dev', // Determine verified sender
      to: email,
      subject: subject,
      html: getFreeDownloadEmail(productName, downloadLink),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Free Download Error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
