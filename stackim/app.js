var express = require('express')

var app = express();

app.get('/', function (req, resp) {
    resp.setHeader('Content-Type', 'text/plain')
    resp.end('Hello, world!\n')
})

var port = process.env.PORT || 8000
app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/')
})
