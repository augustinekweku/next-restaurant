module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://next-restaurant-101.herokuapp.com/:path*",
      },
    ];
  },
};
