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
};

module.exports = nextConfig;
