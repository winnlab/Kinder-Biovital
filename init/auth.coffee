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
	done null, user.id

passport.deserializeUser (id, done) ->

	async.waterfall [
		(next)->
			Model 'User', 'findOne', next, _id : id
		(user, next) ->
			done null, user
	], done

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
		callbackURL: socialConfig.odnoklassniki.clientID

	, (accessToken, refreshToken, profile, done) ->

		process.nextTick ->
			async.waterfall [
				(next) ->
					Model 'User', 'findOne', next, {'ok.id': profile.id}
				(visitor, next) ->
					if visitor
						done null, visitor
					else
						Model 'User', 'create', done,
							ok:
								id: profile.id
								birthday: profile._json.birthday
							firstName: profile.name.givenName
							lastName: profile.name.familyName
			], done


	passport.use 'odnoklassniki', odnoklassnikiAuth
	passport.use 'admin', adminAuth
	passport.use 'user', clientAuth

	callback()
