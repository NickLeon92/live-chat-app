import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Container }  from 'react-bootstrap'
import ScrollToTopBtn from "./ScrollToTop";

const Footer = (room, myName, socket) => {

  // const leaveRooms = async () => {
  //   console.log(room.room)
  //   if(room.room.length > 0){

      
  //     for (let i = 0; i < room.room.length; i++) {
  //       console.log('running')
        
  //       await socket.emit("ping_leave",
  //        {room: room.room[i],
  //         name: myName})
  //     }
  //   }
  // }

  

  return (
    <Container style={{textAlign:'center', padding: '.5rem', background:'darkgrey', marginTop: '1rem'}}>
      <Container>

      <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center'}}>
        <Link to="/">
        <Button style={{margin:'1rem'}}
          // onClick = {leaveRooms}
          >home
        </Button>
        </Link>
          <ScrollToTopBtn />
      </div>

        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by Nick Leon.
        </h4>
        </Container>
      </Container>
  );
};

export default Footer;
