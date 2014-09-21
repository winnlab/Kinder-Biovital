express = require 'express'

Main = require './admin/main'
Hero = require './admin/hero'
Track = require './admin/track'
Page = require './admin/page'
CoverColor = require './admin/coverColor'
CoverImage = require './admin/coverImage'
Decoration = require './admin/decoration'
Tale = require './admin/tale'

Router = express.Router()

#########################

Router.get '/', Main.index
Router.get '/login', Main.login
Router.get '/logout', Main.logout

Router.post '/login', Main.doLogin

#------- Hero ---------#

Router.use '/hero/img', Hero.restFile
Router.use '/hero/:id?', Hero.rest

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

#------- Tale ---------#

Router.use '/tale/img', Tale.restFile
Router.use '/tale/:id?', Tale.rest

#------- Page ---------#

Router.use '/page/:id?', Page.rest

exports.Router = Router
exports.layoutPage = Main.tales
