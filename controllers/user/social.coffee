async = require 'async'
_ = require 'underscore'

fb = require './fb'
vk = require './vk'
ok = require './ok'

socialConfig = require '../../meta/socialConfig'

View = require '../../lib/view'
Model = require '../../lib/model'

getLikes = (url, cb) ->
    async.parallel
        fb: (proceed) ->
            fb.likesCount url, proceed
        vk: (proceed) ->
            vk.likesCount url, proceed
        ok: (proceed) ->
            ok.likesCount url, proceed
    , cb

module.exports.countLikes = (req, res) ->
    tale = undefined

    async.waterfall [
        (next) ->
            Model 'Tale', 'findOne', next, _id: req.params.id
        (doc, next) ->
            unless doc
                return next 'No such tale found', {}
            tale = doc
            getLikes "#{socialConfig.baseUrl}like/#{doc._id}", next
        (data, next) ->
            tale.fbLikes = data.fb.total_count
            tale.vkLikes = data.vk
            tale.okLikes = data.ok

            tale.save next
    ], (err, data) ->
        res.send data

module.exports.taleLike = (req, res) ->
    botHeaders = [
        'OdklBot'
        'facebookexternalhit'
    ]

    isBot = _.find botHeaders, (bot) ->
        return req.headers['user-agent'].indexOf(bot) isnt -1

    if not isBot
        return res.redirect 301, "/fairy-tale/#{req.params.id}"

    async.waterfall [
        (next) ->
            Model 'Tale', 'findOne', next, _id: req.params.id
    ], (err, doc) ->
        View.render 'user/taleLike', res,
            fbAppId: socialConfig.facebook.clientID
            vkAppId: socialConfig.vk.apiId
            okAppId: socialConfig.odnoklassniki.clientID
            tale: doc
