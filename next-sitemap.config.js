/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://access.realty',
  generateRobotsTxt: true,
  // Optional: exclude specific pages
  exclude: ['/api/*', '/direct-list', '/direct-list/*'],
  // Include dynamic Solutions pages
  additionalPaths: async (config) => [
    await config.transform(config, '/solutions/price-launch'),
    await config.transform(config, '/solutions/equity-bridge'),
    await config.transform(config, '/solutions/uplist'),
    await config.transform(config, '/solutions/seller-finance'),
    // DirectList pages under direct-list.com domain
    ...[
      '/',
      '/get-started',
      '/faq',
      '/savings',
      '/investors',
      '/investors/book',
    ].map((path) => ({
      loc: `https://direct-list.com${path}`,
      changefreq: 'weekly',
      priority: path === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    })),
  ],
}
