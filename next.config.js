export default {
  experimental: {
    appDir: true,
  },
  webpack: (config, options) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'mkdirp-promise': '/helpers/mkdirpPromise.js',
    }

    return config
  },
}
