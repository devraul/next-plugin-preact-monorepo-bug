const path = require("path");

module.exports = {
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

    const pluginsToResolve = [
      // "@babel/plugin-syntax-jsx",
      // "@babel/core",
      // "@babel/plugin-proposal-object-rest-spread",
      // "@babel/types",
      // "remark-parse",
      // "has-flag",
      // "tslib",
      // "supports-color",
      // "@babel/runtime",
      // "@emotion/is-prop-valid",
      // "@emotion/memoize",
      // "@babel/helper-plugin-utils",
      // "escape-string-regexp",
      // "iconv-lite",
      // "semver",
      // "unified",
    ];

    pluginsToResolve.forEach((plugin) => {
      /**
       * `require.resolve` won't help in this case because because it brings the
       * entry file from the module (e.g. path/to/module/lib/index.js).
       *
       * What I need is only `path/to/module`
       */
      config.resolve.alias[plugin] = path.resolve(
        __dirname,
        "../../node_modules",
        plugin
      );
    });

    return config;
  },
};
