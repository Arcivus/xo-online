import React from 'react';

import * as audio from '../audio';

export default class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      figure: props.content,
      color: "",
      isTaken: props.figure ? true : false,
      fade: false
    };

    this.fadingDone = this.fadingDone.bind(this);
  }

  componentDidMount() {
    this.refs.cell.addEventListener('animationend', this.fadingDone)
  }

  componentWillReceiveProps(nextProps) { // get info from server and rerender component
    this.setState({
      figure: nextProps.content,
      color: nextProps.content === "X" ? '#DB3737' : '#3789DB',
      isTaken: nextProps.content? true : false,
    });
  }

  placeFigure() {
    const userId = localStorage.getItem('userId');
    const {currentPlayer, figureToPlace, gameResult, socket, room} = this.props;
    console.log(currentPlayer, userId);
    if(!this.state.isTaken && !gameResult && currentPlayer === userId){
      this.setState({ fade: true }); // add fading animation
      socket.emit('figure:place', { room, cellId: this.props.id, figure: figureToPlace });
      audio.play('draw');
    }
  }

  fadingDone () {
    // will re-render component, removing the animation class
    this.setState({fade: false})
  }

  render() {
    return (
      <div className={this.state.fade ? "cell fade" : "cell"}
            ref ='cell'
            style={ { color: this.state.color } }
            onClick={this.placeFigure.bind(this)}
            >
            {this.state.figure}
      </div>
    );
  }
}
