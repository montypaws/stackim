var express = require('express')

var app = express();

app.enable('trust proxy')


app.get('/', function (req, resp) {
    resp.setHeader('Content-Type', 'text/plain')
    resp.end('Hello, world!\n')
})

app.get('/:tag', function (req, resp) {
    var tag = req.params.tag
    resp.setHeader('Content-Type', 'text/plain')
    resp.end('-> http://stackoverflow.com/users/' + tag + '\n')
})

app.put('/:tag', function (req, resp) {
    var tag = req.params.tag
    resp.setHeader('Content-Tyoe', 'text/plain')
    resp.end("Creating tag for '" + tag + "'\n")
})


var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/')
})
