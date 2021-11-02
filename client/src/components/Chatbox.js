import React, {useEffect, useState} from 'react'
import {Container, InputGroup, FormControl, Button} from 'react-bootstrap'

function Chatbox({socket, myName, room}){

    // myMessage = getRef()

    const[currentMessage, setCurrentMessage] = useState("")

    const sendMessage = async () => {
        console.log(currentMessage)
        if (currentMessage !==""){
            const messageData = {
                message: currentMessage,
                sender: myName,
                room: room,
            }
            await socket.emit("send_message", messageData)
        }
    }

    useEffect (()=> {
        console.log('test')
        socket.on("get_message", (data) => {
            console.log(data)
        })
    }, [socket])

    return(

        <Container>

            <Container>
                <h3>Realtime messeger</h3>
            </Container>

            <Container>
                <p></p>
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