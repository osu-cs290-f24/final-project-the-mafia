// Chat Implementation for Client
const getMessageInput = document.getElementById("message-input")
const form = document.getElementById("form")

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

socket.on('removeModal', () => {
    Modal()
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

window.onload = () => {
    document.getElementById("modal-backdrop").classList.remove("hidden")
    document.getElementById("username-modal").classList.remove("hidden")
}
