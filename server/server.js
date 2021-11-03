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

  socket.on("join_room", (data)=>{
    socket.join(data)
    console.log(`User: ${socket.id} has joined room: ${data}`)
  })

  socket.on("send_message", (data)=>{
    console.log(data)
    socket.to(data.room).emit("get_message", data)

   const winner = (data) => {
     if( x.length < 2 ){
      x.push({data})
      console.log(x)
      if(x.length == 2){
        let winner = ''
        let first = x[0]
        let second = x[1]
        let firstScore = first.data.message.length
        let secondScore = second.data.message.length
        if(firstScore === secondScore){
          winner = `tie`
        }
        if(firstScore > secondScore){
          winner = `winner: ${first.data.sender}`
        }
        if(firstScore < secondScore){
          winner = `winner: ${second.data.sender}`
        }
        console.log(winner)
        x = [];
      }}
    }

    winner(data)

  })

  socket.on("disconnect", () => {
    console.log("User Disconnected: ", socket.id)
  })

})

server.applyMiddleware({ app });


app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, '../client/build/index.html'));
//});

db.once('open', () => {
  socketServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
