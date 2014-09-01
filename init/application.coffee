http = require 'http'

express = require 'express'
async = require 'async'
passport = require 'passport'
roles = require 'roles'
_ = require 'underscore'

cookieParser = require 'cookie-parser'
bodyParser = require 'body-parser'
session = require 'express-session'
methodOverride = require 'method-override' 
multer = require 'multer'

Crypto = require '../utils/crypto'
Cache = require '../lib/cache'
View = require '../lib/view'
Auth = require '../lib/auth'
Ajax = require '../lib/ajax'

admin_controller = require '../controllers/admin'
user_controller = require '../controllers/user'

jadeOptions =
	layout: false

sessionParams =
	secret: '4159J3v6V4rX6y1O6BN3ASuG2aDN7q'

routes = () ->
	@use user_controller.Router
	@use '/', user_controller.Router
	@use '/:lang(ru|en)', user_controller.Router	
	@use '/admin', admin_controller.Router

configure = () ->
	@set 'views', "#{__dirname}/../views"
	@set 'view engine', 'jade'
	@set 'view options', jadeOptions
	@use express.static "#{__dirname}/public"	
	@use multer
			dest: './uploads/',
			rename: (fieldname, filename) ->
				return Crypto.md5 filename + Date.now()
	@use Cache.requestCache
	@use bodyParser()
	@use cookieParser 'LmAK3VNuA6'
	@use session sessionParams	
	@use passport.initialize()
	@use passport.session()
	@use '/admin', Auth.isAuth
	@use methodOverride()
	@use View.globals	
	@use '/admin', (req, res, next) ->
		Ajax.isAjax req, res, next, admin_controller.layoutPage

exports.init = (callback) ->
	exports.express = app = express()
	exports.server = http.Server app

	configure.apply app
	routes.apply app

	callback null

exports.listen = (port, callback) ->
	exports.server.listen port, callback