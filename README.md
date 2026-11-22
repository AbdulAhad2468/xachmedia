# Xach Media — Official Main Website

This repository contains Xach Media’s main official agency website. Future work should preserve its role as the primary brand website and keep the client experience clear, welcoming, and easy to use.

## Brand facts

- Agency: Xach Media
- Slogan: Turn attention into connection.
- CEO: Abdul Hadi Khan
- Email: info@xachmedia.com
- Phone / WhatsApp: +92 345 3186700
- Services: social media management, reels and content creation, online business presence, and page growth
- Visual identity: supplied purple metallic logo and black/purple brand artwork

## Website experience

Responsive Next.js site with a dimensional brand scene, coordinated section transitions, a motion pause control, and reduced-motion support. Decorative animation pauses outside the viewport and when the page is hidden.

On mobile, the site has a stacked concept gallery, compact service choices, accessible animated navigation, and quick contact actions. The menu locks background scrolling while open. The FAQ uses animated, keyboard-accessible disclosures. A rounded purple X favicon is supplied as SVG and PNG, with an Apple touch icon.

Creative examples are labelled studio concepts and should not be presented as client results. The NŪRA skincare and OFFSCRIPT fashion brands are fictional creative exercises, alongside Xach Media's own motion direction. Each concept includes its rationale and suggested formats. Add real case studies, testimonials, or numerical results only when supplied or verified.

The concept gallery uses a three-column desktop layout, paired artwork and descriptions on tablets, and stacked cards on phones. Filtering keeps the cards mounted so offscreen animation pausing continues to work; native disclosures expose each creative direction to keyboard and touch users. Reduced-motion and the site-wide pause control apply to the new artwork too. The studio name artwork displays Abdul Hadi Khan in full.

## Search-engine files

Next.js metadata routes generate `/sitemap.xml` from `app/sitemap.js` and `/robots.txt` from `app/robots.js`. The sitemap includes the canonical homepage at `https://www.xachmedia.com/`; section anchors are not separate pages. Robots allows public pages and rendering assets, excludes `/api/`, and declares the sitemap. The layout sets the canonical URL and social sharing metadata. Robots directives guide crawlers; they do not restrict API access.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The project form prepares a reviewable brief. Visitors can send it directly through Resend, open a WhatsApp or email draft, or copy it. Nothing is sent until the visitor chooses a send action.

## Resend email setup

The server route `POST /api/contact` sends project enquiries using the Resend HTTP API. No browser SDK or extra package is needed.

1. Add and verify `xachmedia.com` in [Resend Domains](https://resend.com/domains). Add the DNS records shown by Resend to your domain’s DNS provider and wait for the sending domain to be verified. Use the values supplied for your account; do not replace your existing mailbox’s root MX records just to enable sending.
2. Create a Resend API key with **Sending access**, restricted to `xachmedia.com` if desired.
3. Copy `.env.example` to `.env.local`, then add the real API key. Keep `.env.local` out of Git.

```dotenv
RESEND_API_KEY=re_your_actual_resend_key
RESEND_FROM_EMAIL=info@xachmedia.com
CONTACT_TO_EMAIL=info@xachmedia.com
```

| Variable | What it does |
| --- | --- |
| `RESEND_API_KEY` | Secret Resend API key, used only on the server. |
| `RESEND_FROM_EMAIL` | Bare sender address on the verified Resend domain. The email displays as `Xach Media <info@xachmedia.com>`. |
| `CONTACT_TO_EMAIL` | Existing inbox that receives enquiries. Set this to `xachmedia@gmail.com` if your custom inbox is not ready. |

For hosting, add these same three values to the project’s environment settings and redeploy. Locally, restart the Next.js server after changing them. Never prefix the key with `NEXT_PUBLIC_`.

Verifying a domain for sending does not configure the receiving mailbox for this integration. Make sure the inbox named in `CONTACT_TO_EMAIL` can receive mail through your email provider. Visitor replies use the visitor’s email as `Reply-To`; the visitor’s address is never used as the sender.

The form retains the brief on failures and offers retry, WhatsApp, and email-draft options. Retries of the same prepared brief reuse the Resend idempotency key, and concurrent retries share one provider operation. Successful responses include a Resend email reference for delivery troubleshooting.

Rejected sends include a fixed diagnostic `code` in the API response and server log without exposing the provider response or API key. `EMAIL_API_KEY_INVALID` requires replacing the hosting API key; `EMAIL_DOMAIN_NOT_VERIFIED` requires verifying the exact sender domain in Resend; `EMAIL_API_KEY_RESTRICTED` requires checking the key's status and sending-domain access. `EMAIL_TEST_RECIPIENT_RESTRICTED` means the testing sender cannot send to the configured inbox. Quota and provider availability failures have separate codes. A successful API response confirms provider acceptance; use Resend's email delivery event to confirm inbox delivery.

The API validates field lengths, escapes HTML, fixes the recipient in server configuration, and includes a honeypot and a per-process request guard. The normal allowance is five distinct accepted enquiries per visitor email and IP in ten minutes. Retrying a prepared brief does not use another submission slot, and failed provider sends release their slot. A separate thirty-attempt IP ceiling still limits repeated failures. Cooldown responses include the remaining wait in `Retry-After`. These limits are not shared across multiple server instances.

Run the contact checks without an API key or sending real emails:

```bash
npm run test:contact
```

Official references: [Next.js integration](https://resend.com/docs/send-with-nextjs), [email API](https://resend.com/docs/api-reference/emails/send-email), and [domain verification](https://resend.com/docs/dashboard/domains/introduction).

## Production

```bash
npm run build
npm start
```

Stop the dev server before a production build so both commands do not write to the same generated cache. The `.next` directory and local preview screenshots are excluded from Git.
