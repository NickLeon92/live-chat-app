import React, {useEffect, useState} from 'react'
import {Container, InputGroup, FormControl, Button, Card} from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client';
import { ADD_ROOM } from '../utils/mutations';
import { ADD_MESSAGE } from '../utils/mutations';
import { QUERY_ROOMS } from '../utils/queries';

const styles = {
    headerStyle: {
      display: 'flex',
      justifyContent: 'right'
    },
    
  };

function Chatbox({socket, myName, room}){

    console.log(`Welcome to room: ${room}, ${myName}`)


    const [currentMessage, setCurrentMessage] = useState("")
    const [messageHistory, setMessageHistory] = useState([])

    const [addRoom] = useMutation(ADD_ROOM)
    const [addMessage] = useMutation(ADD_MESSAGE)




    const sendMessage = async () => {
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

    return(

        <Container className="block-example border border-dark">

            <Container>
                <h3>Room : {room}</h3>
            </Container>

            <Container>
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