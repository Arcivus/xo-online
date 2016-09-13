import React from 'react';

import Cell from './cell';

export default class Game extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentPlayer: this.props.firstPlayer,
      field: ["", "", "",
              "", "", "",
              "", "", ""],
      currentFigure: "X",
      gameResult: ""
    }

    this.renderCell = this.renderCell.bind(this);
    this._handleFieldChange = this._handleFieldChange.bind(this);
    this._handleGameOver = this._handleGameOver.bind(this);
    this._handleReset = this._handleReset.bind(this);
  }

  componentDidMount() {
    const socket = this.props.socket;
    socket.on('field:change', this._handleFieldChange);
    socket.on('game:over', this._handleGameOver);
    socket.on('game:reset', this._handleReset);
  }

  _handleFieldChange({nextPlayer, fieldState, nextFigure}) {
    this.setState({
      currentPlayer: nextPlayer,
      field: fieldState,
      currentFigure: nextFigure
    });
  }

  _handleGameOver(gameResult) {
    this.setState({ gameResult });
  }

  _handleReset(firstPlayer) {
    this.setState({
      currentPlayer: firstPlayer,
      field: ["", "", "",
              "", "", "",
              "", "", ""],
      currentFigure: "X",
      gameResult: ""
    })
  }

  invokeReset(room) {
    this.props.socket.emit('game:reset', room);
  }

  generateStatusMessage(){
    if(this.state.gameResult){
      return this.state.gameResult;
    }
    return (this.props.userId === this.state.currentPlayer) ? "Your turn." : "Your Opponent's turn."
  }

  renderCell(figure, id) {
    return (
        <Cell
          key={id}
          id={id}
          content={figure}
          socket={this.props.socket}
          figureToPlace={this.state.currentFigure}
          currentPlayer={this.state.currentPlayer}
          room={this.props.room}
          gameResult={this.state.gameResult}
          userId={this.props.userId}
        />
    );
  }

  render() {
    return (
      <div className="game">
        <div className="status-bar">
          <h2>{this.generateStatusMessage()}</h2>
        </div>
        <div className="field">
          {this.state.field.map(this.renderCell)}
        </div>
        <button className="reset-button" onClick={ () => this.invokeReset(this.props.room) }>Reset!</button>
      </div>
    )
  }
}
