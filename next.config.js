export default {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        web3: '/node_modules/web3/dist/web3.min.js',
      }
    }

    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'mkdirp-promise': '/helpers/mkdirpPromise.js',
      }
    }

    return config
  },
}
