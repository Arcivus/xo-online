var X = "X";
var O = "O";

// Tic tac toe rules for getting winner
var getWinner = function(figure) {
    return figure === X? "Player X wins." : "Player O wins.";
}

var checkRows = function(field) {
  var result;
  field.forEach(function(row){
    if(row[0] && row[0] === row[1] && row[1] === row[2]){
      result = row[0];
    }
  });
  if(result) {
    return getWinner(result);
  }
}

var checkColumns = function(field) {
  var result;
  for(var i=0;i<field[0].length;i++){
    if(field[0][i] && field[0][i] === field[1][i] && field[1][i] === field[2][i]){
      result = field[0][i];
    }
  }
  if(result) {
    return getWinner(result);
  }
}

var checkDiagonals = function(field) {
  if(field[1][1]) {
    if((field[0][0] === field[1][1] && field[1][1] === field[2][2]) ||
      (field[0][2] === field[1][1] && field[1][1] === field[2][0])){
        return getWinner(field[1][1]);
      }
  }
}


module.exports = (function (){

  var Sessions = {};   // object used to keep info about all ongoing game sessions.
                       // It has such structure:
                       // {
                       //  'roomName1':
                       //   {
                       //     PlayerX: 'id of host',
                       //     PlayerO: 'id of guest',
                       //     currentPlayer: 'flag, used to calculate whose turn it is',
                       //     field: 'array with 9 cells that are either empty or contain "X" or "O"'
                       //   },
                       //  'roomName2': ... etc
                       // }

  var hostSession = function(hostId, room) {
    Sessions[room] = {
      PlayerX: hostId,
      PlayerO: "",
      currentPlayer: 0,
      field:  ["", "", "",
               "", "", "",
               "", "", ""]
    };
  }

  var joinSession = function(playerId, room) {
    if(Sessions[room] && !Sessions[room].PlayerO){
      Sessions[room].PlayerO = playerId;
    }
  }

  var terminateSession = function(room) { // invoked if any of users disconnect
    if(Sessions[room]){
      delete Sessions[room];
    }
  }

  var getCurrentPlayerId = function(room){
    return Sessions[room].currentPlayer === 0? Sessions[room].PlayerX : Sessions[room].PlayerO;
  }

  var getFigureToPlace = function(room) {
    return Sessions[room].currentPlayer === 0? X : O;
  }

  var getFieldState = function(room) {
    return Sessions[room].field;
  }

  var endTurn = function(room) {
    Sessions[room].currentPlayer = (Sessions[room].currentPlayer ? 0 : 1);
  }

  var isSessionFull = function(room) { // check if there are still places to fill
    if(Sessions[room] && Sessions[room].PlayerX && Sessions[room].PlayerO){
      return true
    }
  }

  var placeFigure = function(room, cellId, figure){
    Sessions[room].field[cellId] = figure;
  }

  var resetField = function(room) {
    for(var i=0;i<Sessions[room].field.length;i++){
      Sessions[room].field[i] = "";
    }
    Sessions[room].currentPlayer = 0;
  }


  var gameOverCheck = function(room) {  // invoked at the end of every turn
    var row1 = Sessions[room].field.slice(0,3);
    var row2 = Sessions[room].field.slice(3,6);
    var row3 = Sessions[room].field.slice(6);

    var field = [row1, row2, row3];

    if(checkRows(field)){
      return checkRows(field);
    };

    if(checkColumns(field)){
      return checkColumns(field);
    }

    if(checkDiagonals(field)){
      return checkDiagonals(field);
    }

    //CHECK FOR DRAW
    var boardFull = true;
    Sessions[room].field.forEach(function(cellContent){
      if(!cellContent){ boardFull = false };
    });
    if(boardFull) {
      return 'Its a Draw!';
    }
  }

  return {
    hostSession,
    joinSession,
    terminateSession,
    isSessionFull,
    getFigureToPlace,
    placeFigure,
    getFieldState,
    resetField,
    gameOverCheck,
    getCurrentPlayerId,
    endTurn
  }
})();
