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
    color:
        type: String
        default: ''
        set: (val) ->
            if val.charAt(0) is '#'
                val = val.slice 1

            return val.toLowerCase()

options =
    collection: 'coverColor'

FragmentShema = new mongoose.Schema FragmentShemaFields, options

module.exports =  mongoose.model 'CoverColor', FragmentShema
