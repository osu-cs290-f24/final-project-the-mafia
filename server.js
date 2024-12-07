const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
var path = require('path')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '/client_files')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
})

// Runs everytime a client connects to server
// Generates a socket instance for each client
io.on('connection', (socket) => {
    console.log("User Connected:", socket.id)
})

server.listen(PORT, function() {
    console.log("Server listening at port", PORT)
})