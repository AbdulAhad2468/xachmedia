import AgencyPage from '../AgencyPage';
export const metadata = {
  "title": "About | Xach Media",
  "description": "Xach Media brings social media, reels, and online brand presence together with a clear creative direction.",
  "alternates": {
    "canonical": "/about"
  },
  "openGraph": {
    "title": "About | Xach Media",
    "description": "Xach Media brings social media, reels, and online brand presence together with a clear creative direction.",
    "url": "/about"
  }
};
const content = {
  "eyebrow": "THE STUDIO BEHIND THE SCROLL",
  "title": "A little bold. Very intentional.",
  "intro": "Xach Media brings social media, reels, and online brand presence together with a clear creative direction.",
  "items": [
    {
      "title": "Led by Abdul Hadi Khan",
      "text": "CEO, Xach Media. A clear creative direction connects how your business looks, what it says, and how consistently it shows up."
    },
    {
      "title": "Ideas shaped around your business",
      "text": "We start with your audience, your goals, and what makes your business different. The creative direction follows from there."
    },
    {
      "title": "Clarity from the start",
      "text": "Scope, deliverables, timing, and cost are discussed before work begins. You know what we are making and what happens next."
    }
  ]
};
export default function Page(){ return <AgencyPage {...content} />; }
