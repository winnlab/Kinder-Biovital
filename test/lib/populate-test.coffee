_ = require 'underscore'
async = require 'async'
should = require 'should'
mongoose = require 'mongoose'

ModelPreloader = require '../../init/mpload'
Server = require '../../test-helpers/server'

Model = require '../../lib/model'

describe 'Testing population', ->

    before (done) ->
        ModelPreloader "#{process.cwd()}/models/", ->
            Server.startServer 3000, done

    after (done) ->
        Server.stopServer done

    it 'should return nested data', (done) ->
        tale = Model 'Tale', 'findById', null, '540c4329e5717fee7870bc56'
        tale.populate('coverImgId coverColorId trackId userId frames.decorationId frames.heroes.heroId frames.heroes.replica.replicaId').exec (err, pop) ->
            console.log pop
            done()
