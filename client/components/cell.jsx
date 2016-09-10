import React from 'react';
import {FIELD} from '../utils';

export default class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  figure: "",
                  color: "",
                  isTaken: false
                };
  }

  placeFigure() {
    if(!this.props.isGameOver && !this.state.isTaken){
      let figure = this.props.getFigure();
      let color = (figure === "X"? '#DB3737' : '#3789DB');
      FIELD[this.props.id] = this.props.getFigure();
      this.setState({ figure, color, isTaken: true }, this.props.endTurn);
    }
  }

  render() {
    return (
      <td className="cell" style={ { color: this.state.color } } onClick={this.placeFigure.bind(this)}>{this.state.figure}</td>
    );
  }
}
