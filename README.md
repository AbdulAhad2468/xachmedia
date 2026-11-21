# Xach Media — Official Main Website

This repository contains Xach Media’s main official agency website. Future work should preserve its role as the primary brand website and keep the client experience clear, welcoming, and easy to use.

## Brand facts

- Agency: Xach Media
- CEO: Abdul Hadi Khan
- Email: xachmedia@gmail.com
- Phone / WhatsApp: +92 345 3186700
- Services: social media management, reels and content creation, online business presence, and page growth
- Visual identity: supplied purple metallic logo and black/purple brand artwork

## Website experience

Responsive Next.js site with a dimensional brand scene, coordinated section transitions, a motion pause control, and reduced-motion support. Decorative animation pauses outside the viewport and when the page is hidden.

On mobile, the site has a swipeable concept gallery, compact service choices, accessible animated navigation, and quick contact actions. The FAQ uses animated, keyboard-accessible disclosures. A rounded purple X favicon is supplied as SVG and PNG, with an Apple touch icon.

Creative examples are labelled studio concepts and should not be presented as client results. Add real case studies, testimonials, or numerical results only when supplied or verified.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The project form prepares a reviewable brief with WhatsApp, email, and copy options; it does not send messages automatically. Direct email, phone, and WhatsApp links are included.

## Production

```bash
npm run build
npm start
```

Stop the dev server before a production build so both commands do not write to the same generated cache. The `.next` directory and local preview screenshots are excluded from Git.
