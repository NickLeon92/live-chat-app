const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    rooms: [String]
  }

  type Room {
    _id: ID
    roomname: String
    messages: [Message]!
  }

  type Message {
    _id: ID
    message: String
    sender: String
    roomname: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    me: User
    rooms: [Room]
    room(roomname: String!): Room
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addRoom(roomname: String!): Room
    addMessage(message: String!, sender: String!, roomname: String!): Message
    removeRoom(roomname: String): User
  }
`;

module.exports = typeDefs;
