async = require 'async'
_ = require 'underscore'

View = require '../../lib/view'
Model = require '../../lib/model'

locale = require '../../locale'

getQueryLang = (url) ->
	myRegexp = /^\/(ru|ua)/
	match = myRegexp.exec url
	return match?[1] or 'ua'

exports.index = (req, res) ->
	lang = getQueryLang req.originalUrl
	loc = locale[lang]
	View.render 'user/index', res,
		locale: loc
		lang: if lang is 'ua' then '' else lang

exports.getPage = (req, res) ->
	reqLang = getQueryLang req.originalUrl
	async.parallel
		page: (proceed) ->
			Page = Model 'Page', 'findOne', null, link: req.params.link
			Page.lean().exec proceed
		lang: (proceed) ->
			Language = Model 'Language', 'findOne', null, isoCode: reqLang
			Language.lean().exec proceed
	, (err, data) ->
		data.page.lang = _.find data.page.lang, (l) ->
			return l.languageId.toString() == data.lang._id.toString()
		_.map data.page.frames, (fr, i) ->
			fr.frame = _.find fr.frame, (l) ->
				return l.languageId.toString() == data.lang._id.toString()
			return fr

		View.clientSuccess data: data.page, res

exports.ie = (req, res) ->
	View.render 'user/ie', res, {}
