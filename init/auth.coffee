async = require 'async'

passport = require 'passport'
localStrategy = require('passport-local').Strategy
odnoklassnikiStrategy = require('passport-odnoklassniki').Strategy

socialConfig = require '../meta/socialConfig'

mongoose = require 'mongoose'
Model = require '../lib/model'

parameters =
	usernameField: 'username'
	passwordField: 'password'

passport.serializeUser (user, done) ->
	done null, user

# passport.serializeUser (user, done) ->
# 	done null, user.id

passport.deserializeUser (user, done) ->
	done null, user
# passport.deserializeUser (id, done) ->
	# async.waterfall [
	# 	(next)->
	# 		Model 'User', 'findOne', next, _id: id
	# 	(user, next) ->
	# 		done null, user
	# ], done

validation = (err, user, password, done) ->
	if err
		return done err
	if not user
		return done null, false, { message: 'Пользователь с таким именем не существует!' }
	if not user.validPassword password
		return done null, false, { message: 'Пароль введен неправильно.' }

	done null, user

adminStrategy = (username, password, done) ->
	cb = (err, user) ->
		validation err, user, password, done
	Model 'User', 'findOne', cb, {username : username}

userStrategy = (username, password, done) ->
	cb = (err, user) ->
		validation err, user, password, done
	Model 'Client', 'findOne', cb, {username : username}

exports.init = (callback) ->
	adminAuth = new localStrategy adminStrategy
	clientAuth = new localStrategy userStrategy

	odnoklassnikiAuth = new odnoklassnikiStrategy
		clientID: socialConfig.odnoklassniki.clientID
		clientPublic: socialConfig.odnoklassniki.clientPublic
		clientSecret: socialConfig.odnoklassniki.clientSecret
		callbackURL: socialConfig.odnoklassniki.callbackURL

	, (accessToken, refreshToken, profile, done) ->
		process.nextTick ->
			profile.accessToken = accessToken
			profile.refreshToken = refreshToken
			done null, profile

	passport.use 'odnoklassniki', odnoklassnikiAuth
	passport.use 'admin', adminAuth
	passport.use 'user', clientAuth

	callback()
