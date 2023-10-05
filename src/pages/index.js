import * as React from "react";
import { graphql, Link } from "gatsby";

export const pageQuery = graphql`
  query IndexPage {
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
    steamResponse {
      games {
        appid
        name
        playtime_2weeks
      }
    }
  }
`;

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges;
  const games = data.steamResponse.games;
  let steamImg = <h3>No games played in the past two weeks 😔</h3>;
  if (games.length) {
    let mostPlayedGame = games[0];
    let mostPlayedTime = games[0].playtime_2weeks;
    games.forEach((game) => {
      if (game.playtime_2weeks > mostPlayedTime) {
        mostPlayedGame = game;
        mostPlayedTime = game.playtime_2weeks;
      }
    });

    steamImg = (
      <>
        <h3>
          <a
            href={`https://store.steampowered.com/app/${mostPlayedGame.appid}/`}
          >
            {mostPlayedGame.name}
          </a>
        </h3>
        <img
          src={`https://cdn.akamai.steamstatic.com/steam/apps/${mostPlayedGame.appid}/header.jpg`}
          alt={`Steam store header for ${mostPlayedGame.name}`}
          style={{ maxWidth: "100%" }}
        />
      </>
    );
  }
  return (
    <main>
      <h1>Kevin's site</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.node.fields.slug}>
            <Link to={post.node.fields.slug}>
              {post.node.frontmatter.title}
            </Link>
          </li>
        ))}
      </ul>
      <h2>Most played game in the past two weeks:</h2>
      {steamImg}
    </main>
  );
};

export default IndexPage;
