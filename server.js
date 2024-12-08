const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORT || 3001

var expressHandlebars = require('express-handlebars');
var userData = require("./client_files/userData.json");
const { create } = require('domain')

// Set Handlebars as the view engine
app.engine('handlebars', expressHandlebars.engine());
app.set('view engine', 'handlebars');
// Set the views directory
app.set('views', path.join(__dirname, 'client_files/views'));

app.use(express.static(path.join(__dirname, 'client_files')))

//Implementation of player
function createPlayer(id, name) {
    return {
        id: id,
        //role: role,
        name: name,
        alive: true
    }
}

var players = {}
var playerCount = 0

function assigCharacter() {
    return userData[playerCount].userName
}

io.on('connection', (socket) => {
    console.log("User has connected:", socket.id)

    const userName = assigCharacter()

    players[socket.id] = createPlayer(socket.id, userName)
    playerCount++

    socket.on('disconnect', () => {
        console.log("User has disconnected", socket.id)
    })

    socket.on('playerJoined', (userId) => {
        io.emit('playerScreen', {id: players[userId].name})
    })

    socket.on("send-message", (message) => {
        socket.broadcast.emit('receive-message', {id: players[socket.id].name, text: message})
    })
})

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
        res.render('gamePage', { user_icons: userData });

})

server.listen(PORT, function() {
    console.log("Server listening at port", PORT)
})
