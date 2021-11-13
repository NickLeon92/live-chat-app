const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const { createServer } = require("http");
const cors = require("cors")
const {Server} = require('socket.io')

app.use(cors())

const socketServer = createServer(app)

const io = new Server(socketServer, {
  cors:{
    origin:"http://localhost:3000",
    methods: ["GET" , "POST"],
  }
})
//socketServer.listen(4000)
let x =[];

io.on("connection", (socket) => {
  console.log(socket.id)

  const key = 'SuperSecretListServeKey'

  socket.on("join_room", (data)=>{
    socket.join(data.room)
    socket.join(data.room+key)
    console.log(`User: ${data.name}, socketID: ${socket.id} has joined room: ${data.room}`)
    console.log(`User: ${data.name}, socketID: ${socket.id} has joined listServe: ${data.room+key}`)
    // const userData = {
    //   username: data.name,
    //   socketID: socket.id,
    //   roomname: data.room,
    // }
    // socket.to(data.room).emit("ping_room", userData)
  })

  socket.on("init_ping", (data) => {
    console.log(`User: ${data.name}, socketID: ${socket.id} has joined chatbox: ${data.room}`)
    const userData = {
      username: data.name,
      socketID: socket.id,
      roomname: data.room,
    }

    socket.to(data.room).emit("ping_room", userData)
  })

  socket.on("return_ping", (data) => {
    console.log(data)
    console.log('pinging back')
    const userData = {
      username: data.name,
      socketID: socket.id,
      roomname: data.room,
    }
    console.log(userData)
    socket.to(data.socketID).emit("online_users", userData)
  })

  socket.on("ping_leave", (data) => {
    console.log(`User: ${data.name}, socketID: ${socket.id} has left chatbox ${data.room}`)
    socket.to(data.room).emit("disconnected_users", socket.id)
    socket.leave(data.room)
    
  })
  
  socket.on("leave_room", (data) => {
    socket.broadcast.emit("disconnected_users", socket.id);
    console.log(`User: ${data.name}, socketID: ${socket.id} has left room ${data.room}`)
    socket.leave(data.room)
    socket.leave(data.room+key)
  })
  

  socket.on("send_message", (data)=>{
    console.log(data)
    socket.to(data.room).emit("get_message", data)
    socket.to(data.room+key).emit("get_notification", data)
    
  })
  

  socket.on("disconnect", () => {
    socket.broadcast.emit("disconnected_users", socket.id);
    console.log("User Disconnected: ", socket.id)
  })

})

server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: false }));
app.use(express.json());



if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  socketServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
