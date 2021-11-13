
import {  useMutation, useQuery } from '@apollo/client'
import { QUERY_ROOMS } from '../utils/queries'
import { ADD_ROOM } from '../utils/mutations'
import Chatwindow from '../components/Chatwindow'
import {Container, Button} from 'react-bootstrap'
import Auth from '../utils/auth';
import { useEffect } from 'react'




const Home = ({setDisplayChat, socket}) => {


  const { loading, data } = useQuery(QUERY_ROOMS)
  
  const roomData = data?.rooms || {}

  // useEffect(() => {
  //   socket.emit('leave_rooms')
  // },[])


  // console.log(roomData)

  if(Auth.loggedIn()){
    const name = Auth.getProfile().data.username
    // console.log(name)
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <main>
      <Container style={{display:'flex', flexWrap: 'wrap'}} >
      {roomData.map((singleRoomData) => {
        return (
  
          
        <Container key={singleRoomData._id} style={{border: 'solid', width: '400px', marginTop:'3rem'}}>
          <h1 style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow:'ellipsis'}}> Room: {singleRoomData.roomname} </h1>

          
          <Chatwindow setDisplayChat={setDisplayChat} socket={socket} roomdata={singleRoomData} myName={name}/>
        </Container>
  
        )
      }
        )}
      </Container>
    </main>
  );
  }
  else{
    return <div>please log in</div>
  }




};

export default Home;



