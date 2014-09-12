mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId
Mixed = mongoose.Schema.Types.Mixed

FragmentShemaFields =
    userId:
        type: ObjectId
        ref: 'User'
    trackId:
        type: ObjectId
        ref: 'Track'
    coverImgId:
        type: ObjectId
        ref: 'CoverImage'
    coverColorId:
        type: ObjectId
        ref: 'CoverColor'
    frames: [
        decorationId:
            type: ObjectId
            ref: 'Decoration'
        # 0 is day, 1 is night
        time:
            type: Number
            trim: true
        text:
            type: String
            trim: true
        left:
            type: Number
            default: ''
            required: true
        heroes: [
            heroId:
                type: ObjectId
                ref: 'Hero'
            name:
                type: String
                trim: true
                default: ''
            left:
                type: Number
                required: true
            top:
                type: Number
                required: true
            replica:
                replicaID:
                    type: ObjectId
                    ref: 'Replica'
                left:
                    type: Number
                top:
                    type: Number
                text:
                    type: String
                    trim: true
                    default: ''
        ]
    ]
    name:
        type: String
        trim: true
    # 0 is tale added by admin, 1 is tale added by user
    type:
        type: Number
        default: 1
    link:
        type: String
    ready:
        type: Boolean

options =
    collection: 'tales'

FragmentShema = new mongoose.Schema FragmentShemaFields, options

module.exports =  mongoose.model 'Tale', FragmentShema
