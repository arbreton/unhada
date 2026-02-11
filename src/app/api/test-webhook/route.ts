import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getPurchaseReceiptEmail } from '@/lib/email-templates';

// MOCK DATA for testing
const MOCK_SESSION = {
    customer_details: {
        email: 'andrerbreton@gmail.com', // Updated per user request
        name: 'Tester Hada'
    }
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
    // This route simulates what the Stripe Webhook receives and does
    // It bypasses Stripe signature verification to allow local testing

    // 1. Get query param for email (optional)
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || MOCK_SESSION.customer_details.email;

    try {
        console.log(`🧪 Testing Paid Email delivery to: ${email}`);

        // 2. Generate Email HTML (Simulate fetching from products.ts)
        const products = [
            { name: 'Carta Astral & Biohacking', link: 'https://example.com/carta-astral-biohacking.pdf' },
            { name: 'Audio de Meditación Guiada', link: 'https://example.com/meditacion-guiada.mp3' }
        ];

        const emailHtml = getPurchaseReceiptEmail(MOCK_SESSION.customer_details.name, 'TEST-123', products);

        // 3. Send via Resend
        const data = await resend.emails.send({
            from: 'magia@resend.dev',
            to: email,
            subject: '✨ [TEST] Tu Magia ha llegado!',
            html: emailHtml,
        });

        return NextResponse.json({
            success: true,
            message: `Test email sent to ${email}`,
            resendId: data.data?.id
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
