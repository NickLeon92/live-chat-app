const {Schema, model} = require('mongoose')

const roomSchema = new Schema ({
    roomname: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },

    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message'

        }
    ],
})

const Room = model("Room", roomSchema)

module.exports = Room