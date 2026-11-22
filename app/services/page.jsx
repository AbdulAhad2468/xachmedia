import AgencyPage from '../AgencyPage';
export const metadata = {
  "title": "Services | Xach Media",
  "description": "Choose focused support or discuss a connected plan for your social content and online presence.",
  "alternates": {
    "canonical": "/services"
  },
  "openGraph": {
    "title": "Services | Xach Media",
    "description": "Choose focused support or discuss a connected plan for your social content and online presence.",
    "url": "/services"
  }
};
const content = {
  "eyebrow": "WHAT WE BRING TO THE TABLE",
  "title": "One creative partner. A connected presence.",
  "intro": "Choose focused support or discuss a connected plan for your social content and online presence.",
  "items": [
    {
      "title": "Social media management",
      "text": "Content direction, social graphics, captions, publishing rhythm, and a consistent page presentation."
    },
    {
      "title": "Reels & content creation",
      "text": "Creative concepts, opening hooks, storyboards, video editing, and content formats made for social."
    },
    {
      "title": "Online business presence",
      "text": "Profile direction, brand messaging, visual consistency, and a review of the places people find your business."
    },
    {
      "title": "Strategy & page growth",
      "text": "Audience direction, campaign planning, content performance review, and recommendations for the next cycle."
    }
  ]
};
export default function Page(){ return <AgencyPage {...content} />; }
