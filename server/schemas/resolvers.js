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
    addRoom: async (parent, {roomname}) => {
      console.log('attempting to save roomname..')
      return await Room.create({
        roomname
      })
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

      }
    
  },
};

module.exports = resolvers;
