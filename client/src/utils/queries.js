import { gql } from '@apollo/client';


export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_ROOMS = gql`
  query rooms {
    rooms {
      _id
      roomname
      messages {
        message
        sender
        roomname
      }
    }
  }
`;
