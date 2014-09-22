request = require 'request'

Auth = require '../../lib/auth'

module.exports.login = Auth.authenticate 'odnoklassniki'

module.exports.likesCount = (url, cb) ->
    requestUrl = "http://www.odnoklassniki.ru/dk?st.cmd=extLike&uid=odklcnt0&ref=#{url}"
    request requestUrl, (error, response, body) ->
        body = body.replace "ODKL.updateCount('odklcnt0','", ''
        body = body.replace "');", ''
        cb error, Number body
