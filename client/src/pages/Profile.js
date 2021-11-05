import React, { useState, useRef, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Container, Form, Button } from 'react-bootstrap';
import Chatbox from '../components/Chatbox'



import { QUERY_ME } from '../utils/queries';
import { QUERY_ROOMS } from '../utils/queries'
import { ADD_ROOM } from '../utils/mutations';

import Auth from '../utils/auth';
import { removeArgumentsFromDocument } from '@apollo/client/utilities';
// window.location.reload();

const Profile = ({socket}) => {

  
  // console.log(Auth.getProfile().data.username)
  const { loading, data } = useQuery( QUERY_ME);

  const user = data?.me || {};
  
  console.log(user)
  // console.log(user.rooms)
  
  const[addRoom] = useMutation(ADD_ROOM)
  
  let [room, setRoom] = useState([])
  const roomRef = useRef()
  
  
  useEffect(()=>{

    console.log()
    
    if(!loading){

      setRoom(user.rooms)
    }
    
    
  },[user.rooms])

  console.log(room)

  const joinRoom = async () => {
    
    if(roomRef.current.value.length > 0 && !room.includes(roomRef.current.value)){
      console.log(roomRef.current.value.length)
      socket.emit("join_room", roomRef.current.value)
      setRoom((item)=> [ ...item, roomRef.current.value])
      try {
        const { data } = await addRoom({
          variables: { roomname: roomRef.current.value }
        })
      } catch (err) {
        console.error(err)
      }
    }


  }

  
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
      {room.map((newroom) => {
        return (<Chatbox socket={socket} myName = {user.username} room={newroom} rooms = {room} setRoom = {setRoom}/>) 
        // :

        // <h1>no rooms yet</h1>

      })}
    
      </Container>
  );
  }
  else{
    return <div>please log in</div>
  }
}
export default Profile;
