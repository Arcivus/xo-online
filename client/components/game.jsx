import React from 'react';
import Cell from './cell';

import {FIELD, utils} from '../utils';

export default class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPlayer: 1,
      gameOver: false
    };

    this.renderCell = this.renderCell.bind(this);
    this.getFigure = this.getFigure.bind(this);
    this.endTurn = this.endTurn.bind(this);
  }

  componentDidMount() {
    this.props.onGameStatusChange(this.getGameStatus());
  }

  getFigure() {
    return this.state.currentPlayer === 1 ? 'X' : 'O';
  }

  getNextPlayer() {
    return this.state.currentPlayer === 1 ? 2 : 1;
  }

  getGameStatus() {
    let result = utils.gameOverCheck(FIELD);
    if(result) {
      this.setState({ gameOver: true });
      return result;
    }
    return `Player ${this.getFigure()}'s turn.`
  }


  endTurn() {
    this.setState( {currentPlayer: this.getNextPlayer()},
     () => this.props.onGameStatusChange(this.getGameStatus()) );
  }

  renderCell(id) {
    return (
          <Cell
            key={id}
            id={id}
            getFigure={this.getFigure}
            endTurn={this.endTurn}
            isGameOver={this.state.gameOver}
          />
        );
  }

  render() {

    return (
      <table className="field">
        <tbody>
          <tr className="row">
            {[0, 1, 2].map(this.renderCell)}
          </tr>
          <tr className="row">
            {[3, 4, 5].map(this.renderCell)}
          </tr>
          <tr className="row">
            {[6, 7, 8].map(this.renderCell)}
          </tr>
        </tbody>
      </table>
    );
  }
}
