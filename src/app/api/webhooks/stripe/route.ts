import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getPurchaseReceiptEmail } from '@/lib/email-templates';
import { getProductDownloadUrl } from '@/lib/products';
import { stripe, stripeWebhookSecret, stripeMode } from '@/lib/stripe';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    let event: Stripe.Event | undefined;

    try {
        if (!signature) {
            throw new Error('No signature found');
        }

        if (!stripeWebhookSecret) {
            throw new Error(`Missing STRIPE_WEBHOOK_SECRET for mode: ${stripeMode}`);
        }

        event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);

    } catch (err: any) {
        console.error(`❌ Webhook Error: ${err.message}`);

        // CRITICAL DEPLOYMENT FIX:
        // Try to send an email to the admin explaining why the webhook failed.
        // This is necessary because we cannot see Vercel logs easily.
        try {
            await resend.emails.send({
                from: 'magia@unhada.life',
                to: 'andrerbreton@gmail.com',
                subject: '🚨 Webhook Failed: Unhada.life',
                html: `
                    <h1>Stripe Webhook Failed</h1>
                    <p><strong>Error Message:</strong> ${err.message}</p>
                    <p><strong>Common Causes:</strong></p>
                    <ul>
                        <li><strong>Signature Mismatch:</strong> The STRIPE_WEBHOOK_SECRET in Vercel does not match the mode (Test vs Live) of the event.</li>
                        <li><strong>Malformed Payload:</strong> The request body was not what Stripe expects.</li>
                    </ul>
                    <p>Please check your Vercel Environment Variables.</p>
                `
            });
        } catch (e) {
            console.error('Failed to send error email:', e);
        }

        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name || 'Hada';

        if (customerEmail) {
            try {
                // Retrieve the session with line items expanded to get metadata
                const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
                    expand: ['line_items', 'line_items.data.price.product']
                });

                const products: { name: string, link: string }[] = [];

                if (fullSession.line_items?.data) {
                    for (const item of fullSession.line_items.data) {
                        const product = item.price?.product as Stripe.Product;
                        const productId = product.metadata.productId;

                        if (productId) {
                            const downloadUrl = getProductDownloadUrl(productId);
                            if (downloadUrl) {
                                products.push({
                                    name: item.description || 'Producto Mágico',
                                    link: downloadUrl
                                });
                            }
                        }
                    }
                }

                if (products.length === 0) {
                    products.push({ name: 'Acceso a tu Magia (Contactar Soporte)', link: 'mailto:soporte@unhada.life' });
                }

                // Provide order number (using session ID last 6 chars for brevity)
                const orderNum = session.id.slice(-6).toUpperCase();

                await resend.emails.send({
                    from: 'magia@unhada.life',
                    to: customerEmail,
                    subject: '✨ ¡Tu Magia ha llegado!',
                    html: getPurchaseReceiptEmail(customerName, orderNum, products),
                });
                console.log(`✅ Email sent to ${customerEmail}`);
            } catch (emailError: any) {
                console.error('❌ Failed to send email:', emailError);
                // DEBUG: Email Admin on Send Failure
                await resend.emails.send({
                    from: 'magia@unhada.life',
                    to: 'andrerbreton@gmail.com',
                    subject: '🚨 CRITICAL: Failed to send Customer Email',
                    html: `<p>Error: ${emailError.message}</p>`
                });
            }
        } else {
            // DEBUG: Email Admin on Missing Customer Email
            await resend.emails.send({
                from: 'magia@unhada.life',
                to: 'andrerbreton@gmail.com',
                subject: '⚠️ Debug: Session Missing Email',
                html: `<p>Session ID: ${session.id}</p><p>No customer_details.email found.</p>`
            });
        }
    } else {
        // DEBUG: Email Admin on Ignored Event Type
        // This validates that we ARE receiving events, just wrong ones.
        await resend.emails.send({
            from: 'magia@unhada.life',
            to: 'andrerbreton@gmail.com',
            subject: `🔎 Debug: Ignored Event (${event.type})`,
            html: `<p>Received event: <strong>${event.type}</strong></p><p>We are only listening for 'checkout.session.completed'. Check Stripe Dashboard > Webhooks.</p>`
        });
    }

    return NextResponse.json({ received: true });
}

// Diagnostic GET - verify this endpoint is reachable
export async function GET() {
    return NextResponse.json({
        status: 'Webhook endpoint is live',
        stripeMode,
        webhookSecretPresent: !!stripeWebhookSecret,
        webhookSecretPrefix: stripeWebhookSecret ? stripeWebhookSecret.substring(0, 10) + '...' : 'MISSING',
        timestamp: new Date().toISOString(),
    });
}
