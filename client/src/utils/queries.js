import { gql } from '@apollo/client';


export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      rooms 
    }
  }
`;

export const QUERY_USERS = gql`
    query users {
      users {
        _id
        username
        email
        rooms
      }
    }
`;

export const QUERY_ROOMS = gql`
  query rooms {
    rooms {
      _id
      roomname
      messages {
        _id
        message
        sender
        roomname
      }
    }
  }
`;

export const QUERY_ROOM = gql`
  query room ($roomname: String!) {
    room (roomname: $roomname) {
      _id
      roomname
      messages {
        _id
        message
        sender
        roomname
      }
    }
  }
`;
