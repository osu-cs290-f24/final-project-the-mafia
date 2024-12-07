const socketio = require('socket.io')
var express = require('express')
var path = require('path')

const app = express()
var port = process.env.PORT || 3001

app.use(express.static(path.join(__dirname, 'client_files')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
})

app.listen(port, function() {
    console.log("Server listening at port", port)
})