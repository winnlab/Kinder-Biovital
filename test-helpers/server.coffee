http = require 'http'
async = require 'async'
multer = require 'multer'
express = require 'express'
mongoose = require 'mongoose'
bodyParser = require 'body-parser'

Crypto = require '../utils/crypto'
connectDatabase = require '../init/database'

exports.app = app = express()
exports.server = server = http.Server app

app.use bodyParser()
app.use bodyParser.urlencoded extended: false
app.use bodyParser.json()
app.use multer
	dest: './public/uploads/test/',
	rename: (fieldname, filename) ->
		return Crypto.md5 filename + Date.now()

exports.startServer = (port, callback) ->	
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