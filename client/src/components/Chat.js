import { useEffect, useState } from 'react'
import {  useMutation, useQuery } from '@apollo/client'
import { QUERY_ROOM } from '../utils/queries'
import { REMOVE_ROOM } from '../utils/mutations'
import {Container, Button, ListGroup, Badge} from 'react-bootstrap'


const Chat = ({setDisplayChat, socket, myName, room, rooms, setRoom, client}) => {
    const [removeRoom] = useMutation(REMOVE_ROOM)

    const joinData = {
        name: myName,
        room: room
      }

    const openChat = () => {


        // socket.emit("join_room", joinData)

        setDisplayChat((item) => {

            const check = item.filter(el => el !== room)
            return [...check, room]
        })
    }

    const leaveChat = async () => {

        const newRooms = rooms.filter(el => el !== room)
        // console.log(newRooms)
        setRoom(newRooms)
        console.log('leaving chat')
        socket.emit("ping_leave", joinData)
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
 
    const { loading, data } = useQuery(QUERY_ROOM, {variables:{ roomname: room }})

    // console.log(rooms)

    const roomData = data?.room || {}

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
                14
            </Badge>
        </ListGroup.Item>
    )

};

export default Chat;