const config = {
  siteMetadata: {
    title: "site",
    siteUrl: "https://www.yourdomain.tld",
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-katex",
            options: {},
          },
          "gatsby-remark-graphviz",
        ],
      },
    },
  ],
  pathPrefix: "/site",
};

export default config;
