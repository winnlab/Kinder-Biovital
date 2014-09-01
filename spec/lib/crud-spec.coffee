async = require 'async'
should = require 'should'
request = require 'request'
express = require 'express'
mongoose = require 'mongoose'

url = 'http://localhost:3000'

TestModel = require '../helpers/model'
Server = require '../helpers/server'

Model = require '../../lib/model'
Crud = require '../../lib/crud'

crud = new Crud	modelName: 'Test'

routing = ->
	Router = express.Router()

	Router.get '/crud', crud.request.bind crud
	# Router.get '/crud/:id?', crud.findOne
	# Router.post '/crud', crud.save
	# Router.put '/crud/:id?', crud.save
	# Router.delete '/crud/:id?', crud.remove

	return Router

Server.app.use '/', routing()
Server.startServer 3000, ->

### 
	Spec describes
###

describe 'CRUD library', ->

	describe 'findAll', ->

		it 'should have findAll() method', ->
			crud.should.have.property 'findAll'

		it 'should return all objects from test', (done) ->
			request.get
				url: "#{url}/crud",
			, (err, response, body) ->
				expect(err).toBe null
				res = JSON.parse(body).data
				expect(res.length).toBe 3				
				done()

		it 'should return Andrew entity', (done) ->
			request.get
				url: "#{url}/crud?name=Andrew",
			, (err, response, body) ->
				expect(err).toBe null
				res = JSON.parse(body).data
				expect(res.length).toBe 1
				expect(res[0].name).toBe 'Andrew'
				done()

		it 'should return just one entity', (done) ->
			request.get
				url: "#{url}/crud?queryOptions%5Blimit%5D=1",
			, (err, response, body) ->
				expect(err).toBe null
				res = JSON.parse(body).data
				expect(res.length).toBe 1
				done()

		it 'should sort entities by name', (done) ->
			request.get
				url: "#{url}/crud?queryOptions%5Bsort%5D=name",
			, (err, response, body) ->
				expect(err).toBe null				
				res = JSON.parse(body).data
				expect(res.length).toBe 3
				done()

	describe 'After all', ->
		it 'should close server', (done) ->
			Server.stopServer done