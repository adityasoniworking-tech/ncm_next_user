export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'], // Adjust if you have these routes
      },
    ],
    sitemap: 'https://ncm-website.vercel.app/sitemap.xml',
  };
}
