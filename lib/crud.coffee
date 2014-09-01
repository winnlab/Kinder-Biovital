_ = require 'underscore'
async = require 'async'

Logger = require './logger'
Model = require './model'
View = require './view'

class Crud
	
	constructor: (options) ->
		@options = options
		@options.filename = __filename

	request: (req, res) ->
		cb = (err, data) =>
			@result err, data, res

		switch req.method
			when "GET"
				if _.isEmpty req.params
					@_findAll req, cb
				else
					@_findOne req.params
			when "POST"
				console.log req.params

			when "PUT"
				console.log req.params

			when "DELETE"
				console.log req.params

	DataEngine: (ModelName, method, cb, args...) ->
		Model ModelName, method, cb, args...

	_findAll: (req, cb) ->
		query = req.query

		options = if query.queryOptions then query.queryOptions else {}
		
		if query.queryOptions
			delete query.queryOptions

		fields = if options.fields then options.fields else null		

		if options.fields
			delete options.fields
					
		@findAll query, cb, options, fields

	findAll: (query, cb, options = {}, fields = null) ->
		@DataEngine @options.modelName, 'find', cb, query, fields, options

	findOne: (req, res) ->

	save: (req, res) ->

	remove: (req, res) ->

	###
		Sending result to client
	###
	result: (err, data, res) ->
		if err
			@fail err, res
		else
			@success data, res

	success: (data, res) ->		
		View.clientSuccess data: data, res

	fail: (err, res) ->
		msg = "Error in #{@options.filename}: #{err.message or err}"
		Logger.log 'error', msg
		View.clientFail err, res

module.exports = Crud