export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/', // Block all crawling before launch
      },
    ],
    sitemap: 'https://ncm-website.vercel.app/sitemap.xml',
  };
}
