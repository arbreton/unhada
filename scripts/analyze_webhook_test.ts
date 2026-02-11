
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function run() {
    const payload = {
        id: 'evt_test_webhook_' + Date.now(),
        object: 'event',
        type: 'checkout.session.completed',
        created: Math.floor(Date.now() / 1000),
        data: {
            object: {
                id: 'cs_test_simulate_' + Date.now(),
                object: 'checkout.session',
                customer_details: {
                    email: 'andrerbreton@gmail.com', // Tested & Working email
                    name: 'Andre Breton'
                },
                payment_status: 'paid',
                status: 'complete',
                line_items: {
                    data: [
                        // We can't easily mock expanded items here without complex setup
                        // But our webhook fetches from Stripe.
                        // So we need a REAL session ID or we need to mock the fetch in the webhook?
                        // The webhook calls stripe.checkout.sessions.retrieve(session.id)
                        // If we send a fake ID, the webhook will fail at retrieval.
                    ]
                }
            }
        }
    };

    // PROBLEM: The production webhook tries to call Stripe API with the session ID.
    // If I send a fake Session ID, the production server will try to fetch it from Stripe and get 404.
    // So this test will fail with "No such checkout session" in the logs (which we can't see), 
    // or unhandled promise rejection.

    console.log("Cannot fully simulate without a real session ID because the webhook fetches data from Stripe.");
}

run();
