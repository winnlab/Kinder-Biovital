_ = require 'underscore'
fs = require 'fs'
fse = require 'fs-extra'
async = require 'async'
should = require 'should'
express = require 'express'
mongoose = require 'mongoose'
request = require 'supertest'

data = require '../../test-helpers/migrate'
Server = require '../../test-helpers/server'
TestModel = require '../../test-helpers/model'


Crud = require '../../lib/crud'
Model = require '../../lib/model'

crud = new Crud	
	modelName: 'Test'
	uploadDir: './public/uploads/test/'
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
	Router.delete '/etityCrud', crud.request.bind crud

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

describe.skip 'CRUD file api', ->	

	uploadPath = 'public/uploads/test'

	before (done) ->
		Server.app.use '/', routing()
		Server.startServer 3000, ->
			beforeData done

	after (done) ->		
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

		uploadFile = (name, done) ->
			request(Server.app)
				.post('/crud')
				.attach(name, 'test-helpers/images/zaz.jpg')
				.field('id', data.data[0]._id)
				.field('name', name)
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err
					res.body.data.should.be.a.Object
					res.body.data[name].should.be.a.String

					next = (err, doc) ->
						if name is 'img'
							doc[name].should.not.eql false
							doc[name].should.eql res.body.data[name]
							doc[name].should.be.a.String
						else 
							doc['sound'][name].should.not.eql false
							doc['sound'][name].should.eql res.body.data[name]
							doc['sound'][name].should.be.a.String

						done()

					Model 'Test', 'findById', next, data.data[0]._id

		it 'should upload single file to entity', (done) ->
			uploadFile 'img', done

		it 'should upload file and replace the old one', (done) ->
			next = (err, doc) ->
				throw err if err
				doc.img = 'zaz.jpg'
				doc.save ->
					uploadFile 'img', done

			Model 'Test', 'findById', next, data.data[0]._id

		it 'should upload nested file to entity', (done) ->
			uploadFile 'mp3', done

		it 'should upload several files to entity', (done) ->
			request(Server.app)
				.post('/crud')
				.attach('photos[]', 'test-helpers/images/zaz.jpg')
				.attach('photos[]', 'test-helpers/images/ducati.jpg')
				.field('id', data.data[0]._id)
				.field('name', 'photos')
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err
					res.body.data.should.be.a.Object

					next = (err, doc) ->
						doc.photos.length.should.eql 2
						done()

					Model 'Test', 'findById', next, data.data[0]._id


	describe '- File remove', ->

		beforeEach (done) ->
			Model 'Test', 'findByIdAndUpdate', done, data.data[0]._id, 
				img: 'zaz.jpg'
				sound:
					mp3: 'mysound.mp3'
				photos: [
					'ducati.jpg'
					'mercedes.jpg'
				]

		it 'should remove single file', (done) ->
			request(Server.app)
				.delete('/crud')
				.send(
					'id': data.data[0]._id
					'name': 'img'
					'sourceName': 'zaz.jpg'
				)
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err

					Model 'Test', 'findById', (err, doc) ->
						should.not.exist doc.img
						done()
					, data.data[0]._id

		it 'should remove nested property file', (done) ->
			request(Server.app)
				.delete('/crud')
				.send(
					'id': data.data[0]._id
					'name': 'mp3'
					'sourceName': 'mysound.mp3'
				)
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err

					Model 'Test', 'findById', (err, doc) ->
						should.not.exist doc.sound.mp3
						done()
					, data.data[0]._id

		it 'should remove file from array', (done) ->
			request(Server.app)
				.delete('/crud')
				.send(
					'id': data.data[0]._id
					'name': 'photos'
					'sourceName': 'mercedes.jpg'
				)
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err

					Model 'Test', 'findById', (err, doc) ->
						doc.photos.should.be.instanceof(Array).and.have.lengthOf 1
						doc.photos[0].should.eql 'ducati.jpg'
						done()
					, data.data[0]._id

		it 'should remove document and all of it files', (done) ->
			ducati = 'public/uploads/test/ducati.jpg'
			mercedes =  'public/uploads/test/mercedes.jpg'
			zaz = 'public/uploads/test/zaz.jpg'
			mysound = 'public/uploads/test/mysound.mp3'

			files = [ducati, mercedes, zaz, mysound]

			checkFiles = (cb) ->
				async.each files, (file, next) ->
					fs.exists file, (exists) ->
						exists.should.eql false
						next null
				, cb

			copyFiles = (cb) ->
				async.each files, (file, next) ->
					fse.copy 'test-helpers/images/ducati.jpg', file, next
				, cb

			async.waterfall [
				(next) ->
					copyFiles next
				(next) ->
					request(Server.app)
						.delete('/etityCrud')
						.send(
							'id': data.data[0]._id
						)
						.expect('Content-Type', /json/)
						.expect(200)
						.end next
				(res, next) ->
					Model 'Test', 'find', next
				(docs, next) ->
					docs.should.be.instanceof(Array).and.have.lengthOf 2					
					next null
				(next) ->
					checkFiles next
			], (err) ->
				should.not.exist err
				done()