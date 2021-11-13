import React ,{useEffect, useRef } from 'react';
import {Container, Alert, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { ADD_ROOM } from '../utils/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const Chatwindow = ({setDisplayChat, socket, roomdata, myName}) => {
    // console.log(roomdata.messages)

    const { loading, data } = useQuery( QUERY_ME);

    const user = data?.me || {};
  

    const [addRoom] = useMutation(ADD_ROOM)

    const messageHistory = roomdata.messages

    // console.log(messageHistory)

    const dummyDiv = useRef(null)

    const joinThisRoom = async () => {

        const joinData = {
            name: myName,
            room: roomdata.roomname
          }

        socket.emit("join_room", joinData)
        // socket.emit("init_ping", joinData)

        if(!user.rooms.includes(roomdata.roomname)){
            try {
                const { data } = await addRoom({
                    variables: { roomname: roomdata.roomname }
                })
            } catch (err) {
                console.error(err)
            }
        }

        setDisplayChat((item) => {
            const check = item.filter(el => el !== roomdata.roomname)
            return [...check, roomdata.roomname]
        })

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