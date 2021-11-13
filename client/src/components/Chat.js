import { useEffect, useState } from 'react'
import {  useMutation, useQuery } from '@apollo/client'
import { QUERY_ROOM } from '../utils/queries'
import { REMOVE_ROOM } from '../utils/mutations'
import {Container, Button, ListGroup, Badge} from 'react-bootstrap'
import { LocalState } from '@apollo/client/core/LocalState'


const Chat = ({displayChat, setDisplayChat, socket, myName, room, rooms, setRoom, client}) => {

    const { loading, data, refetch } = useQuery(QUERY_ROOM, {variables:{ roomname: room }})

    const roomData = data?.room || {}
    console.log(roomData)

    // if(!loading){

    //     localStorage.setItem(`${room}-initCurrentLength`, roomData.messages.length)
    // }


    const [removeRoom] = useMutation(REMOVE_ROOM)

    const [notifications, setNotifications] = useState(0)

    const joinData = {
        name: myName,
        room: room
      }

    const openChat = () => {

        refetch()


        // socket.emit("join_room", joinData)

        setDisplayChat((item) => {

            const check = item.filter(el => el !== room)
            return [...check, room]
        })
        // socket.emit("init_ping", joinData)
        setNotifications(0)
    }

    const leaveChat = async () => {

        const newRooms = rooms.filter(el => el !== room)
        // console.log(newRooms)
        setRoom(newRooms)
        console.log('leaving room')
        socket.emit("leave_room", joinData)
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

        setDisplayChat((item) => {
            const check = item.filter(el => el !== room)
            return check
        })

    }
 
    

    useEffect(() => {
        socket.emit("join_room", joinData)
    },[])

    useEffect(() => {

        socket.on("get_notification", (data) => {
            if (data.room === room) {
                if (!displayChat.includes(room)) {

                    localStorage.setItem(`${room}-CurrentLength`, data.listSize)
                    console.log('recieved message for notification')

                    console.log(localStorage.getItem(`${room}-CurrentLength`))

                    setNotifications((item) => {
                        return item + 1
                    })
                }
            }
        })
    }, [socket])

    useEffect(() => {


        if(!displayChat.includes(room)){
            
            const index = localStorage.getItem(`${room}-CurrentLength`)
            const previous = localStorage.getItem(`${room}-MessageLength`)
 

            if(!loading && roomData.messages.length > index){
                console.log('test')
                setNotifications(roomData.messages.length - previous)
            }


            else{

                setNotifications(index - previous)
            }
            
        }
        // setNotifications(0)
        
    }, [loading])

    if(!loading)

    return (
        <ListGroup.Item
            as="li"
            className="d-flex justify-content-between align-items-start"
        >
            <div className="ms-2 me-auto">
                <div className="fw-bold">{room}</div>
                <Button
                onClick={openChat}
                >join chat
                </Button>
                <Button
                onClick={leaveChat}
                variant="danger"
                style={{marginLeft:'10px'}}
                >leave chat
                </Button>
            </div>
            <Badge variant="primary" pill>
                {notifications}
            </Badge>
        </ListGroup.Item>
    )

    return <h>loading...</h>

};

export default Chat;