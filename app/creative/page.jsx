import AgencyPage from '../AgencyPage';
export const metadata = {
  "title": "Creative | Xach Media",
  "description": "Original studio concepts explore how strategy and creative direction can give a brand its own visual world. These are illustrative studio exercises, not client results.",
  "alternates": {
    "canonical": "/creative"
  },
  "openGraph": {
    "title": "Creative | Xach Media",
    "description": "Original studio concepts explore how strategy and creative direction can give a brand its own visual world. These are illustrative studio exercises, not client results.",
    "url": "/creative"
  }
};
const content = {
  "eyebrow": "THE XACH IDEA LAB",
  "title": "Different worlds. One clear point of view.",
  "intro": "Original studio concepts explore how strategy and creative direction can give a brand its own visual world. These are illustrative studio exercises, not client results.",
  "items": [
    {
      "title": "NŪRA — social direction",
      "text": "A fictional skincare brand with a warm, tactile visual world. Product-led posts, a routine reel storyboard, and launch stories bring the daily ritual to life.",
      "href": "/#creative",
      "label": "Explore the NŪRA artwork"
    },
    {
      "title": "OFFSCRIPT — brand presence",
      "text": "A fictional independent fashion concept with electric colour, oversized type, and an expressive editorial system across the feed and collection launch.",
      "href": "/#creative",
      "label": "Explore the OFFSCRIPT artwork"
    },
    {
      "title": "Xach Media — motion direction",
      "text": "Our own purple signature in motion. A dimensional X, light, and purposeful pacing turn the first frame into the beginning of a brand story.",
      "href": "/#creative",
      "label": "Explore the motion concept"
    }
  ]
};
export default function Page(){ return <AgencyPage {...content} />; }
