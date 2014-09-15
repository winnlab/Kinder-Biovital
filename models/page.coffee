mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

PageShema =
    link:
    	type: String
    	trim: true
    	required: true
    view:
    	type: String
    	trim: true
    frames: [
        frame: [
            languageId:
                type: ObjectId
                ref: 'Language'
            title:
                type: String
                trim: true
            text:
                type: String
                trim: true
        ]
    ]
    lang: [
        languageId:
            type: ObjectId
            ref: 'Language'
        title:
            type: String
            trim: true
    ]

options =
	collection: 'pages'

ProductShema = new mongoose.Schema PageShema, options

module.exports =  mongoose.model 'Page', ProductShema
