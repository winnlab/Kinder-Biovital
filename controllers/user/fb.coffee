request = require 'request'

module.exports.likesCount = (url, cb) ->
    requestUrl = "http://api.facebook.com/restserver.php?method=links.getStats&urls=#{url}&format=json"

    request requestUrl, (error, response, body) ->
        body = JSON.parse body
        cb error, body[0]
