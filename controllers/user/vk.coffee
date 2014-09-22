request = require 'request'
async = require 'async'
path = require 'path'
fs = require 'fs'
http = require 'http'
http.post = require 'http-post'
rest = require 'restler'

Model = require '../../lib/model'

module.exports.likesCount = (url, cb) ->
    requestUrl = "http://vk.com/share.php?act=count&index=1&url=#{url}"
    request requestUrl, (error, response, body) ->
        body = body.replace 'VK.Share.count(1, ', ''
        body = body.replace ');', ''
        cb error, Number body



module.exports.upload = (req, res) ->
    async.waterfall [
        (next) ->
            Model 'Tale', 'findById', next, req.body.taleId
        (doc, next) ->
            r = request.post req.body.uploadUrl, next
            form = r.form()
            form.append 'photo', fs.createReadStream(path.join(__dirname, '../../public/uploads/' + doc.cover)), {contentType: 'image/png', filename: doc.cover}
        (httpResponse, body) ->
            res.send body
    ], (err) ->
        res.writeHead(500).send err
