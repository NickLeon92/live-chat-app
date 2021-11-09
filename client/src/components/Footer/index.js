import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from 'react-bootstrap'

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
    <footer className="w-100 mt-auto bg-secondary p-4">
      <div className="container text-center mb-5">
        <Link to="/">
        <Button
          // onClick = {leaveRooms}
          >home
          </Button>
        </Link>
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
      </div>
    </footer>
  );
};

export default Footer;
