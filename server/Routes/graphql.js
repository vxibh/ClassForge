// pages/api/graphql.js
import { GraphQLClient, gql } from 'graphql-request';

export default async function handler(req, res) {
  const { query, variables } = req.body;

  const graphqlEndpoint = 'https://leetcode.com/graphql/';
  const client = new GraphQLClient(graphqlEndpoint);

  try {
    const data = await client.request(query, variables);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: 'Error fetching data' });
  }
}
