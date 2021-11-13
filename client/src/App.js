import React, { useEffect, useState } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {Container, Toast} from 'react-bootstrap'
import io from 'socket.io-client'

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';


// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const socket = io.connect("/")

function App() {

  const [displayChat, setDisplayChat] = useState([])
  const [inbox, setInbox] = useState({})
  const [show, setShow] = useState(true);

  useEffect(() => {
    socket.on("get_notification", (data) => {
      console.log(data)

      setInbox(data)
      setShow(true)

      localStorage.setItem(`${data.room}-CurrentLength`, data.listSize)
    })
  },[socket])

  return (
    <ApolloProvider client={client}>
      <Router>
        <Container>
          {/* {inbox !== {}? */}
          {/* <Toast style ={{position:'fixed', top: '0', right: '0', marginTop:'10px', marginRight: '10px'}}>
            <Toast.Header>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">{inbox.sender}</strong>
              <small>{`room: ${inbox.room}`}</small>
            </Toast.Header>
            <Toast.Body>{inbox.message}</Toast.Body>
          </Toast> */}
          {/* :
          <></>
          } */}
          <Header />
          <div className="container">
            <Route exact path="/">
              <Home setDisplayChat={setDisplayChat} socket={socket}/>
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/signup">
              <Signup />
            </Route>
            <Route exact path="/me">
              <Profile displayChat={displayChat} setDisplayChat={setDisplayChat} client={client} socket={socket}/>
            </Route>
          </div>
          <Footer/>
          {inbox.room !== undefined?(
          <Toast style ={{position:'fixed', top: '0', right: '0', marginTop:'10px', marginRight: '10px'}} onClose={() => setShow(false)} show={show} delay={4000} autohide>
            <Toast.Header>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">{inbox.sender}</strong>
              <small>{`room: ${inbox.room}`}</small>
            </Toast.Header>
            <Toast.Body>{inbox.message}</Toast.Body>
          </Toast>
          ):(
          <></>
          )}
         </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;
