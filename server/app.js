'use strict';

var express = require('express');
var http = require('http');

var game = require('./utils.js');

var app = express();
var server = http.createServer(app);

// Configuration
app.use(express.static(__dirname + '/..'));
app.set('port', 3080);

if (process.env.NODE_ENV === 'development') {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// Socket.io communication
var io = require('socket.io').listen(server);
io.on('connection', function(socket) {
	var currentRoom; // used to terminate session in socket.on('disconnect') event

	socket.on('room:host', function(data) {
		currentRoom = data.room;
		socket.join(currentRoom);
		game.hostSession(data.userId, data.room)
	});

	socket.on('room:join', function(data) {
		var room = data.room
		if(game.isSessionFull(room)){
			socket.emit('failure:join', "Session is full");
		} else {
			currentRoom = room;
			socket.join(currentRoom);
			game.joinSession(data.userId, room);

			if(game.isSessionFull(currentRoom)) {
				io.to(currentRoom).emit('game:start', game.getCurrentPlayerId(currentRoom));
			}
		}
	});

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

	socket.on('disconnect', function() {
		game.terminateSession(currentRoom);
		io.to(currentRoom).emit('room:terminate', "Your Opponent left");
	})
});

// Start server
server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
