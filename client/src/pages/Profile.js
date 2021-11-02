import React, { useState, useRef } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Form, Button } from 'react-bootstrap';
import Chatbox from '../components/Chatbox'



import { QUERY_USER, QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = ({socket}) => {

  const [room, setRoom] = useState('')
  const roomRef = useRef()

  const joinRoom = () => {
    if(roomRef.current.value !== ''){
      socket.emit("join_room", roomRef.current.value)
    }
    setRoom(roomRef.current.value)
    
  }

  const { username: userParam } = useParams();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/me" />;
  }

  if (!Auth.loggedIn()) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const myName = Auth.getProfile().data.username



 
    return (
      <Container className="align-items-center d-fllex">
      <h4>
        Viewing {userParam ? `${user.username}'s` : 'your'} profile.
      </h4>
      <p>Join a room by entering it's name. Doesn't matter if it exists yet or not!</p>
      <Form>
      <Form.Group>
        <Form.Label>Enter a room name!</Form.Label>
        <Form.Control ref={roomRef} type="text" required/>
      </Form.Group>
      </Form>
      <Button type="submit" onClick={joinRoom}>Join</Button>
      <Chatbox socket={socket} myName = {myName} room={room}/>
      </Container>
    );

};

export default Profile;
