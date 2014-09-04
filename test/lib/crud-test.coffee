_ = require 'underscore'
async = require 'async'
should = require 'should'
request = require 'request'
express = require 'express'
mongoose = require 'mongoose'
supertest = require 'supertest'

url = 'http://localhost:3000'

data = require '../../test-helpers/migrate'
TestModel = require '../../test-helpers/model'
Server = require '../../test-helpers/server'

Model = require '../../lib/model'
Crud = require '../../lib/crud'

crud = new Crud	modelName: 'Test'

routing = ->
	Router = express.Router()

	REST = crud.request.bind crud

	Router.get '/crud', REST
	Router.get '/crud/:id?', REST
	Router.post '/crud', REST
	Router.put '/crud/:id?', REST
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

describe 'CRUD library', ->

	before (done) ->
		Server.app.use '/', routing()
		Server.startServer 3000, done
			
	after (done) ->
		Server.stopServer done

	beforeEach (done) ->
		beforeData done

	afterEach (done) ->
		afterData done

	describe '- utils', ->

		query = null

		beforeEach ->
			query = 
				queryOptions: 
					skip: 10
					limit: 10
					fields: "name description"
				id: 'some id'

		it 'should getOptions from query', ->
			crud._getOptions(query).should.be.exactly query.queryOptions

		it 'should get "fields" attribute from query and remove it', ->
			crud._parseFields(query).should.be.exactly 'name description'
			(query.queryOptions).should.not.have.property 'fields'

		it 'should get "queryOptions" attribute from query and remove it', ->
			crud._parseOptions(query).should.be.eql {
				skip: 10
				limit: 10
				fields: "name description"
			} 
			(query).should.not.have.property 'queryOptions'


	describe '- findAll', ->

		it 'should have findAll() method', ->
			crud.should.have.property '_findAll'
			crud.should.have.property 'findAll'

		it 'should return all objects from test', (done) ->
			request.get
				url: "#{url}/crud"
			, (err, response, body) ->
				should.not.exist err
				res = JSON.parse(body).data
				(res.length).should.be.exactly 3
				done()

		it 'should return Andrew entity', (done) ->
			request.get
				url: "#{url}/crud?name=Andrew"
			, (err, response, body) ->
				should.not.exist err
				res = JSON.parse(body).data
				(res.length).should.be.exactly 1
				(res[0].name).should.eql 'Andrew'
				done()

		it 'should return just one entity', (done) ->
			request.get
				url: "#{url}/crud?queryOptions%5Blimit%5D=1"
			, (err, response, body) ->
				should.not.exist err
				res = JSON.parse(body).data
				(res.length).should.be.exactly 1
				done()

		it 'should return one entity ofseted entity only with "_id" and "name" attribute', (done) ->
			request.get
				url: "#{url}/crud?queryOptions%5Blimit%5D=1&queryOptions%5Bskip%5D=1&queryOptions%5Bfields%5D=name"
			, (err, response, body) ->
				should.not.exist err
				res = JSON.parse(body).data[0]
				(res).should.have.keys '_id', 'name'
				(res).should.not.have.keys 'position'
				(res).should.containEql _.pick data.data[1], '_id', 'name'
				done()

		it 'should sort entities by name', (done) ->
			request.get
				url: "#{url}/crud?queryOptions%5Bsort%5D=name"
			, (err, response, body) ->
				should.not.exist err
				res = JSON.parse(body).data
				sorted = _.sortBy data.data, (entity) ->
					return entity.name
				(res.length).should.be.exactly 3
				(res).should.containDeep sorted
				done()


	describe '- findOne', ->

		it 'should have findOne method', ->
			crud.should.have.property '_findOne'
			crud.should.have.property 'findOne'

		it 'should find entity by id', (done) ->
			randEtity = data.data[_.random 0, data.data.length - 1]
			request.get
				url: "#{url}/crud/#{randEtity._id}"
			, (err, response, body) ->
				should.not.exist err
				res = JSON.parse(body).data
				(res).should.containDeep randEtity
				done()


	describe '- save', ->
		it 'should have save method', ->
			crud.should.have.property '_save'
			crud.should.have.property 'add'
			crud.should.have.property 'update'

		it 'should add entity to collection', (done) ->
			newTest = 
				name: 'Mark'
				email: 'kasyanov.mark@gmail.com'
				position: 4
			
			supertest(Server.app)
				.post('/crud')
				.send(newTest)
				# .expect('Content-Type', /json/)
				# .expect(200)
				.end (err, res) ->
					should.not.exist err
					should.exist res.body.data
					res.body.data.should.be.a.String

					done()

		it 'should update entity in collection', (done) ->
			updateData = 
				name: 'Andrew update'
				email: 'andrew.updated.sygyda@gmail.com'
				position: 5

			updatedData = _.extend data.data[0], updateData
			supertest(Server.app)
				.put("/crud/#{updatedData._id}")
				.send(updatedData)
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err
					should.exist res.body.data
					(res.body.data).should.eql updatedData
					done()


	describe '- remove', ->

		it 'should have findOne method', ->
			crud.should.have.property '_remove'
			crud.should.have.property 'remove'

		it 'should remove document from collection', (done) ->
			supertest(Server.app)
				.delete("/crud/#{data.data[0]._id}")
				.expect('Content-Type', /json/)
				.expect(200)
				.end (err, res) ->
					should.not.exist err
					should.exist res.body.data
					(res.body.data._id).should.eql data.data[0]._id
					done()

		it 'should return error if no "id" param is pass', (done) ->
			supertest(Server.app)
				.delete("/crud")
				.expect('Content-Type', /json/)
				.expect(500)
				.end (err, res) ->
					should.not.exist err
					res.body.success.should.eql false
					res.body.err.should.eql 'There no "id" param in a query'
					done()