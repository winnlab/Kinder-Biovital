mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

schema = new mongoose.Schema	
	name:
		type: String
		required: true
	email: 
		type: String
	position: 
		type: Number
	img:
		type: String
	photos:
		type: Array
	sound:		
		mp3: 
			type: String
,
	collection: 'test'

module.exports = mongoose.model 'Test', schema