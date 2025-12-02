// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd-mobile'],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
    localeDetection: false,
  },
};

export default withNextIntl(nextConfig);