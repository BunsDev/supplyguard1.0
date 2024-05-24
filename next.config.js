const nextConfig = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["my-lib"],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imghippo.com",
        port: "",
        pathname: "/**",
      },
    ],
    disableStaticImages: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  ignoreBuildErrors: true,
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader?modules",
        },
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 25000,
            },
          },
        },
      ],
    },
  },
};

module.exports = nextConfig;
