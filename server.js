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
        role: null,
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

    socket.emit('playerScreen', {id: players[socket.id].name})

    if(playerCount === 5){
        randomlyAssignRoles()
        Object.keys(players).forEach(playerID => {
            console.log(`Player ${playerID} Role: ${players[playerID].role}`);
            io.to(playerID).emit('playerRoleDisplay', {role: players[playerID].role})
        });
        setTimeout(() => {
            io.emit('removeModal')
        }, 10000)
        // Implement the logic where if five players have joined the game, we randomly give out roles to three of the players
    }

    socket.on("send-message", (message) => {
        socket.broadcast.emit('receive-message', {id: players[socket.id].name, text: message})
    })
})

function randomlyAssignRoles() {
    // Gives you an array of keys (i.e. the players socket IDs)
    const playerIDs = Object.keys(players)

    const specialRoles = ['Mafia', 'Doctor', 'Sheriff']

    const assignedRoles = new Set()

    while (assignedRoles.size < specialRoles.length) {
        // Choose a random index from the array of player keys
        const randomIndex = Math.floor(Math.random() * playerIDs.length)
        // We access a random player ID inside the array above
        const randomPlayerID = playerIDs[randomIndex]
        // If the player does not have a role
        if (!players[randomPlayerID].role) {
            // Stores the special role at a specific player's index
            const role = specialRoles[assignedRoles.size]
            // We assign that role to the player
            players[randomPlayerID].role = role
            // And then just add that role to the set
            assignedRoles.add(role)
        }
    }
}

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
        res.render('gamePage', { user_icons: userData });

})

server.listen(PORT, function() {
    console.log("Server listening at port", PORT)
})
