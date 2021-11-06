import React ,{useEffect, useRef} from 'react';
import {Container, Card} from 'react-bootstrap'



const Chatwindow = ({socket, roomdata, myName}) => {
    console.log(roomdata.messages)

    const messageHistory = roomdata.messages

    const dummyDiv = useRef(null)

    useEffect(() => {
        dummyDiv.current?.scrollIntoView()
    })

  return (
    
      <Container style={{height: '200px', overflowY:'auto', border:'solid'}}>
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
            <div ref={dummyDiv}></div>
      </Container>
    
  );

};

export default Chatwindow;