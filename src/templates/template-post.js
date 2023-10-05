import * as React from "react";
import { graphql, Link } from "gatsby";

import "katex/dist/katex.min.css";

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      parent {
        ... on File {
          relativePath
        }
      }
    }
  }
`;

const PostRoute = ({ data }) => {
  const filename = data.markdownRemark.parent.relativePath;
  const url = `https://github.com/notkevin12/site/tree/main/src/pages/${filename}`;
  return (
    <>
      <h1>
        <Link to="/">Kevin's site</Link>
      </h1>
      <Link to={url}>View source on GitHub</Link>
      <div
        dangerouslySetInnerHTML={{
          __html: data.markdownRemark.html,
        }}
      />
    </>
  );
};

export default PostRoute;
