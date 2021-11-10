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
    
        <Container style={{height: '400px', overflowY:'auto'}}>
                {messageHistory.map((item)=>{
                    return (
                        <div key={item._id} style={ item.sender === myName ? { display:'flex', justifyContent: 'right'} : {display:'flex', justifyContent: 'left'}}>
                            { item.sender === myName? 
                            <Alert ref={dummyDiv} style={{padding:'.5rem', paddingBottom:'0px', minWidth:'90px', maxWidth:'180px'}} variant={'success'}>
                                <h4 style={{fontSize: '1rem', fontWeight:'bolder'}}>{item.sender}</h4>
                                <p>{item.message}</p>
                            </Alert>
                            :
                            <Alert ref={dummyDiv} style={{padding:'.5rem', paddingBottom:'0px', minWidth:'90px', maxWidth:'180px'}} variant={'info'}>
                                <h4 style={{fontSize: '1rem', fontWeight:'bolder'}}>{item.sender}</h4>
                                <p>{item.message}</p>
                            </Alert>
                            }
                        </div>
                    )
                })}

            </Container>

      </Container>
    
  );

};

export default Chatwindow;