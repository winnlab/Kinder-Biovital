mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId
Mixed = mongoose.Schema.Types.Mixed

FragmentShemaFields =
    name:
        type: String
        required: true
        trim: true
    position:
        type: Number
        required: true
        trim: true
    time:
        type: Number
        trim: true
    fg:
        type: String
        default: ''
    plan:
        type: String
        default: ''
    bg:
        type: String
        default: ''
    preview:
        type: String
        default: ''

options =
    collection: 'decorations'

FragmentShema = new mongoose.Schema FragmentShemaFields, options

module.exports =  mongoose.model 'Decoration', FragmentShema
