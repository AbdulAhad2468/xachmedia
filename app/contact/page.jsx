import AgencyPage from '../AgencyPage';
export const metadata = {
  "title": "Contact | Xach Media",
  "description": "Tell us your business name, share a page link if you have one, and let us know what you would like to improve.",
  "alternates": {
    "canonical": "/contact"
  },
  "openGraph": {
    "title": "Contact | Xach Media",
    "description": "Tell us your business name, share a page link if you have one, and let us know what you would like to improve.",
    "url": "/contact"
  }
};
const content = {
  "eyebrow": "YOUR NEXT CHAPTER STARTS HERE",
  "title": "Start with a conversation.",
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
