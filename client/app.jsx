import React from 'react';
import ReactDOM from 'react-dom';
import {FIELD, utils} from './utils';

import Game from './components/game';

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      game: () => <Game onGameStatusChange={(gameStatus) => this.setState( {gameStatus} )}/>,
      gameStatus: ""
     }
  }

  newGame() {
    this.setState({
        game: () => <Game onGameStatusChange={(gameStatus) => this.setState( {gameStatus} )}/>,
        gameStatus: ""
    });
    for(let i=0;i<FIELD.length;i++){
      FIELD[i] = "";
    }
  }

  render() {
    const ActiveGame = this.state.game;
    return (
      <div className="app">
        <div className="status-bar">
          <h2>{this.state.gameStatus}</h2>
        </div>
        <ActiveGame />
        <button onClick={this.newGame.bind(this)}>Reset!</button>
      </div>
    );
  }
}

ReactDOM.render( <App />, document.querySelector('.container') );
