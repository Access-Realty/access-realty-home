/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://access.realty',
  generateRobotsTxt: true,
  // Optional: exclude specific pages
  exclude: ['/api/*'],
  // Include dynamic Solutions pages
  additionalPaths: async (config) => [
    await config.transform(config, '/solutions/price-launch'),
    await config.transform(config, '/solutions/2-payment'),
    await config.transform(config, '/solutions/uplist'),
    await config.transform(config, '/solutions/seller-finance'),
  ],
}
