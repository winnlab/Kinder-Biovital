mongoose = require 'mongoose'

ObjectId = mongoose.Schema.Types.ObjectId

schema = new mongoose.Schema	
	name:
		type: String
		required: true	
,
	collection: 'test'

module.exports = mongoose.model 'Test', schema