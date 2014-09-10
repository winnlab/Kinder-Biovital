
View = require '../../lib/view'

exports.index = (req, res) ->
	View.render 'user/index', res, {}

exports.ie = (req, res) ->
	View.render 'user/ie', res, {}
