const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }
    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello: String
    }
    type RootMutation {
        createUser(userInput: UserInputData): User!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
// ! is 'required' type
// type TestData {
//     text: String!
//     views: Int!
// }
// type RootQuery {
//     hello: TestData!
// }
// schema {
//         query: RootQuery
//     }
// `)

/*
we can use localhost:8000/graphql to execute
mutation {
  createUser(userInput: {email: "test@test.com", name: "Max", password: "tester" }) {
    _id // returned value
    email // returned value
  }
}
*/