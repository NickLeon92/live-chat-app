import React, {useEffect, useState, useRef} from 'react'
import {Container, InputGroup, FormControl, Button, CloseButton, Alert, DropdownButton, Dropdown} from 'react-bootstrap'
import { useMutation, useQuery } from '@apollo/client';

import { ADD_MESSAGE, REMOVE_ROOM } from '../utils/mutations';
import { QUERY_ROOMS, QUERY_ME, QUERY_ROOM } from '../utils/queries';


function Chatbox({displayChat, setDisplayChat, socket, myName, room, rooms, setRoom, client}){

    const joinData = {
        room: room,
        name: myName
    }

    

    // console.log(`Welcome to room: ${room}, ${myName}`)

    const { loading, data } = useQuery(QUERY_ROOM, {variables:{ roomname: room }})

    const roomData = data?.room || {}

    // console.log(roomData)

    const [currentMessage, setCurrentMessage] = useState("")
    const [messageHistory, setMessageHistory] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [addMessage] = useMutation(ADD_MESSAGE)
    const [removeRoom] = useMutation(REMOVE_ROOM)

    // console.log(onlineUsers)

    const sendMessage = async () => {

        
        setCurrentMessage('')
        // console.log(currentMessage)
        if (currentMessage !==""){
            const messageData = {
                message: currentMessage,
                sender: myName,
                room: room,
                listSize: messageHistory.length + 1
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
            if(data.room === room){
                // console.log((item)=> 
                // [...item, data])
                setMessageHistory((item)=> [...item, data])
                client.writeQuery({
                    query: QUERY_ROOM,
                    variables: { roomname: roomData.roomname },
                    data: { room: {messages: messageHistory} },
                  });

                

            }

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

    useEffect(() => {

        if(displayChat.includes(room)){

            console.log(displayChat)

        socket.on("ping_room", (data) => {

            if(data.roomname === room){

                setOnlineUsers((item) => {
                    console.log(item)
                    const check = item.filter(el => el.socketID !== data.socketID)
                    console.log(check, data)
    
                    return [...check, data]
                })
                joinData["socketID"] = data.socketID
                socket.emit("return_ping", joinData)
            }


            
        })
        }

        if(displayChat.includes(room)){

        socket.on("online_users", (data) => {

            if(data.roomname === room){

                setOnlineUsers((item) => {
                    console.log(item)
                    const check = item.filter(el => el.socketID !== data.socketID)
                    console.log(check, data)
    
                    return [...check, data]
                })
            }

        })
    }

        socket.on("disconnected_users", (data) => {
            console.log('user disconnected')
            console.log(`User with socketID: ${data} disconnected`)

            
            const newOnlineUsers = onlineUsers.filter(el => el.socketID !== data)
            setOnlineUsers((item) => {
                const check = item.filter(el => el.socketID !== data)
                return check
            })
            
        })

    },[socket])


    const handleDelete = async () => {

        setDisplayChat((item) => {
            const check = item.filter(el => el !== room)
            return check
        })

        socket.emit("ping_leave", joinData)

        localStorage.setItem(`${room}-MessageLength`, messageHistory.length)
        localStorage.setItem(`${room}-CurrentLength`, messageHistory.length)

    }

    useEffect(() => {
        console.log(`user: ${joinData.name}, joining room: ${joinData.room}`)
        socket.emit("init_ping", joinData)
    },[rooms])

    return(

        <Container style={{width:'400px'}} className="block-example border border-dark">

            <Container style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>Room : {room}</h3>
                <CloseButton onClick={handleDelete} />
            </Container>

            <DropdownButton variant={onlineUsers.length > 0 ?'success':'secondary'} id="dropdown-basic-button" title={onlineUsers.length === 0 ? 'No Users Online' : `Online Users: (${onlineUsers.length})`}>
                {onlineUsers.map((user) => {
                    return (
                        <Dropdown.Item key={user.socketID}> 🟢 -  {user.username}</Dropdown.Item>
                    )
                })}
            </DropdownButton>

            
            <Container style={{height: '400px', overflowY:'auto'}}>
                {messageHistory.map((item)=>{
                    return (
                        <div key={item._id} style={ item.sender === myName ? { display:'flex', justifyContent: 'right'} : {display:'flex', justifyContent: 'left'}}>
                            { item.sender === myName? 
                            <Alert ref={dummyDiv} style={{padding:'.5rem', paddingBottom:'0px', minWidth:'90px', maxWidth:'180px'}} variant={'success'}>
                                <h4 style={{fontSize: '1rem', fontWeight:'bolder', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow:'ellipsis'}}>{item.sender}</h4>
                                <p>{item.message}</p>
                            </Alert>
                            :
                            <Alert ref={dummyDiv} style={{padding:'.5rem', paddingBottom:'0px', minWidth:'90px', maxWidth:'180px'}} variant={'info'}>
                                <h4 style={{fontSize: '1rem', fontWeight:'bolder', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow:'ellipsis'}}>{item.sender}</h4>
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
                        onKeyPress = {(event) => {event.key === 'Enter' && sendMessage()}}
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