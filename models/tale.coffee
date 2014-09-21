mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId
Mixed = mongoose.Schema.Types.Mixed

TaleShemaFields =
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
    postId:
        type: String
    cover:
        type: String
        default: ''
    network:
        type: String
        default: ''
    user:
        id:
            type: String
        link:
            type: String
        firstName:
            type: String
        lastName:
            type: String
        photo:
            type: String
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
    left:
        type: Number
    top:
        type: Number
    shared:
        type: Number
        default: 0
    # 0 is tale added by admin, 1 is tale added by user
    type:
        type: Number
        default: 1
    active:
        type: Number
        default: 0

options =
    collection: 'tales'

TaleShema = new mongoose.Schema TaleShemaFields, options

module.exports =  mongoose.model 'Tale', TaleShema
