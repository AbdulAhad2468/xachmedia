import AgencyPage from '../AgencyPage';
export const metadata = {
  "title": "Contact | Xach Media",
  "description": "Contact Xach Media at info@xachmedia.com or +92 345 3186700 for social media management, reels, and creative direction. Tell us about your project.",
  "alternates": {
    "canonical": "/contact"
  },
  "openGraph": {
    "title": "Contact | Xach Media",
    "description": "Contact Xach Media at info@xachmedia.com or +92 345 3186700 for social media management, reels, and creative direction. Tell us about your project.",
    "url": "/contact"
  }
};
const content = {
  "eyebrow": "YOUR NEXT CHAPTER STARTS HERE",
  "title": "Contact Xach Media.",
  "intro": "Tell us your business name, share a page link if you have one, and let us know what you would like to improve.",
  "contact": true,
  "items": [
    {
      "title": "Email the studio",
      "text": "Send your project details or questions directly to our team.",
      "href": "mailto:info@xachmedia.com",
      "label": "info@xachmedia.com"
    },
    {
      "title": "Talk on WhatsApp",
      "text": "Prefer a quick conversation? Start here with a little about your business.",
      "href": "https://wa.me/923453186700",
      "label": "0345 3186700"
    },
    {
      "title": "Call Xach Media",
      "text": "Speak with us about your creative direction and the support your business needs.",
      "href": "tel:+923453186700",
      "label": "+92 345 3186700"
    }
  ]
};
export default function Page(){ return <AgencyPage {...content} />; }
