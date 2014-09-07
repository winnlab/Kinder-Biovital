express = require 'express'

Main = require './admin/main'
Hero = require './admin/hero'
Replica = require './admin/replica'
Track = require './admin/track'
CoverColor = require './admin/coverColor'
CoverImage = require './admin/coverImage'
Decoration = require './admin/decoration'


Router = express.Router()

#########################

Router.get '/', Main.index
Router.get '/login', Main.login
Router.get '/logout', Main.logout
Router.get '/tales', Main.tales

Router.post '/login', Main.doLogin

#------- Hero ---------#

Router.use '/hero/img', Hero.restFile
Router.use '/hero/:id?', Hero.rest

#------- Replica ---------#

Router.use '/replica/img', Replica.restFile
Router.use '/replica/:id?', Replica.rest

#------- Track ---------#

Router.use '/track/sound', Track.restFile
Router.use '/track/:id?', Track.rest

#------- Cover colors ---------#

Router.use '/coverColor/:id?', CoverColor.rest

#------- Cover images ---------#

Router.use '/cover/img', CoverImage.restFile
Router.use '/cover/:id?', CoverImage.rest

#------- Decoration ---------#

Router.use '/decoration/img', Decoration.restFile
Router.use '/decoration/:id?', Decoration.rest

exports.Router = Router
exports.layoutPage = Main.tales
