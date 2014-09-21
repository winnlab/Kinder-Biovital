
Auth = require '../../lib/auth'

module.exports.login = Auth.authenticate 'odnoklassniki'
