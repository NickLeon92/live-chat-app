import React, {useEffect, useState, useRef} from 'react'
import {Container, InputGroup, FormControl, Button, CloseButton, Alert} from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client';

import { ADD_MESSAGE, REMOVE_ROOM } from '../utils/mutations';
import { QUERY_ROOMS, QUERY_ME, QUERY_ROOM } from '../utils/queries';


function Chatbox({socket, myName, room, rooms, setRoom, client}){

    socket.emit("join_room", room)

    // console.log(`Welcome to room: ${room}, ${myName}`)

    const { loading, data } = useQuery(QUERY_ROOM, {variables:{ roomname: room }})

    const roomData = data?.room || {}

    console.log(roomData)

    const thisRoom = client.readQuery({ query: QUERY_ROOM, variables:{ roomname: roomData.roomname } });
    
    console.log(thisRoom)

    const [currentMessage, setCurrentMessage] = useState("")
    const [messageHistory, setMessageHistory] = useState([])
    const [addMessage] = useMutation(ADD_MESSAGE)
    //     , {
    //     // All returning data from Apollo Client queries/mutations return in a `data` field, followed by the the data returned by the request
    //     update(cache, { data: { addMessage } }) {
    //       try {
    //         const { room } = cache.readQuery({ query: QUERY_ROOM, variables:{ roomname: roomData.roomname } });
    
    //         // console.log(room)
    //         // console.log(messageHistory)
    
    //         cache.writeQuery({
    //           query: QUERY_ROOM,
    //           variables: { roomname: roomData.roomname },
    //           data: { room: {messages: messageHistory} },
    //         });
            
    //       } catch (e) {
    //         console.error(e);
    //       }
    //     },
    //   })
    const [removeRoom] = useMutation(REMOVE_ROOM, {
        // All returning data from Apollo Client queries/mutations return in a `data` field, followed by the the data returned by the request
        update(cache, { data: { removeRoom } }) {
          try {
            const { me } = cache.readQuery({ query: QUERY_ME });
    
            console.log(me)
    
            cache.writeQuery({
              query: QUERY_ME,
              data: { me: {rooms: room} },
            });
            
          } catch (e) {
            console.error(e);
          }
        },
      })

    const sendMessage = async () => {

        
        setCurrentMessage('')
        // console.log(currentMessage)
        if (currentMessage !==""){
            const messageData = {
                message: currentMessage,
                sender: myName,
                room: room,
            }
            await socket.emit("send_message", messageData)
            if(messageData.room === room){
            setMessageHistory((item)=>[...item, messageData])
            }
            try{ 
                console.log('attempting to save message...')
                const { data } = await addMessage({
                    variables: {
                        message: currentMessage,
                        sender: myName,
                        roomname: room
                    }
                })
            } catch(err) {
                console.error(err)
            }
            client.writeQuery({
                query: QUERY_ROOM,
                variables: { roomname: roomData.roomname },
                data: { room: {messages: messageHistory} },
              });
            
        }
    }

    useEffect (()=> {
        // console.log('socket use effect')
        socket.on("get_message", (data) => {
            // console.log('messsage recieved')
            if(data.room === room)
            // console.log((item)=> 
            // [...item, data])
            setMessageHistory((item)=> [...item, data])
            client.writeQuery({
                query: QUERY_ME,
                data: { me: {rooms: data} },
              });


        })


    }, [socket])

    useEffect (()=> {
        // console.log('room data use effect')

        // console.log(roomData)


        if(!loading){
            // const previousMessages = roomData.filter(el => el.roomname === room)
            // console.log(previousMessages)
            // if(roomData){
                setMessageHistory(roomData.messages)
            // }
            // console.log(messageHistory)
        }

        
    }, [roomData])

    const dummyDiv = useRef(null)

    useEffect(() => {
        // console.log('scroll effect')
        dummyDiv.current?.scrollIntoView({behavior: 'smooth'})
    }, [messageHistory])

    const handleDelete = async () => {
        // console.log(rooms)
        const newRooms = rooms.filter(el => el !== room)
        // console.log(newRooms)
        setRoom(newRooms)

        try{ 
            // console.log('attempting to deleete room...')
            const { data } = await removeRoom({
                variables: {
                    roomname: room
                }
            })
        } catch(err) {
            console.error(err)
        }

    }

    return(

        <Container style={{width:'400px'}} className="block-example border border-dark">

            <Container style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Room : {room}</h3>
                <CloseButton onClick={handleDelete} />
            </Container>

            
            <Container style={{height: '400px', overflowY:'auto'}}>
                {messageHistory.map((item)=>{
                    return (
                        <div key={item._id} style={ item.sender === myName ? { display:'flex', justifyContent: 'right'} : {display:'flex', justifyContent: 'left'}}>
                            { item.sender === myName? 
                            <Alert ref={dummyDiv} style={{paddingBottom:'.25rem'}} variant={'success'}>
                                <h4 style={{fontSize: '1.1rem'}}>{item.sender}</h4>
                                <p>{item.message}</p>
                            </Alert>
                            :
                            <Alert ref={dummyDiv} style={{paddingBottom:'.25rem'}} variant={'info'}>
                                <h4 style={{fontSize: '1.1rem'}}>{item.sender}</h4>
                                <p>{item.message}</p>
                            </Alert>
                            }
                        </div>
                    )
                })}

            </Container>

            <Container>
                <InputGroup className="mb-3">
                    <FormControl
                        onChange={(event)=>{setCurrentMessage(event.target.value)}}
                        placeholder="Type your message here"
                        aria-label="message"
                        aria-describedby="basic-addon2"
                        value = {currentMessage}
                    />
                    <Button 
                    onClick = {sendMessage}
                    variant="outline-secondary" id="button-addon2">
                        send
                    </Button>
                </InputGroup>
            </Container>

        </Container>

    )
}

export default Chatbox