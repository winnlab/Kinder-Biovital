async = require 'async'

View = require '../../lib/view'
Auth = require '../../lib/auth'
Model = require '../../lib/model'
Logger = require '../../lib/logger'

locale = require '../../locale'

exports.index = (req, res) ->
	unless req.user
		res.redirect 'admin/login'
	else
		res.redirect '/admin/tales'

exports.login = (req, res)->
	unless req.user		
		View.render 'admin/auth/index', res
	else
		res.redirect '/admin/tales'	

exports.logout = (req, res)->
	req.logout()
	res.redirect '/admin/login'

exports.doLogin = (req, res) ->
	Auth.authenticate('admin') req, res

exports.tales = (req, res) ->
	async.waterfall [
		(next) ->
			Model 'Language', 'find', next, active: true
		(langs) ->
			View.render 'admin/layout', res, 
				locale: locale['ua']
				langs: langs
	], (err) ->
		msg = "Error in #{__filename}: #{err.message or err}"
		Logger.log 'error', msg
		View.clientFail err, res