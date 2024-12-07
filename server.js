const io = require('socket.io')(3000)
var express = require('express')
var path = require('path')
const app = express()
var port = process.env.PORT || 3001

app.use(express.static(path.join(__dirname, '/client_files')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
})

app.listen(port, function() {
    console.log("Server listening at port", port)
})


// Runs everytime a client connects to server
// Generates a socket instance for each client
io.on('connection', socket => {
    console.log(socket.id)
})