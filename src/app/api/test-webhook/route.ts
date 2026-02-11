import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getPurchaseReceiptEmail } from '@/lib/email-templates';
import { stripeSecretKey, stripeWebhookSecret, stripeMode } from '@/lib/stripe';

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

    // 1. Get query param for email
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'andrerbreton@gmail.com'; // Default to verified email

    // DEBUG: Check Environment Variables (Safe Mode)
    const debugInfo = {
        stripeMode: stripeMode,
        resendKey: process.env.RESEND_API_KEY ? `Present (${process.env.RESEND_API_KEY.substring(0, 4)}...)` : 'MISSING',
        stripeKey: stripeSecretKey ? `Present (${stripeSecretKey.substring(0, 7)}...)` : 'MISSING',
        webhookSecret: stripeWebhookSecret ? `Present (${stripeWebhookSecret.substring(0, 7)}...)` : 'MISSING',
        nodeEnv: process.env.NODE_ENV,
    };

    console.log("🔍 Debug Info:", debugInfo);

    try {
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'RESEND_API_KEY is missing in environment variables.',
                debug: debugInfo
            }, { status: 500 });
        }

        const { data, error } = await resend.emails.send({
            from: 'magia@unhada.life', // Try production domain
            // from: 'onboarding@resend.dev', // Fallback if domain not verified
            to: email,
            subject: '✨ DEBUG: Test Email from Unhada.life',
            html: `
                <h1>Debug Success!</h1>
                <p>Environment variables status:</p>
                <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
                <p>If you see this, Resend is working.</p>
            `
        });

        if (error) {
            return NextResponse.json({
                success: false,
                error: error,
                debug: debugInfo
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Test email sent to ${email}`,
            resendId: data?.id,
            debug: debugInfo
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message,
            debug: debugInfo
        }, { status: 500 });
    }
}
