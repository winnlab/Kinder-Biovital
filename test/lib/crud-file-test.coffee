_ = require 'underscore'
fs = require 'fs'
async = require 'async'
should = require 'should'
express = require 'express'
mongoose = require 'mongoose'
request = require 'supertest'

data = require '../../test-helpers/migrate'
TestModel = require '../../test-helpers/model'
Server = require '../../test-helpers/server'

Model = require '../../lib/model'
Crud = require '../../lib/crud'

crud = new Crud	
	modelName: 'Test'
	files: [
		name: 'img'
		replace: true
		type: 'string'
	,
		name: 'photos'
		replace: false
		type: 'array'
	,
		name: 'mp3'
		replace: true
		type: 'string'
		parent: 'sound'
	]

routing = ->
	Router = express.Router()

	REST = crud.fileRequest.bind crud
	
	Router.post '/crud', REST	
	Router.delete '/crud/:id?', REST

	return Router

beforeData = (done) ->
	async.each data.data, (entity, proceed) ->
		TestModel.findByIdAndUpdate entity._id, entity, upsert: true, ->
			proceed()
	, done

afterData = (done) ->
	mongoose.connection.db.dropCollection 'test', done

### 
	Spec describes
###

describe 'CRUD file api', ->

	before (done) ->
		Server.app.use '/', routing()
		Server.startServer 3000, ->
			beforeData done

	after (done) ->
		uploadPath = 'public/uploads/test'
		async.waterfall [
			(next) ->
				afterData next
			(droped, next) ->
				fs.readdir uploadPath, next
			(files, next) ->
				async.each files, (file, proceed) ->
					fs.unlink "#{uploadPath}/#{file}", proceed
				, next				
			() ->
				Server.stopServer done
		], (err) ->
			throw err

	describe '- File upload', ->

		it 'should have upload method', ->
			crud.should.have.property '_upload'
			crud.should.have.property 'upload'

		it 'should upload single file to entity', (done) ->
			request(Server.app)
				.post('/crud')
				.attach('img', 'test-helpers/images/zaz.jpg')
				.field('id', data.data[0]._id)
				.field('name', 'img')
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err
					res.body.data.should.be.a.Object
					res.body.data.img.should.be.a.String

					next = (err, doc) ->
						doc.img.should.not.eql false
						doc.img.should.eql res.body.data.img
						doc.img.should.be.a.String
						done()

					Model 'Test', 'findById', next, data.data[0]._id

		it 'should upload file and replace the old one', (done) ->
			done()
