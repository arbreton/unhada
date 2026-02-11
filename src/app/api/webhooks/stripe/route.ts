import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { getPurchaseReceiptEmail } from '@/lib/email-templates';
import { getProductDownloadUrl } from '@/lib/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Dual-mode secrets
const webhookSecretLive = process.env.STRIPE_WEBHOOK_SECRET_LIVE;
const webhookSecretSandbox = process.env.STRIPE_WEBHOOK_SECRET_SANDBOX;
// Fallback to legacy var if specific ones aren't set
const webhookSecretLegacy = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    let event: Stripe.Event | undefined;

    // Helper to try verification
    const tryVerify = (secret: string) => {
        try {
            return stripe.webhooks.constructEvent(body, signature!, secret);
        } catch (e) {
            return undefined;
        }
    };

    try {
        if (!signature) {
            throw new Error('No signature found');
        }

        // 1. Try Sandbox Secret (most likely for testing)
        if (webhookSecretSandbox) {
            event = tryVerify(webhookSecretSandbox);
        }

        // 2. Try Live Secret
        if (!event && webhookSecretLive) {
            event = tryVerify(webhookSecretLive);
        }

        // 3. Try Legacy Secret
        if (!event && webhookSecretLegacy) {
            event = tryVerify(webhookSecretLegacy);
        }

        // 4. Dev Mode Override (if NO secrets are set locally)
        if (!event && !webhookSecretLive && !webhookSecretSandbox && !webhookSecretLegacy) {
            console.warn('⚠️  No Webhook Secrets found. Skipping verification (DEV ONLY).');
            // In a real scenario we'd throw, but for dev flow:
            // We can't actually construct the event without a secret unless we mock it, 
            // but stripe.webhooks.constructEvent needs a valid secret to parse.
            // We will assume if we are here, we are screwed unless we catch the error below.
            throw new Error('Missing all Webhook Secrets');
        }

        if (!event) {
            throw new Error('Signature verification failed for all available secrets.');
        }

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
