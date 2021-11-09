import React ,{useEffect, useRef } from 'react';
import {Container, Alert, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { ADD_ROOM } from '../utils/mutations';
import { useMutation } from '@apollo/client';

const Chatwindow = ({socket, roomdata, myName}) => {
    // console.log(roomdata.messages)

    const [addRoom] = useMutation(ADD_ROOM)

    const messageHistory = roomdata.messages

    // console.log(messageHistory)

    const dummyDiv = useRef(null)

    const joinThisRoom = async () => {

        console.log(roomdata.roomname)

        try {
            const { data } = await addRoom({
                variables: { roomname: roomdata.roomname }
            })
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        dummyDiv.current?.scrollIntoView()
    })

  return (

    <Container>
        <Link to='/me'>
          <Button
          onClick = {joinThisRoom}
          >Join!
          </Button>
        </Link>
    
      <Container style={{height: '300px', overflowY:'auto', border:'solid'}}>
        {messageHistory.map((item)=>{
                return (
                    <div key={item._id} style={ item.sender === myName ? { display:'flex', justifyContent: 'right'} : {}}>
                      <Alert ref={dummyDiv} style={{paddingBottom:'.25rem'}} variant={'success'}>
                        <h4 style={{fontSize: '1.1rem'}}>{item.sender}</h4>
                        <p>{item.message}</p>
                    </Alert>

                    </div>
                     )
                 })}
            <div ref={dummyDiv}></div>
      </Container>

      </Container>
    
  );

};

export default Chatwindow;