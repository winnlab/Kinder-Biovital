async = require 'async'

fb = require './fb'
vk = require './vk'
ok = require './ok'

socialConfig = require '../../meta/socialConfig'

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
            tale = doc
            getLikes "#{socialConfig.baseUrl}fairy-tale/#{doc._id}", next
        (data, next) ->
            tale.fbLikes = data.fb.total_count
            tale.vkLikes = data.vk
            tale.okLikes = data.ok

            tale.save next
    ], (err, data) ->        
        res.send data
