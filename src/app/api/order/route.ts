import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // DEV MOCK: Allow browser testing of Success Page without real Stripe ID
    if (process.env.NODE_ENV === 'development' && sessionId === 'dev_mock_123') {
        return NextResponse.json({
            status: 'complete',
            customer_email: 'andrerbreton@gmail.com', // Updated to verify user request
            customer_name: 'Andre Breton',
            amount_total: 2000,
            currency: 'usd',
            items: [
                { id: '1', description: 'Carta Astral & Biohacking (Mock)', amount_total: 1500, currency: 'usd' },
                { id: '2', description: 'Audio de Meditación (Mock)', amount_total: 500, currency: 'usd' }
            ],
            payment_status: 'paid',
        });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items'],
        });

        return NextResponse.json({
            status: session.status,
            customer_email: session.customer_details?.email,
            customer_name: session.customer_details?.name,
            amount_total: session.amount_total,
            currency: session.currency,
            items: session.line_items?.data || [],
            payment_status: session.payment_status,
        });
    } catch (error: any) {
        console.error('Stripe Retrieve Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
