import React, { useState, useRef } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Form, Button } from 'react-bootstrap';
import Chatbox from '../components/Chatbox'



import { QUERY_ME } from '../utils/queries';
import { ADD_ROOM } from '../utils/mutations';

import Auth from '../utils/auth';

const Profile = ({socket}) => {
  // console.log(Auth.getProfile().data.username)

  
  const { loading, data } = useQuery(QUERY_ROOMS)

  const roomData = data?.rooms || {}

  console.log(roomData)

  let runningList = []

  const roomNameList = roomData.forEach(element => {
      runningList.push(element.roomname)
      
  });

  const[addRoom] = useMutation(ADD_ROOM)

  const [room, setRoom] = useState([])
  const roomRef = useRef()

  const joinRoom = () => {
    if(roomRef.current.value !== ''){
      socket.emit("join_room", roomRef.current.value)
    }
    setRoom((item)=> [ ...item, roomRef.current.value])

    if(runningList.includes(roomRef.current.value)){

      try {
        const { data } = await addRoom({
          variables: { roomname: roomRef.current.value }
        })
      } catch (err) {
        console.error(err)
      }

    }

    

    
  }

  const { loading, data } = useQuery( QUERY_ME);

  const user = data?.me || {};
  
  // redirect to personal profile page if username is yours

  if(Auth.loggedIn()){
    const name = user.username
    console.log(`Welcome ${name}`)
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <Container >
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
      {room.map((room) => {
        return(<Chatbox socket={socket} myName = {user.username} room={room}/>)
      })}
    
      </Container>
  );
  }
  else{
    return <div>please log in</div>
  }
}
export default Profile;
