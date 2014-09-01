http = require 'http'
async = require 'async'
express = require 'express'
mongoose = require 'mongoose'
bodyParser = require 'body-parser'

connectDatabase = require '../../init/database'

exports.app = app = express()
exports.server = server = http.Server app

configure = () ->
	@use bodyParser()	

exports.startServer = (port, callback) ->	
	configure.apply app
	connectDatabase()
	server.listen port, callback

exports.stopServer = (cb) ->	
	async.waterfall [
		(next) ->
			server.close next
		(next) ->
			mongoose.connection.close cb
	]

# Crud = require '../../lib/crud'
# TestModel = require '../helpers/model'
# crud = new Crud	modelName: 'Test'

# Router = express.Router()
# Router.get '/crud', crud.request.bind crud

# app.use '/', Router

# exports.startServer 3000, ->