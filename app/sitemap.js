/** @returns {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  // The agency site is one page; section anchors are not separate URLs.
  // Omit lastModified until a reliable content modification date is available.
  return [{ url: 'https://www.xachmedia.com/' }];
}
