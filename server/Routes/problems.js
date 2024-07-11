// pages/api/problems.js
import { GraphQLClient, gql } from 'graphql-request';

const graphqlEndpoint = 'https://leetcode.com/graphql/';

const query = gql`
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
      questions: data {
        title
        titleSlug
        content
        topicTags {
          name
        }
      }
    }
  }
`;

const handler = async (req, res) => {
  const variables = {
    categorySlug: "",
    skip: 0,
    limit: 100,
    filters: {}
  };

  const client = new GraphQLClient(graphqlEndpoint);

  try {
    const data = await client.request(query, variables);
    res.status(200).json(data.problemsetQuestionList.questions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching problems' });
  }
};

export default handler;
