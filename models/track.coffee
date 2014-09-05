mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId
Mixed = mongoose.Schema.Types.Mixed

FragmentShemaFields =
    name:
        type: String
        trim: true
    position:
        type: Number
        required: true
    sound:
        mp3:
            type: String
            default: ''
        wav:
            type: String
            default: ''

options =
    collection: 'track'

FragmentShema = new mongoose.Schema FragmentShemaFields, options

module.exports =  mongoose.model 'Track', FragmentShema
