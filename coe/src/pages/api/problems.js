import { GraphQLClient, gql } from 'graphql-request';
import { v4 as uuidv4 } from 'uuid';

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

export default async function handler(req, res) {
  const variables = {
    categorySlug: "",
    skip: 0,
    limit: 200,
    filters: {}
  };

  const client = new GraphQLClient(graphqlEndpoint);

  try {
    const data = await client.request(query, variables);
    const problemsWithIdAndType = data.problemsetQuestionList.questions.map(question => ({
      id: uuidv4(),
      title: question.title,
      titleSlug: question.titleSlug,
      type: 'leetcode_problem',
      link: `https://leetcode.com/problems/${question.titleSlug}`,
      topicTags: question.topicTags,
    }));
    res.status(200).json(problemsWithIdAndType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching problems' });
  }
}
