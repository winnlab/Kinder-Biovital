mongoose = require 'mongoose'
util = require('util')

noModel = 'Exception in Model library: model with name %s does not exist'
noMethod = 'Exception in Model library: method with name %s does not exist'

module.exports = (modelName, methodName, cb, args...) ->
	mdl = mongoose.models[modelName]

	throw new Error util.format noModel, modelName if mdl is undefined

	method = mdl[methodName]

	throw new Error util.format noMethod, methodName if method is undefined

	args.push cb

	method.apply mdl, args