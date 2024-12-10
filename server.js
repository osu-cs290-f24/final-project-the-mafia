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

let gameState = {
    roundNumber: 0,
    phase: 0, // 0: mafia, 1: doctor, 2: sherrif, 3: voting, then restart
    mafiaId: null,
    doctorId: null,
    sherifId: null,
    mafiaTarget: null,
    doctorTarget: null,
    playerVotes: {}
}

var players = {}
var playerCount = 0
var playersAlive = 5

function assigCharacter() {
    return userData[playerCount].userName
}

io.on('connection', (socket) => {
    if(playerCount >= 5){
        socket.disconnect(true);
        console.log("User has disconnected due to max players already reached", socket.id);
        return;
    }
    console.log("User has connected:", socket.id)

    const userName = assigCharacter()

    players[socket.id] = createPlayer(socket.id, userName)
    playerCount++

    socket.on('disconnect', () => {
        console.log("User has disconnected", socket.id)
    })

    socket.on('mafiaTarget', (data) => {
         if (socket.id === gameState.mafiaId) {
            gameState.mafiaTarget = data.targetID
            io.to(gameState.mafiaId).emit('removeMafiaModal', {true: true})
         }
    })

    socket.on('doctorTarget', (data) => {
        if (socket.id === gameState.doctorId) {
           gameState.doctorTarget = data.targetID
           io.to(gameState.doctorId).emit('removeDoctorModal', {true: true})
        }
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
            gamePlay()
        }, 10000)
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
            if(role === 'Mafia'){
                gameState.mafiaId = randomPlayerID
            } else if (role === 'Doctor') {
                gameState.doctorId = randomPlayerID
            } else if (role === 'Sheriff') {
                gameState.sherifId = randomPlayerID
            }
            // And then just add that role to the set
            assignedRoles.add(role)
        }
    }
}

function gamePlay(){
    if(gameState.phase === 0) {
        io.emit('notTurnModal')
        io.to(gameState.mafiaId).emit('yourTurnModal', { role: 'Mafia'})
        io.to(gameState.mafiaId).emit('mafiaModal', { 
            role: 'Mafia',
            players: Object.keys(players)
            .filter(playerID => playerID !== gameState.mafiaId)
            .map(playerID => ({id: playerID, name: players[playerID].name, alive: players[playerID].alive}))
        })
        setTimeout(() => {
            io.to(gameState.mafiaId).emit('removeMafiaModal', {true: false})
            io.emit('notTurnModal')
            gameState.phase = 1
            gamePlay()
        }, 5000)
    } else if(gameState.phase === 1) {
        io.emit('notTurnModal')
        io.to(gameState.doctorId).emit('yourTurnModal', { role: 'Doctor'})
        io.to(gameState.doctorId).emit('doctorModal', { 
            role: 'Doctor',
            players: Object.keys(players).map(playerID => ({id: playerID, name: players[playerID].name, alive: players[playerID].alive}))
        })
        setTimeout(() => {
            io.to(gameState.doctorId).emit('removeDoctorModal', {true:false})
            io.emit('notTurnModal')
            gameState.phase = 2
            gamePlay()
        }, 5000)
    } else if(gameState.phase === 2) {
        io.emit('notTurnModal')
        io.to(gameState.sherifId).emit('yourTurnModal', { 
            role: 'Sherif'
        })
        setTimeout(() => {
            gameState.phase = 3
            gamePlay()
        }, 5000)
    } else if(gameState.phase === 3) {
        if(gameState.mafiaTarget !== null && gameState.doctorTarget !== null){
            if(players[gameState.mafiaTarget] !== players[gameState.doctorTarget]){
                players[gameState.mafiaTarget].alive = false
                console.log(`${players[gameState.mafiaTarget].name} has been killed by the Mafia.`)
            } else if (players[gameState.mafiaTarget] === players[gameState.doctorTarget]){
                console.log(`${players[gameState.mafiaTarget].name} has been saved by the doctor.`)
            }
        }else if(gameState.mafiaTarget !== null && gameState.doctorTarget === null){
            players[gameState.mafiaTarget].alive = false
            console.log(`${players[gameState.mafiaTarget].name} has been killed by the Mafia.`)
        }
        io.emit('yourTurnModal')
        gameState.mafiaTarget = null
        gameState.doctorTarget = null
        setTimeout(() => {
            gameState.playerVotes = {}
            gameState.phase = 0
            gamePlay()
        }, 15000)
    }
}

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
        res.render('gamePage', { user_icons: userData });

})

server.listen(PORT, function() {
    console.log("Server listening at port", PORT)
})