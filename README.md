# VantageMind AI

Marketing site for VantageMind AI and Luciel.

## Environment variables

Reserved for the operator. Set in the deployment environment; do not commit real values.

- `VITE_LUCIEL_MARKETING_EMBED_KEY` — marketing-scope embed key for the Luciel widget on `/products/luciel`. When unset, the widget script is not injected.
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (test mode in preview, live in production). Used by client-side checkout once Step 30a ships.
- `STRIPE_SECRET_KEY` — Stripe secret key. **Server-side only**, never exposed to the client.
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret. **Server-side only.**
- `VITE_WAITLIST_WEBHOOK_URL` — optional. When set, waitlist and demo-request submissions POST raw JSON here instead of falling back to Web3Forms. Point at Supabase / Formspree / a custom edge function.
- `VITE_CALENDLY_URL` — optional. When set, the Contact page embeds Calendly below the form.
- `VITE_ANALYTICS_KEY` — optional. Reserved for Plausible / PostHog / GA4. When unset, analytics is a no-op.
