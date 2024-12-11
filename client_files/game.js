// Chat Implementation for Client
const getMessageInput = document.getElementById("message-input")
const form = document.getElementById("form")
const chooseButton = document.getElementById('voteButton')

socket.on('connect', () => {
    console.log("Connected to server with ID:", socket.id)
})

socket.on('receive-message', (data) => {
    const div = document.createElement("div")
    div.textContent = `${data.id}: ${data.text}`
    document.getElementById("chat-box").append(div)
})

socket.on('playerScreen', (data) => {
    var playerName = data.id
    var playerNameInput = document.getElementById("player-username")
    playerNameInput.textContent = "You are: " + playerName
    console.log('user name: ', data.id)
})

socket.on('playerRoleDisplay', (data) => {
    var playerRole = data.role
    var playerRoleInput = document.getElementById("player-role")
    if(playerRole === null) {
        playerRoleInput.textContent = "You are: Civilian"
    }
    else{ 
        playerRoleInput.textContent = "You are: " + playerRole
    }
    console.log("Your Role: ", playerRole)
})

// Sherif Modals
socket.on('removeSherifModal', (data) => {
    var sherifBackdrop = document.getElementById("sherif-modal-backdrop")
    var sherifModal = document.getElementById("sherif-modal")

    if(data.true === true){
        sherifModal.classList.add("sherifHidden")
    } else {
        if(!(sherifModal.classList.contains('sherifHidden'))){
            sherifModal.classList.add("sherifHidden")
            sherifBackdrop.classList.add("sherifHidden")
        }
        else{
            sherifBackdrop.classList.add("sherifHidden")
        }
    }
})

socket.on('sherifModal', (data) => {
    var sherifBackdrop = document.getElementById("sherif-modal-backdrop")
    var sherifModal = document.getElementById("sherif-modal")
    var sherifContent = sherifModal.querySelector(".sherif-content")

    sherifBackdrop.classList.remove("sherifHidden")
    sherifModal.classList.remove("sherifHidden")

    sherifContent.innerHTML = '<h2>Check to see if they are the Mafia:</h2>'

    data.players.forEach(player => {
        let button = document.createElement("button")
        button.textContent = player.name
        button.addEventListener('click', () => {
            const targetID = player.id
            socket.emit("sherifTarget", {targetID: player.id})
            if(player.role === 'Mafia'){
                alert(player.name + ' is the Mafia!!!')
            } else {
                alert(player.name + ' is not the Mafia')
            }
        })
        if (player.alive) {
            sherifContent.appendChild(button)
        }
    })
})

// Doctor Modals
socket.on('removeDoctorModal', (data) => {
    var doctorBackdrop = document.getElementById("doctor-modal-backdrop")
    var doctorModal = document.getElementById("doctor-modal")

    if(data.true === true){
        doctorModal.classList.add("doctorHidden")
    } else {
        if(!(doctorModal.classList.contains('doctorHidden'))){
            doctorModal.classList.add("doctorHidden")
            doctorBackdrop.classList.add("doctorHidden")
        }
        else{
            doctorBackdrop.classList.add("doctorHidden")
        }
    }
})

socket.on('doctorModal', (data) => {
    var doctorBackdrop = document.getElementById("doctor-modal-backdrop")
    var doctorModal = document.getElementById("doctor-modal")
    var doctorContent = doctorModal.querySelector(".doctor-content")

    doctorBackdrop.classList.remove("doctorHidden")
    doctorModal.classList.remove("doctorHidden")

    doctorContent.innerHTML = '<h2>Choose who to save:</h2>'

    data.players.forEach(player => {
        let button = document.createElement("button")
        button.textContent = player.name
        button.addEventListener('click', () => {
            const targetID = player.id
            socket.emit("doctorTarget", {targetID: player.id})
        })
        if (player.alive) {
            doctorContent.appendChild(button)
        }
    })
})


