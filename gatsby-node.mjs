import * as path from "path";
import { createFilePath } from "gatsby-source-filesystem";

export const onCreateNode = ({ actions, node, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "MarkdownRemark") {
    const slug = createFilePath({
      node,
      getNode,
      basePath: "src/pages",
    });
    createNodeField({
      node,
      name: "slug",
      value: slug,
    });
  }
};

export const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const postTemplate = path.resolve("src/templates/template-post.js");
  const result = await graphql(`
    query MarkdownRemarkNode {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }
  // Create pages
  result.data.allMarkdownRemark.edges.forEach((edge) => {
    createPage({
      path: edge.node.fields.slug,
      component: postTemplate,
      context: {
        slug: edge.node.fields.slug,
      },
    });
  });
};

export const sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  const apiKey = "97B4944A1DB24D2A08846846D6EEE036";
  const steamId = "76561198201033057";
  const response = await fetch(
    `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`
  );
  const responseJson = await response.json();
  const responseGames = responseJson.response.games;
  createNode({
    id: "steam-response",
    internal: {
      type: "steamResponse",
      contentDigest: createContentDigest(responseJson),
    },
    games: responseGames,
  });
};
