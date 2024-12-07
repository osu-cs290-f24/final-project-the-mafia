const socketio = require('socket.io')
var express = require('express')
var path = require('path')

var expressHandlebars = require('express-handlebars');
var userData = require("./client_files/userData.json");


const app = express()
var port = process.env.PORT || 3001

// Set Handlebars as the view engine
app.engine('handlebars', expressHandlebars.engine());
app.set('view engine', 'handlebars');
// Set the views directory
app.set('views', path.join(__dirname, 'client_files/views'));


app.use(express.static(path.join(__dirname, 'client_files')))

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, 'client_files', 'game.html'))
        res.render('gamePage', { user_icons: userData });

})

app.listen(port, function() {
    console.log("Server listening at port", port)
})
