// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'antd',
    'antd-mobile',
    '@ant-design/icons',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-input',
    'rc-table',
    'rc-tree',
    '@rc-component/trigger',
  ],
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
};

export default withNextIntl(nextConfig);