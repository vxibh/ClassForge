// pages/api/problems/[problemId].js
import { GraphQLClient, gql } from 'graphql-request';

const graphqlEndpoint = 'https://leetcode.com/graphql/';

export default async function handler(req, res) {
  const { problemId } = req.query;

  const query = gql`
    query problemDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        content
        topicTags {
          name
        }
      }
    }
  `;

  const variables = {
    titleSlug: problemId,
  };

  const client = new GraphQLClient(graphqlEndpoint);

  try {
    const data = await client.request(query, variables);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching problem details' });
  }
}
