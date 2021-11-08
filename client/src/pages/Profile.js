import React, { useState, useRef, useEffect } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Container, Form, Button } from 'react-bootstrap';
import Chatbox from '../components/Chatbox'



import { QUERY_ME, QUERY_ROOMS } from '../utils/queries';

import { ADD_ROOM } from '../utils/mutations';

import Auth from '../utils/auth';

// window.location.reload();

const Profile = ({client, socket}) => {

  let [room, setRoom] = useState([])

  client.writeQuery({
    query: QUERY_ME,
    data: { me: {rooms: room} },
  });
  

  // console.log(room)

  // const me = client.readQuery({ query: QUERY_ME });

  // console.log(me)
  
  // console.log(Auth.getProfile().data.username)
  const { loading, data } = useQuery( QUERY_ME);

  const user = data?.me || {};
  
  console.log(user)
  // console.log(user.rooms)
  
  const[addRoom] = useMutation(ADD_ROOM, {
    // All returning data from Apollo Client queries/mutations return in a `data` field, followed by the the data returned by the request
    update(cache, { data: { addRoom } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });

        // console.log(me)
        // console.log(room)

        cache.writeQuery({
          query: QUERY_ME,
          data: { me: {rooms: room} },
        });
        
      } catch (e) {
        console.error(e);
      }
    },
  })
  
  const roomRef = useRef()
  
  
  useEffect(()=>{

    // console.log('calling room use effect')
    
    if(!loading){

      setRoom(user.rooms)
    }
     
  }, [user])
  
  // console.log(room)

  const joinRoom = async () => {
    
    if(roomRef.current.value.length > 0 && !room.includes(roomRef.current.value)){
      
      setRoom((item)=> [ ...item, roomRef.current.value])
      socket.emit("join_room", roomRef.current.value)
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
      <Container style ={{display:'flex', flexWrap: 'wrap'}}>
        {room.map((newroom) => {
          return (<Chatbox key={newroom} socket={socket} myName = {user.username} room={newroom} rooms = {room} setRoom = {setRoom} client={client}/>) 
          // :

          // <h1>no rooms yet</h1>

        })}
      </Container>
    
      </Container>
  );
  }
  else{
    return <div>please log in</div>
  }
}
export default Profile;
