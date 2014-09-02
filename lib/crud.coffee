_ = require 'underscore'
async = require 'async'

Logger = require './logger'
Model = require './model'
View = require './view'

class Crud
	
	constructor: (options) ->
		@options = options
		@options.filename = __filename

	# The name of query options field
	queryOptions: 'queryOptions'

	# This is the main method of CRUD library.
	# It is check query type and call corresponding function.
	# Arguments to cor. function is req and cb
	request: (req, res) ->
		cb = (err, data) =>
			@result err, data, res

		switch req.method
			when "GET"
				if _.isEmpty req.params
					@_findAll req, cb
				else
					@_findOne req, cb
			when "POST", "PUT"
				@_save req, cb
			when "DELETE"
				@_remove req, cb

	# This is the data-model wrapper.
	DataEngine: (ModelName, method, cb, args...) ->
		Model ModelName, method, cb, args...

	_getOptions: (query) ->
		if query[@queryOptions] then query[@queryOptions] else {}

	# Check of existing "fields" attribute in query options and in case if 
	# this field is exist, the method will remove it from options.
	_parseFields: (query) ->
		options = @_getOptions(query)

		fields = if options.fields then options.fields else null

		if options.fields
			delete options.fields

		return fields

	# Check of existing "options" attribute in query and in case if 
	# this attribute is exist, it will remove "options" from query.
	_parseOptions: (query) ->
		options = @_getOptions(query)
		
		if query[@queryOptions]
			delete query[@queryOptions]

		return options

	_findAll: (req, cb) ->
		query = req.query
		fields = @_parseFields req.query
		options = @_parseOptions req.query
		@findAll query, cb, options, fields

	findAll: (query, cb, options = {}, fields = null) ->
		@DataEngine @options.modelName, 'find', cb, query, fields, options

	_findOne: (req, cb) ->
		id = req.params.id
		fields = @_parseFields req.query
		options = @_parseOptions req.query
		@findOne id, cb, options, fields

	findOne: (id, cb, options = {}, fields = null) ->
		@DataEngine @options.modelName, 'findById', cb, id, fields, options

	# Depends of id property this method call "add" or "update" functions
	_save: (req, cb) ->
		id = req.body._id or req.params.id
		
		if id
			delete req.body._id if req.body._id
			@update id, req.body, cb
		else
			@add req.body, cb

	add: (data, cb) ->
		next = (err, data) ->
			cb err, data._id

		@DataEngine @options.modelName, 'create', next, data

	update: (id, data, cb) ->
		async.waterfall [
			(next) =>
				@DataEngine @options.modelName, 'findById', next, id
			(doc, next) =>
				_.extend doc, data
				doc.save cb
		], cb

	_remove: (req, cb) ->
		id = req.params.id

		if id
			@remove id, cb
		else
			cb 'There no "id" param in a query'
		
	remove: (id, cb) ->
		async.waterfall [
			(next) =>
				@DataEngine @options.modelName, 'findOne', next, _id: id
			(doc) ->
				doc.remove cb
		], cb

	# File request function
	fileRequest: (req, res) ->
		cb = (err, data) =>
			@result err, data, res

		switch req.method
			when "POST"
				@_upload req, cb
			when "DELETE"
				@_removeFile req, cb

	_getUploadedFile: (doc, opt) ->
		if opt.parent
			return doc[opt.parent][opt.name]
		else
			return doc[opt.name]

	_upload: (req, cb) ->
		id = req.body.id or req.body._id
		fieldName = req.body.name
		fileOpts = _.find @options.files, (file) ->
			return file.name == fieldName
		file = req.files?[fieldName]?.name

		if id and fileOpts and file
			async.waterfall [
				(next) =>
					@findOne id, next
				(doc, next) =>
					uploadedFile = @_getUploadedFile doc, fileOpts

					if fileOpts.replace and uploadedFile
						@removeFile uploadedFile, (err) ->
							next err, doc
					else
						next null, doc
				(doc) =>
					@upload doc, file, fileOpts, cb
			], cb

		else
			cb 'Error. there are unknown "id" or "fieldName"'

	upload: (doc, file, fileOpts, cb) ->
		if fileOpts.type is 'string'
			if fileOpts.parent
				doc[fileOpts.parent][fileOpts.name] = file
			else
				doc[fileOpts.name] = file
		else
			target = @_getUploadedFile doc, fileOpts
			target.push file

		doc.save () ->
			data = {}
			data[fileOpts.name] = file
			cb null, data

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