// Mafia Modals
socket.on('removeMafiaModal', (data) => {
    var mafiaBackdrop = document.getElementById("mafia-modal-backdrop")
    var mafiaModal = document.getElementById("mafia-modal")

    if(data.true === true){
        mafiaModal.classList.add("mafiaHidden")
    } else {
        if(!(mafiaModal.classList.contains('mafiaHidden'))){
            mafiaModal.classList.add("mafiaHidden")
            mafiaBackdrop.classList.add("mafiaHidden")
        }
        else{
            mafiaBackdrop.classList.add("mafiaHidden")
        }
    }
})

socket.on('mafiaModal', (data) => {
    var mafiaBackdrop = document.getElementById("mafia-modal-backdrop")
    var mafiaModal = document.getElementById("mafia-modal")
    var mafiaContent = mafiaModal.querySelector(".mafia-content")

    mafiaBackdrop.classList.remove("mafiaHidden")
    mafiaModal.classList.remove("mafiaHidden")

    mafiaContent.innerHTML = '<h2>Choose who to kill:</h2>'

    data.players.forEach(player => {
        let button = document.createElement("button")
        button.textContent = player.name
        button.addEventListener('click', ()=> {
            const targetID = player.id
            socket.emit("mafiaTarget", {targetID: player.id})
        })
        if (player.alive) {
            mafiaContent.appendChild(button)
        }
    })
})

socket.on('playerKilled', (data) => {
    console.log(`${data.name} is now dead.`)
    
    const playerDiv = document.querySelector(`.User[user-name="${data.name}"]`)

    if (playerDiv) {
        const userNameDiv = playerDiv.querySelector('.user_name h4')
        if (userNameDiv) {
            userNameDiv.textContent += ' (Dead)'
        }

        const voteButton = playerDiv.querySelector('#voteButton')
        if (voteButton) {
            voteButton.remove()
        }
    }
    
})


socket.on('removeModal', () => {
    Modal()
})

socket.on('notTurnModal', () => {
    notTurnModal()
})

socket.on('yourTurnModal', (data) => {
    yourTurnModal()
})

function displayMessage(user, message) {
    const div = document.createElement("div")
    div.textContent = `${user}: ${message}`
    document.getElementById("chat-box").append(div)
}

form.addEventListener("submit", e => {
    e.preventDefault()
    const message = getMessageInput.value

    if (message === "") {
        return
    }

    socket.emit("send-message", message)

    displayMessage("You", message)

    getMessageInput.value = ""
})

chooseButton.addEventListener('click', vote => {
    // gets the name of the user that was voted for
})

// Timer Implementation
const initialMinutes = 5;
var time = initialMinutes * 60

const countdownTimer = document.getElementById("time")

setInterval(timeRemaining, 1000)

function timeRemaining() {
    const minutes = Math.floor(time / 60)
    var seconds = time % 60;

    if (time <= 0) {
        clearInterval()
        return
    }

    if (seconds < 10) {
        seconds = '0' + seconds
    }

    countdownTimer.innerHTML = `${minutes}:${seconds}`

    time--
}

// Modal Username Implementation
function Modal() {
    var modalBackdrop = document.getElementById("modal-backdrop")
    var usernameModal = document.getElementById("username-modal")

    modalBackdrop.classList.add("hidden")
    usernameModal.classList.add("hidden")
}

function notTurnModal() {
    var turnModalBackdrop = document.getElementById("turn-modal-backdrop")
    var turnModal = document.getElementById("turn-modal")

    if(turnModalBackdrop.classList.contains('turnHidden') && turnModal.classList.contains('turnHidden')){
        turnModalBackdrop.classList.remove("turnHidden")
        turnModal.classList.remove('turnHidden')
    }
}

function yourTurnModal() {
    var turnModalBackdrop = document.getElementById("turn-modal-backdrop")
    var turnModal = document.getElementById("turn-modal")

    if(!(turnModalBackdrop.classList.contains('turnHidden') && turnModal.classList.contains('turnHidden'))){
        turnModalBackdrop.classList.add("turnHidden")
        turnModal.classList.add('turnHidden')
    }
}

window.onload = () => {
    document.getElementById("modal-backdrop").classList.remove("hidden")
    document.getElementById("username-modal").classList.remove("hidden")
}
