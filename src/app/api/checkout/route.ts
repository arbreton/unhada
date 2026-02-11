import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { products } from '@/lib/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    // Map items to line_items
    // Verify items against products.ts source of truth
    const lineItems = items.map((item: any) => {
      // Find main product or upsell
      let productData = null;
      let isUpsell = false;

      for (const p of products) {
        if (p.id === item.id) {
          productData = p;
          break;
        }
        if (p.upsell && p.upsell.id === item.id) {
          productData = p.upsell;
          isUpsell = true;
          break;
        }
      }

      if (!productData || productData.price === 0) return null;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productData.name,
            metadata: {
              productId: productData.id // CRITICAL: This allows the Webhook to know what was bought
            }
          },
          unit_amount: productData.price,
        },
        quantity: 1,
      };
    }).filter(Boolean);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'No payable items selected' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/?canceled=true`,
      automatic_tax: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
