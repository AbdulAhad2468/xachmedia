/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return ['', '/about', '/services', '/creative', '/contact', '/faq'].map(path => ({ url: 'https://www.xachmedia.com' + (path || '/') }));
}
