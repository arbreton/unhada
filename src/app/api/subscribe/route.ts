import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getNewsletterWelcomeEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Send a welcome email
        await resend.emails.send({
            from: 'magia@resend.dev', // Can be customized once domain is verified
            to: email,
            subject: '🌿 Bienvenida al Bosque de Unhada',
            html: getNewsletterWelcomeEmail(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Resend Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
