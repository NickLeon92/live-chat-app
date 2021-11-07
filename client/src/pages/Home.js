
import {  useQuery } from '@apollo/client'
import { QUERY_ROOMS } from '../utils/queries'
import Chatwindow from '../components/Chatwindow'
import {Container} from 'react-bootstrap'
import Auth from '../utils/auth';


const Home = ({socket}) => {

  const { loading, data } = useQuery(QUERY_ROOMS)
  
  const roomData = data?.rooms || {}

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
  
          
        <Container key={singleRoomData._id} style={{border: 'solid', width: '400px'}}>
          <h1> Room: {singleRoomData.roomname} </h1>
          <Chatwindow socket={socket} roomdata={singleRoomData} myName={name}/>
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



