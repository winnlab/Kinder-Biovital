express = require 'express'

View = require '../lib/view'

Main = require './user/main.coffee'
Hero = require './admin/hero'
Replica = require './admin/replica'
Track = require './admin/track'
CoverColor = require './admin/coverColor'
CoverImage = require './admin/coverImage'
Decoration = require './admin/decoration'
Tale = require './admin/tale'

Router = express.Router()

Router.use (req, res, next) ->
	ie = (/MSIE ([0-9]{1,}[\.0-9]{0,})/g).exec req.headers['user-agent']
	if ie is null
		next()
	else
		version = parseFloat ie[0].replace('MSIE ', '')
		if version > 8
			next()
		else
			Main.ie req, res

#------- Tale ---------#

Router.get '/tale/:id?', Tale.rest
Router.post '/tale/:id?', Tale.rest
Router.put '/tale/:id?', Tale.rest

Router.get '/', Main.index
Router.get '/main', Main.index
Router.get '/create-tale', Main.index
Router.get '/fairy-tail/:name?', Main.index



#------- Hero ---------#

Router.get '/hero', Hero.rest

#------- Replica ---------#

Router.get '/replica', Replica.rest

#------- Track ---------#

Router.get '/track', Track.rest

#------- Cover colors ---------#

Router.get '/coverColor', CoverColor.rest

#------- Cover images ---------#

Router.get '/cover', CoverImage.rest

#------- Decoration ---------#

Router.get '/decoration', Decoration.rest

#------- Tale ---------#

Router.get '/tale', Tale.rest

exports.Router = Router
