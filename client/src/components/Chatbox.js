import React, {useEffect, useState, useRef} from 'react'
import {Container, InputGroup, FormControl, Button, Card, CloseButton} from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ROOM } from '../utils/mutations';
import { ADD_MESSAGE, REMOVE_ROOM } from '../utils/mutations';
import { QUERY_ROOMS } from '../utils/queries';

const styles = {
    headerStyle: {
      display: 'flex',
      justifyContent: 'right'
    },
    
  };

function Chatbox({socket, myName, room, rooms, setRoom}){

    console.log(`Welcome to room: ${room}, ${myName}`)


    const [currentMessage, setCurrentMessage] = useState("")
    const [messageHistory, setMessageHistory] = useState([])

    const [addMessage] = useMutation(ADD_MESSAGE)
    const [removeRoom] = useMutation(REMOVE_ROOM)

    const scrollDiv = useRef()




    const sendMessage = async () => {

        
        setCurrentMessage('')
        console.log(currentMessage)
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
            
        }
    }

    useEffect (()=> {
        console.log('test')
        socket.on("get_message", (data) => {
            if(data.room === room)
            setMessageHistory((item)=> 
                [...item, data])
        })
    }, [socket])

    const handleDelete = async () => {
        console.log(rooms)
        const newRooms = rooms.filter(el => el !== room)
        console.log(newRooms)
        setRoom(newRooms)

        try{ 
            console.log('attempting to deleete message...')
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

        <Container className="block-example border border-dark">

            <Container style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Room : {room}</h3>
                <CloseButton onClick={handleDelete} />
            </Container>

            <Container ref={scrollDiv} style={{height: '200px', overflowY:'auto'}}>
                {messageHistory.map((item)=>{
                    return (
                        <div style={ item.sender === myName ? { display:'flex', justifyContent: 'right'} : {}}>
                        <Card style={{ width: '18rem' }}>
                        <Card.Body>
                          <Card.Title>{item.sender}</Card.Title>
                          <Card.Text>
                            {item.message}
                          </Card.Text>
                        </Card.Body>
                      </Card>
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