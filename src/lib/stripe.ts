import Stripe from 'stripe';

// ─── Mode Switch ────────────────────────────────────────────
// Set STRIPE_MODE=sandbox or STRIPE_MODE=live in .env.local
const mode = (process.env.STRIPE_MODE || 'live') as 'sandbox' | 'live';

const isSandbox = mode === 'sandbox';

// ─── Key Selection ──────────────────────────────────────────
export const stripeSecretKey = isSandbox
    ? process.env.STRIPE_SECRET_KEY_SANDBOX!
    : process.env.STRIPE_SECRET_KEY_LIVE!;

export const stripePublishableKey = isSandbox
    ? process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_SANDBOX!
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE!;

export const stripeWebhookSecret = isSandbox
    ? process.env.STRIPE_WEBHOOK_SECRET_SANDBOX!
    : process.env.STRIPE_WEBHOOK_SECRET_LIVE!;

// ─── Stripe Client ─────────────────────────────────────────
export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-01-27.acacia' as any,
});

export { mode as stripeMode, isSandbox };
