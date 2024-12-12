# The Mafia game
By: Pedro Blanco, Stanley Eng, Brandon Gill, Diego Chang

This project is an online version of the popular party game 'Mafia'. This project was made with HTML, CSS, JS, and Handlebars aswell as Socket.io with NodeJS. The game works by first waiting for all the players to join and those taht have joined can see their player name. After everyone has joined then then everyone will be randomly assigned a role and the game will automatically start in a few seconds.

When the game starts the Mafia has 10 seconds to kill someone and everyone elses screen will say "Not Your Turn". Then the Doctor has 10 seconds to choose someone to save including themselves. Finally the Sheriff is the final specil role and they can check if someone is the Mafia. When the three special roles times up, the voting round starts and the player that was selcted by the Mafia will be killed if not saved by the Doctor, here the civilians and the three special roles can talk in the chat and dicuss who the Mafia is. While they are talking the can also vote to kill someone for being the Mafia, the player with the most votes will be dead after the voting round is over.

This process will repeat over and over unitl either the people vote out the Mafia or the Mafia is the second to last person alive. Once one of those measure is true the game ends and the winner is announced to everyone.

Currently the game can only run up to 5 people and the user cnanot be choosen. Some aspiration for the project were to have a custimazable ammount of players and player info such as custom name and selectable profile picture while having the game hosted online to have people join through a game code, but we were new to socket.io and ran into dificulties getting it set up so we went with hard coded digits to be able to work on the games main logic since this is the most important part of the game.

The games main logic works through a struct gathering data from users using socket.io and then using this information in function that loops over all the phases of the game till there is a winner.

If you would like to try the game out, make sure you have NodeJS (https://nodejs.org/en) installed. Then copy the repository, open the directory, run 'npm install' and then 'npm start'. This will run the code on your local machine and by going to 'http://localhost:3001' the first player of the game will open. By then opening 4 more tabs to the same link 4 moew players will join. If you would like multiple devices to join, instead of 'localhost' type in your machines ip to the url, this will allow otehr devices on the same wifi to connect to the game as players, and remember no tabs can be open or refreshed while playing the game, once 'npm start' is ran only then can five urls open the link than when the game is over, all 5 urls must be close to start a new game.

I hope you enjoyed our game and have fun!!!