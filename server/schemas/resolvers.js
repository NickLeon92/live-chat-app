const { AuthenticationError } = require('apollo-server-express');
const { User, Room, Message } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    rooms: async (parent, args) => {
      return await Room.find().populate('messages')
    },
    room: async (parent, args) => {
      console.log(`searching for room: ${args.roomname}`)
      return await Room.findOne({roomname: args.roomname}).populate('messages')
    }
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addRoom: async (parent, {roomname}, context) => {
      console.log('attempting to save roomname..')
      if(context.user){
      await User.findOneAndUpdate(
        {_id: context.user._id},
        {$addToSet: {rooms: roomname}}
        )
      }
      try{
        if(!await Room.findOne({roomname: roomname})){
          return await Room.create({
          roomname
          })
          
        }


      }catch (err) {
        console.log(err)
      }
      console.log('addroom resolver done')
    },
    addMessage: async (parent, {message, sender, roomname}) => {
      console.log('attempting to save message..')
      const newMessage = await Message.create({
        message,
        sender,
        roomname
      })

      return await Room.findOneAndUpdate(
        {roomname: roomname},
        { $addToSet: { messages: newMessage._id } }
        )

      },
    removeRoom: async (parent, {roomname}, context) => {
      console.log('attempting to remove room from user...')
      try{

          if(context.user){
          await User.findOneAndUpdate(
            {_id: context.user._id},
            {$pull: {rooms: roomname}}
            )
          }
       
      }catch (err) {
        console.log(err)
      }
    },
    
  },
};

module.exports = resolvers;
