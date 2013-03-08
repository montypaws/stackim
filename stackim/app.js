var assert  = require('assert'),
    express = require('express'),
    mongodb = require('mongodb')

var MongoClient = mongodb.MongoClient

var MONGO_URI = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/stackim'

var app = express()

app.enable('trust proxy')
app.use(express.bodyParser())
app.use(express.static(__dirname + '/public'))
app.use(function (req, resp, next) {
    if ((process.env.NODE_ENV || 'development') === 'development') {
        next()
    } else if (req.host === 'stack.im') {
        next()
    } else {
        url = 'http://stack.im' + req.path
        resp.redirect(301, url)
    }
})


app.get('/', function (req, resp) {
    resp.set('Cache-Control', 'public, max-age=31557600')
    resp.sendfile(__dirname + '/views/home.html')
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
                var inc = {'$inc': {'analytics.views': 1}}
                db.collection('tags').update({'_id': rec._id}, inc, function (err, count) {
                    if (err != null) {
                        console.error('Could not increment analytics.views: ' + err)
                    }
                })
                var url = 'http://stackoverflow.com/users/' + rec.stackid
                resp.redirect(301, url)
            }
        })
    })
})

app.put('/:tag', function (req, resp) {
    var tagPattern = /[^A-Za-z0-9]/,
        tag = req.params.tag,
        stackid = req.body.stackid
    
    if (typeof stackid === 'undefined') {
        console.error("PUT request without 'stackid' parameter")
        resp.statusCode = 400
        resp.setHeader('Content-Type', 'text/plain')
        resp.end("PUT request must contain a 'stackid' parameter\n")
    } else if (tagPattern.test(tag)) {
        console.error("Rejected shortened URL: '" + tag + "'\n")
        resp.statusCode = 400
        resp.setHeader('Content-Type', 'text/plain')
        resp.end('Shortened URL may only contain alphanumeric characters\n')
    } else {
        MongoClient.connect(MONGO_URI, function (err, db) {
            assert.ok(err == null)
            assert.ok(db != null)
            
            var obj = {'tag': tag, 'stackid': stackid, 'createdAt': new Date()}
            db.collection('tags').insert(obj, function (err) {
                if (err != null) {
                    // Only handling duplicate key errors for now
                    assert.ok(err.code === 11000)
                    console.error('Duplicate key: ' + tag)
                    resp.statusCode = 409
                    resp.setHeader('Content-Type', 'text/plain')
                    resp.end("Tag '" + tag + "' is already in use\n")
                } else {
                    console.log('Created tag: ' + JSON.stringify(obj))
                    resp.setHeader('Content-Type', 'text/plain')
                    resp.end('OK\n')
                }
            })
        })
    }
})


var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/')
})
