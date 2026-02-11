
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
});

async function inspectLastOrder() {
    console.log("🔍 Fetching latest Stripe Checkout Session...");

    try {
        // 1. List valid sessions
        const sessions = await stripe.checkout.sessions.list({
            limit: 1,
        });

        if (sessions.data.length === 0) {
            console.log("❌ No sessions found in this Stripe account.");
            return;
        }

        const sessionId = sessions.data[0].id;
        console.log(`\n📄 Found Session ID: ${sessionId}`);

        // 2. Retrieve details with expansion
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'line_items.data.price.product']
        });

        console.log(`   Status: ${session.status} | Payment: ${session.payment_status}`);
        console.log(`   Customer: ${session.customer_details?.email}`);

        if (session.line_items?.data) {
            console.log("   🛒 Line Items:");
            for (const item of session.line_items.data) {
                const product = item.price?.product as Stripe.Product;
                console.log(`      - ${item.description} (${item.amount_total / 100} ${item.currency.toUpperCase()})`);

                // Check Metadata
                if (!product.metadata) {
                    console.log("        ❌ NO METADATA FOUND ON PRODUCT OBJECT");
                } else {
                    console.log(`        Metadata:`, JSON.stringify(product.metadata, null, 2));
                    if (!product.metadata.productId) {
                        console.error("        ❌ ERROR: productId missing in metadata! Webhook will fail.");
                    } else {
                        console.log("        ✅ productId found:", product.metadata.productId);
                    }
                }
            }
        }

    } catch (error: any) {
        console.error("❌ Stripe API Error:", error.message);
    }
}

inspectLastOrder();
