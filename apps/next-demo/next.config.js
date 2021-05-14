const withPreact = require("next-plugin-preact");
const withPlugins = require("next-compose-plugins");

const nextConfig = {
  future: {
    webpack5: true,
  },
  target: "serverless",
  reactStrictMode: true,
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
  },

  webpack: (config, { isServer }) => {
    /**
     * Fixes using server code (which uses fs) out of "pages" (where server code
     * usually runs).
     * Most specific case is "config/mdx" (which it's just a helper wrapper) that
     * uses node fs. It does work using inside page but having them there it throws
     * error: "Module not found: Can't resolve 'fs'"
     *
     * https://github.com/vercel/next.js/issues/7755#issuecomment-508633125
     */
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.rehype = false;
      config.resolve.fallback.v8 = false;
    }

    return config;
  },
};

module.exports = withPlugins([withPreact], nextConfig);
