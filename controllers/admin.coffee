express = require 'express'

Main = require './admin/main'
Hero = require './admin/hero'

Router = express.Router()

#########################

Router.get '/', Main.index
Router.get '/login', Main.login
Router.get '/logout', Main.logout
Router.get '/tales', Main.tales

Router.post '/login', Main.doLogin

# Product REST api

#------- Hero ---------#

Router.use '/hero/img', Hero.restFile
Router.use '/hero/:id?', Hero.rest


exports.Router = Router
exports.layoutPage = Main.tales
