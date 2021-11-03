import React, { useState, useRef } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Container, Form, Button } from 'react-bootstrap';
import Chatbox from '../components/Chatbox'



import { QUERY_ME } from '../utils/queries';

import Auth from '../utils/auth';

const Profile = ({socket}) => {
  // console.log(Auth.getProfile().data.username)

  const [room, setRoom] = useState('')
  const roomRef = useRef()

  const joinRoom = () => {
    if(roomRef.current.value !== ''){
      socket.emit("join_room", roomRef.current.value)
    }
    setRoom(roomRef.current.value)
    
  }

  const { loading, data } = useQuery( QUERY_ME);

  const user = data?.me || {};
  
  // redirect to personal profile page if username is yours

  if(Auth.loggedIn()){
    const myName = ''
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <Container className="align-items-center d-fllex">
      <h4>
        Viewing your profile.
      </h4>
      <p>Join a room by entering it's name. Doesn't matter if it exists yet or not!</p>
      <Form>
      <Form.Group>
        <Form.Label>Enter a room name!</Form.Label>
        <Form.Control ref={roomRef} type="text" required/>
      </Form.Group>
      </Form>
      <Button type="submit" onClick={joinRoom}>Join</Button>
      <Chatbox socket={socket} myName = {user.username} room={room}/>
      </Container>
  );
  }
}
export default Profile;
