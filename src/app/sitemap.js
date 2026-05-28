export default function sitemap() {
  const baseUrl = 'https://ncm-website.vercel.app';

  // Base routes
  const routes = [
    '',
    '/menu',
    '/about',
    '/contact',
    '/tracking',
    '/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
