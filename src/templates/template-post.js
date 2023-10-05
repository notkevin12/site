import * as React from "react";
import { graphql, Link } from "gatsby";

import "katex/dist/katex.min.css";

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
    }
  }
`;

const PostRoute = ({ data }) => {
  return (
    <>
      <h1>
        <Link to="/">Kevin's site</Link>
      </h1>
      <div
        dangerouslySetInnerHTML={{
          __html: data.markdownRemark.html,
        }}
      />
    </>
  );
};

export default PostRoute;
