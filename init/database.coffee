mongoose = require 'mongoose'

module.exports = () ->

	opts =
		server: { auto_reconnect: true, primary:null, poolSize: 50 },
		replset: {}
		user: 'admin',
		pass: '84GP24MxtXSg2JW',
		host: 'localhost'
		port: '27017'
		database: 'Biovital'
		primary: null

	opts.server.socketOptions = opts.replset.socketOptions = 
		keepAlive: 1

	connString = 'mongodb://'+opts.user+":"+opts.pass+"@"+opts.host+":"+opts.port+"/"+opts.database+"?auto_reconnect=true"

	mongoose.connect connString, opts