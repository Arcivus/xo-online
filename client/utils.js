export const utils = {

  getWinner: function(figure) {
    return figure === "X"? "Player X wins." : "Player O wins.";
  },

  gameOverCheck: function(field) {
    // CHECK ROWS
    if(field[0] && field[0] === field[1] && field[1] === field[2]) {
      return this.getWinner(field[0]);
    }
    if(field[3] && field[3] === field[4] && field[4] === field[5]) {
      return this.getWinner(field[3]);
    }
    if(field[6] && field[6] === field[7] && field[7] === field[8]) {
      return this.getWinner(field[6]);
    }
    // CHECK COLUMNS
    if(field[0] && field[0] === field[3] && field[3] === field[6]) {
      return this.getWinner(field[0]);
    }
    if(field[1] && field[1] === field[4] && field[4] === field[7]) {
      return this.getWinner(field[1]);
    }
    if(field[2] && field[2] === field[5] && field[5] === field[8]) {
      return this.getWinner(field[2]);
    }
    //CHECK DIAGONALS
    if(field[0] && field[0] === field[4] && field[4] === field[8]) {
      return this.getWinner(field[0]);
    }
    if(field[2] && field[2] === field[4] && field[4] === field[6]) {
      return this.getWinner(field[2]);
    }
    //CHECK FOR DRAW
    let boardFull = true;
    FIELD.forEach(function(cellContent){
      if(!cellContent){ boardFull = false };
    });
    if(boardFull) {
      return 'Its a Draw!';
    }
  }
}

export const FIELD = ["", "", "",
                    "", "", "",
                    "", "", ""];
