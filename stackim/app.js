var assert  = require('assert'),
    express = require('express'),
    mongodb = require('mongodb')

var MongoClient = mongodb.MongoClient

var MONGO_URI = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/stackim'

var app = express()

app.enable('trust proxy')
app.use(express.bodyParser())


app.get('/', function (req, resp) {
    resp.setHeader('Content-Type', 'text/plain')
    resp.end('Hello, world!\n')
})

app.get('/:tag', function (req, resp) {
    var tag = req.params.tag
    MongoClient.connect(MONGO_URI, function (err, db) {
        assert.ok(err == null)
        assert.ok(db != null)
        
        db.collection('tags').findOne({'tag': tag}, function (err, rec) {
            assert.ok(err == null)
            if (rec == null) {
                resp.statusCode = 404
                resp.end("No tag for '" + tag + "'\n")
            } else {
                var url = 'http://stackoverflow.com/users/' + rec.stackid
                resp.redirect(301, url)
            }
        })
    })
})

app.put('/:tag', function (req, resp) {
    var tag     = req.params.tag,
        stackid = req.body.stackid
    MongoClient.connect(MONGO_URI, function (err, db) {
        assert.ok(err == null)
        assert.ok(db != null)
    
        obj = {'tag': tag, 'stackid': stackid}
        db.collection('tags').insert(obj, function (err) {
            assert.ok(err == null)
            console.log('Created tag: ' + obj)
            resp.setHeader('Content-Type', 'text/plain')
            resp.end('OK\n')
        })
    })
})


var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/')
})
