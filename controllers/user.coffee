express = require 'express'
passport = require 'passport'

View = require '../lib/view'

Main = require './user/main.coffee'
VK = require './user/vk.coffee'
OK = require './user/ok.coffee'
Hero = require './admin/hero'
Track = require './admin/track'
CoverColor = require './admin/coverColor'
CoverImage = require './admin/coverImage'
Decoration = require './admin/decoration'
Tale = require './admin/tale'

Router = express.Router()

socialConfig = require '../meta/socialConfig'

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

Router.get '/tale', Tale.findTales
Router.post '/tale/img', Tale.restFile
Router.get '/tale/:id?', Tale.rest
Router.post '/tale/:id?', Tale.rest
Router.put '/tale/:id?', Tale.rest

Router.get '/', Main.index
Router.get '/main', Main.index
Router.get '/tales', Main.index
Router.get '/create-tale', Main.index
Router.get '/fairy-tale/:name?', Main.index
Router.get '/rating', Main.index
Router.get '/sp/:link?', Main.index

Router.post '/vk/upload', VK.upload

Router.get '/auth/odnoklassniki', OK.login
Router.get "/auth/#{socialConfig.odnoklassniki.clientID}", passport.authenticate "odnoklassniki",
	successRedirect: '/simplePage/personal-form'
	failureRedirect: '/simplePage/login-page'

#------- Hero ---------#

Router.get '/hero', Hero.rest

#------- Track ---------#

Router.get '/track', Track.rest

#------- Cover colors ---------#

Router.get '/coverColor', CoverColor.rest

#------- Cover images ---------#

Router.get '/cover', CoverImage.rest

#------- Decoration ---------#

Router.get '/decoration', Decoration.rest

#------- Page ---------#

Router.get '/page/:link', Main.getPage

exports.Router = Router
