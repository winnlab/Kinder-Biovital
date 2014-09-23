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

adminController = require '../controllers/admin'
userController = require '../controllers/user'

jadeOptions =
	layout: false

sessionParams =
	secret: '4159J3v6V4rX6y1O6BN3ASuG2aDN7q'

routes = () ->
	@use '/', userController.Router
	@use '/admin', adminController.Router
	@use '/:lang(ru)', userController.Router

configure = () ->
	@set 'views', "#{__dirname}/../views"
	@set 'view engine', 'jade'
	@set 'view options', jadeOptions
	@use express.static "#{__dirname}/../public"
	@use multer
			dest: './public/uploads/',
			rename: (fieldname, filename) ->
				return Crypto.md5 filename + Date.now()
	@use Cache.requestCache
	@use bodyParser.json(limit: '50mb')
	@use bodyParser.urlencoded({limit: '50mb', extended: true})	
	@use cookieParser 'LmAK3VNuA6'
	@use session sessionParams
	@use passport.initialize()
	@use passport.session()
	@use '/admin', Auth.isAuth
	@use methodOverride()
	@use View.globals
	@use '/admin', (req, res, next) ->
		Ajax.isAjax req, res, next, adminController.layoutPage

exports.init = (callback) ->
	exports.express = app = express()
	exports.server = http.Server app

	configure.apply app
	routes.apply app

	callback null

exports.listen = (port, callback) ->
	exports.server.listen port, callback
