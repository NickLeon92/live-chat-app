import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_ROOM = gql`
  mutation addRoom($roomname: String!) {
    addRoom(roomname: $roomname) {
      roomname
    }
  }
`

export const ADD_MESSAGE = gql`
  mutation addMessage($message: String!, $sender: String!, $roomname: String!){
    addMessage(message: $message, sender: $sender, roomname: $roomname){
      message
      sender
      roomname
    }
  }
`

export const REMOVE_ROOM = gql`
  mutation removeRoom($roomname: String!) {
    removeRoom(roomname: $roomname) {
      username
      rooms
    }
  }
`;
