request = require 'request'
async = require 'async'
path = require 'path'
fs = require 'fs'
http = require 'http'
http.post = require 'http-post'
rest = require 'restler'

module.exports.upload = (req, res) ->

    rest.post(req.body.uploadUrl, {
        multipart: true,
        data: {
            'photo': rest.file(path.join(__dirname, '../../' + req.files.photo.path), req.files.photo.path + '.png', req.files.photo.size, null, 'image/png')
        }
    }).on 'complete', (data) ->
        console.log('restler', data);
        res.send(data);


    # async.waterfall [
    #     (next) ->
            # r = request.post req.body.uploadUrl, (err, httpResponse, body) ->
            #     console.log body
            #     res.send body
            # form = r.form()
            # form.append 'photo', fs.createReadStream(path.join(__dirname, '../../' + req.files.photo.path)), {contentType: req.files.photo.mimetype, filename: req.files.photo.name, knownLength: req.files.photo.size}
    #     # (httpResponse, body) ->
    #     #     res.send body
    # ], (err) ->
    #     res.writeHead(500).send err

    # form.parse req, (err, fields, files) ->
    #     # r = request.post fields.uploadUrl, (err, httpResponse, body) ->
    #     #     res.send body
    #
    #
    #     console.log files: files
    #     # res.writeHead(200, {'content-type': 'text/plain'});
    #     # res.write('received upload:\n\n');
    #     res.end {fields: fields, files: files}


    # byteString = atob req.body.photo
    # byteString = new Buffer(req.body.photo, 'base64').toString 'ascii'
    # ia = new Uint8Array byteString.length
    # ia[i] = byteString.charCodeAt(i) for val, i in byteString
    # # blob = new Blob [ia], type: 'image/png'
    # blob = new Blob [ia], type: 'image/png'

    # r = request.post req.body.uploadUrl, (err, httpResponse, body) ->
    #     res.send body
    #
    # form = r.form()
    # form.append 'photo', '?', contentType: 'image/png', filename: 'cover.png'
