
import Stripe from 'stripe';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Initialize services with local keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
});
const resend = new Resend(process.env.RESEND_API_KEY);

// The real session ID observed in browser
const SESSION_ID = 'cs_test_a1O3UvYyMsWcbOKgIreypqZVLHG00UxVhMbKb0602DxkOR96wrTOxjqUxO';

// --- Shared Logic from src/lib/products.ts ---
const products = [
    {
        id: 'astral-chart',
        name: 'Tu Carta Astral & Biohacking',
        price: 1500,
        downloadUrl: 'https://example.com/carta-astral-biohacking.pdf',
        upsell: {
            id: 'meditation-audio',
            name: 'Audio de Meditación Guiada',
            price: 500,
            downloadUrl: 'https://example.com/meditacion-guiada.mp3'
        }
    }
    // ... (other products omitted for brevity, focusing on astral-chart)
];

function getProductDownloadUrl(productId: string): string | null {
    for (const p of products) {
        if (p.id === productId) return p.downloadUrl;
        if (p.upsell && p.upsell.id === productId) return p.upsell.downloadUrl;
    }
    return null;
}
// ---------------------------------------------

// --- Shared Logic from src/lib/email-templates.ts ---
function getPurchaseReceiptEmail(customerName: string, orderNumber: string, products: { name: string, link: string }[]): string {
    return `
    <html><body>
        <h1>Gracias, ${customerName}!</h1>
        <p>Order #${orderNumber}</p>
        <ul>
            ${products.map(p => `<li><a href="${p.link}">${p.name}</a></li>`).join('')}
        </ul>
    </body></html>
    `;
}
// ----------------------------------------------------

async function run() {
    console.log(`🔍 Inspecting Session: ${SESSION_ID}`);

    try {
        // 1. Fetch Session like the Webhook does
        const fullSession = await stripe.checkout.sessions.retrieve(SESSION_ID, {
            expand: ['line_items', 'line_items.data.price.product']
        });

        console.log(`✅ Session Retrieved. Status: ${fullSession.status}`);

        const customerEmail = fullSession.customer_details?.email;
        const customerName = fullSession.customer_details?.name || 'Hada';

        if (!customerEmail) {
            console.error("❌ No customer email found in session!");
            return;
        }

        console.log(`📧 Customer Email: ${customerEmail}`);

        // 2. Extract Products like the Webhook does
        const productsList: { name: string, link: string }[] = [];

        if (fullSession.line_items?.data) {
            for (const item of fullSession.line_items.data) {
                const product = item.price?.product as Stripe.Product;
                const productId = product.metadata.productId;

                console.log(`   - Item: ${item.description}, ID: ${productId}`);

                if (productId) {
                    const downloadUrl = getProductDownloadUrl(productId);
                    if (downloadUrl) {
                        productsList.push({
                            name: item.description || 'Producto Mágico',
                            link: downloadUrl
                        });
                        console.log(`     ✅ Found download URL: ${downloadUrl}`);
                    } else {
                        console.warn(`     ⚠️  No URL found for productId: ${productId}`);
                    }
                } else {
                    console.warn(`     ⚠️  No productId in metadata for this item.`);
                }
            }
        }

        if (productsList.length === 0) {
            console.error("❌ No products to send! Email logic would be skipped/fallback.");
            return;
        }

        // 3. Attempt to Send Email via Resend
        console.log("🚀 Attempting to send email via Resend...");

        const { data, error } = await resend.emails.send({
            from: 'magia@unhada.life', // TRYING PROD DOMAIN IF VERIFIED, OR DEFAULT
            // from: 'onboarding@resend.dev', // Fallback
            to: customerEmail,
            subject: '✨ DEBUG TEST: Tu Magia ha llegado!',
            html: getPurchaseReceiptEmail(customerName, fullSession.id.slice(-6).toUpperCase(), productsList),
        });

        if (error) {
            console.error("❌ RESEND API ERROR:", error);
        } else {
            console.log("✅ RESEND SUCCESS:", data);
        }

    } catch (err: any) {
        console.error("❌ CRITICAL ERROR:", err.message);
    }
}

run();
