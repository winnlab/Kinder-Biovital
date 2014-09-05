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
    img:
        type: String
        default: ''

options =
    collection: 'replica'

FragmentShema = new mongoose.Schema FragmentShemaFields, options

module.exports =  mongoose.model 'Replica', FragmentShema
