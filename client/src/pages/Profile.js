import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useMutation, useQuery } from '@apollo/client';
import { Container, Form, Button, Offcanvas, ListGroup, Badge } from 'react-bootstrap';
import Chatbox from '../components/Chatbox'
import Chat from '../components/Chat'
import Footer from '../components/Footer'



import { QUERY_ME, QUERY_ROOMS } from '../utils/queries';

import { ADD_ROOM } from '../utils/mutations';

import Auth from '../utils/auth';

// window.location.reload();

const Profile = ({displayChat, setDisplayChat, client, socket}) => {
  
  let [room, setRoom] = useState([])

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  
  client.writeQuery({
    query: QUERY_ME,
    data: { me: {rooms: room} },
  });
  
  const { loading, data } = useQuery( QUERY_ME);

  const user = data?.me || {};
  
  // console.log(user)
  // console.log(user.rooms)
  
  const[addRoom] = useMutation(ADD_ROOM)
  
  const roomRef = useRef()

  console.log(displayChat)
  
  
  useEffect(()=>{

    // console.log('calling room use effect')
    
    if(!loading){

      setRoom(user.rooms)
    }
     
  }, [user])
  
  // console.log(room)

  const joinRoom = async () => {
    
    const joinData = {
      name: user.username,
      room: roomRef.current.value
    }

    if(roomRef.current.value.length > 0 && !room.includes(roomRef.current.value)){
      
      socket.emit("join_room", joinData)
      try {
        const { data } = await addRoom({
          variables: { roomname: roomRef.current.value }
        })
      } catch (err) {
        console.error(err)
      }
      
      setRoom((item)=> [ ...item, roomRef.current.value])
      setDisplayChat((item) => {
        const check = item.filter(el => el !== roomRef.current.value)
        return [...check, roomRef.current.value]
      })
    }
    // socket.emit("join_room", joinData)


  }

  
  // redirect to personal profile page if username is yours

  if(Auth.loggedIn()){
    const name = user.username

  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <Container >

      <Container style={{display: 'flex', marginBottom:'1rem'}}>
        <Form>
          <Form.Group>
            {/* <Form.Label>Enter a room name!</Form.Label> */}
            <Form.Control placeholder='enter a room name' ref={roomRef} type="text" required />
          </Form.Group>
        </Form>

        <Button type="submit" onClick={joinRoom}>Join</Button>
        <Button style={{marginLeft:'10px'}} variant="primary" onClick={handleShow}>
        Room List
        </Button>
        
      </Container>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Rooms</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <ListGroup as="ul">
          {room.map((newroom) => {
            return ( <Chat key={newroom} displayChat={displayChat} setDisplayChat={setDisplayChat} socket={socket} myName={user.username} room={newroom} rooms={user.rooms} setRoom={setRoom} client={client} />
                )
          })}

        </ListGroup>
        </Offcanvas.Body>
        </Offcanvas>
      <Container style={{ display: 'flex', flexWrap: 'wrap' }}>
        {displayChat.map((newroom) => {
          return (<Chatbox key={newroom} displayChat={displayChat} setDisplayChat={setDisplayChat} socket={socket} myName={user.username} room={newroom} rooms={room} setRoom={setRoom} client={client} />)

        })}
      </Container>

      {/* <Footer room={room} myName={user.username} socket={socket}/> */}

    </Container>
  );
  }
  else{
    return <div>please log in</div>
  }
}
export default Profile;
