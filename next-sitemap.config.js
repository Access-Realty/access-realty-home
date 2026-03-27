/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://access.realty',
  generateRobotsTxt: true,
  exclude: [
    '/api/*',
    '/direct-list',
    '/direct-list/*',
    '/home-values',
    '/home-values/*',
    '/qr',
    '/dl',
    '/s',
  ],
  additionalPaths: async (config) => [
    // === access.realty pages ===
    // Homepage
    { ...(await config.transform(config, '/')), priority: 1.0, changefreq: 'weekly' },
    // Landing pages
    ...(await Promise.all(
      [
        '/sell-for-the-most',
        '/need-to-sell-fast',
        '/avoid-showings-negotiations',
        '/less-than-perfect-house',
      ].map((path) => config.transform(config, path)),
    )).map((entry) => ({ ...entry, priority: 0.8, changefreq: 'weekly' })),
    // Solutions
    { ...(await config.transform(config, '/solutions')), priority: 0.8, changefreq: 'monthly' },
    ...(await Promise.all(
      [
        '/solutions/price-launch',
        '/solutions/equity-bridge',
        '/solutions/uplist',
        '/solutions/seller-finance',
      ].map((path) => config.transform(config, path)),
    )),
    // Core pages
    ...(await Promise.all(
      [
        '/homes-for-sale',
        '/selling-plan',
        '/contact',
        '/our-team',
      ].map((path) => config.transform(config, path)),
    )).map((entry) => ({ ...entry, priority: 0.7, changefreq: 'weekly' })),
    // Legal
    ...(await Promise.all(
      ['/terms', '/privacy'].map((path) => config.transform(config, path)),
    )).map((entry) => ({ ...entry, priority: 0.3, changefreq: 'yearly' })),

    // === direct-list.com pages ===
    // Core pages
    ...[
      '/',
      '/get-started',
      '/faq',
      '/savings',
      '/investors',
      '/investors/book',
      '/qualified-investors',
      '/selling-resources',
    ].map((path) => ({
      loc: `https://direct-list.com${path}`,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    })),
    // Persona landing pages
    ...[
      '/for',
      '/for/fresh-start',
      '/for/smart-sellers',
      '/for/investors',
      '/for/starting-over',
      '/for/family-home',
      '/for/fire',
      '/for/your-way',
      '/for/next-chapter',
      '/for/experienced-sellers',
    ].map((path) => ({
      loc: `https://direct-list.com${path}`,
      changefreq: 'monthly',
      priority: path === '/for' ? 0.8 : 0.6,
      lastmod: new Date().toISOString(),
    })),
  ],
}
