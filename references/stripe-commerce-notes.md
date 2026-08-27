# Stripe commerce implementation notes

- Source: https://docs.stripe.com/api/checkout/sessions/create (accessed 2026-08-27)
- One-time checkout uses `mode=payment`, `line_items[].price`, `line_items[].quantity`, and dynamic `success_url` / `cancel_url`.
- `client_reference_id` and `metadata` can reconcile a Checkout Session with the site's internal order.

- Source: https://docs.stripe.com/webhooks (accessed 2026-08-27)
- Stripe webhook endpoints must be publicly accessible HTTPS URLs when registered.
- The handler must verify `Stripe-Signature` using the endpoint signing secret and the unmodified raw request body.
- Webhook processing should return a successful 2xx response promptly; fulfillment should be based on webhook events rather than only the success URL.
- The current project route will be `/api/stripe/webhook`, matching the Stripe integration setup guidance.
