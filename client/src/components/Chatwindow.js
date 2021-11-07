import React ,{useEffect, useRef} from 'react';
import {Container, Alert} from 'react-bootstrap'



const Chatwindow = ({socket, roomdata, myName}) => {
    // console.log(roomdata.messages)

    const messageHistory = roomdata.messages

    const dummyDiv = useRef(null)

    useEffect(() => {
        dummyDiv.current?.scrollIntoView()
    })

  return (
    
      <Container style={{height: '300px', overflowY:'auto', border:'solid'}}>
        {messageHistory.map((item)=>{
                return (
                    <div key={item._id} style={ item.sender === myName ? { display:'flex', justifyContent: 'right'} : {}}>
                      <Alert ref={dummyDiv} style={{paddingBottom:'.25rem'}} variant={'success'}>
                        <h4 style={{fontSize: '1.1rem'}}>{item.sender}</h4>
                        <p>{item.message}</p>
                    </Alert>

                    </div>
                     )
                 })}
            <div ref={dummyDiv}></div>
      </Container>
    
  );

};

export default Chatwindow;