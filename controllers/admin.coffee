express = require 'express'

Main = require './admin/main'

Router = express.Router()

#########################

Router.get '/', Main.index
Router.get '/login', Main.login
Router.get '/logout', Main.logout

Router.post '/login', Main.doLogin

# Product REST api

#----------------#

exports.Router = Router
exports.layoutPage = Main.dashboard