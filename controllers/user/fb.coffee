request = require 'request'
async = require 'async'

View = require '../../lib/view'
Model = require '../../lib/model'

socialConfig = require '../../meta/socialConfig'

module.exports.likesCount = (url, cb) ->
    requestUrl = "http://api.facebook.com/restserver.php?method=links.getStats&urls=#{url}&format=json"

    request requestUrl, (error, response, body) ->
        body = JSON.parse body
        cb error, body[0]

module.exports.taleLike = (req, res) ->
    async.waterfall [
        (next) ->
            Model 'Tale', 'findOne', next, _id: req.params.id
    ], (err, doc) ->
        View.render 'user/fbTaleLike', res,
            appId: socialConfig.facebook.clientID
            tale: doc
