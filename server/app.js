'use strict';

var express = require('express');
var http = require('http');

var game = require('./utils.js');

var app = express();
var server = http.createServer(app);

// Configuration
app.use(express.static(__dirname + '/..'));
app.set('port', (process.env.PORT || 3080));

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// Socket.io communication
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
	var currentRoom; // used to terminate session in socket.on('disconnect') event

	// Session connection
	socket.on('room:host', function(data) {
		currentRoom = data.room;
		socket.join(currentRoom);
		game.hostSession(data.userId, data.room)
	});

	socket.on('room:join', function(data) {
		var room = data.room;
		if(game.doesSessionExist(room)){
			if(game.isSessionFull(room)){ // If session user tries to connect is full then we inform him and host new game
				socket.emit('failure:join', "Session is full");
			}
			else {
				currentRoom = room;
				socket.join(currentRoom);
				game.joinSession(data.userId, room);

				if(game.isSessionFull(currentRoom)) { // checks if both players are present and game can be started
					io.to(currentRoom).emit('game:start', game.getCurrentPlayerId(currentRoom));
				}
			}
		}
		else { // If user tried to join by old/non-existant invite we inform him and host new game
			socket.emit('failure:join', "Game with this ID does not exist");
		}
	});

	socket.on('disconnect', function() {
		game.terminateSession(currentRoom);
		io.to(currentRoom).emit('room:terminate', "Your Opponent left");
	});

	// Gameplay events
  socket.on('game:reset', function(room) {
    game.resetField(room);
    io.to(room).emit('game:reset', game.getCurrentPlayerId(room));
  });

  socket.on('figure:place', function(data) {
		var room = data.room;
    game.placeFigure(room, data.cellId, data.figure);
    game.endTurn(room);
    io.to(data.room).emit('field:change', {
      fieldState: game.getFieldState(room),
      nextPlayer: game.getCurrentPlayerId(room),
			nextFigure: game.getFigureToPlace(room)
    });
		var result = game.gameOverCheck(room);
		if(result){
			io.to(data.room).emit('game:over', result);
		}
  });

	// Chat events
	// Unlike gameplay section, chat won't store info on server, just pass messages from player to player.
	socket.on('message:send', function(data){
		socket.broadcast.to(data.room).emit('message:send', data.text);
	});
});

// Start server
server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
