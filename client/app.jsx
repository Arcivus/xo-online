import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import Game from './components/game';
import Chat from './components/chat';

const socket = io.connect('https://stark-lake-33138.herokuapp.com');

function randomId() {
  return Math.floor(Math.random() * 1e11);
}

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      currentRoom: "",
      gameIsOn: false,
      firstPlayer: "",
      error: "",
      userId: randomId()
     }

    this._hostGame = this._hostGame.bind(this);
    this._attemptJoinByInvite = this._attemptJoinByInvite.bind(this);
    this._startGame = this._startGame.bind(this);
  }

  static contextTypes = {     // used for rerouting by React-Router
     router: PropTypes.object
  }

  componentDidMount() {
    socket.on('game:start', this._startGame);
    socket.on('room:terminate', this._hostGame);
    socket.on('failure:join', (errorMessage) => {this._hostGame(errorMessage)} )

    if(this.props.params.id){
      this._attemptJoinByInvite(this.props.params.id);
    } else {
      this._hostGame();
    }
  }

  _attemptJoinByInvite(room) {
    this.setState({currentRoom: room});
    socket.emit('room:join', { userId: this.state.userId, room});
    this.context.router.push('/');
  }

  _hostGame(errorMessage) {
    const room = randomId();
    socket.emit('room:host', { userId: this.state.userId, room });
    this.setState({ gameIsOn: false,
                    currentRoom: room,
                    error: errorMessage
                  });
  }

  _startGame(firstPlayerId) {
    this.setState({
      gameIsOn: true,
      firstPlayer: firstPlayerId,
      error: ""
    });
  }


  generateNotification() {
    if(this.state.error){ // if problem with joining to session occured we inform user but still host new game
      return (
        <div className="notification">
          <p>Oops! <strong>{this.state.error}!</strong> But here's link you can send to your friend to start a new game:</p>
          <h3>stark-lake-33138.herokuapp.com/#/invite/{this.state.currentRoom}</h3>
        </div>
      )
    }
    return (
      <div className="notification">
        <p>Send your friend this link:</p>
        <h3>stark-lake-33138.herokuapp.com/#/invite/{this.state.currentRoom}</h3>
      </div>
    );
  }

  render() {
    const {gameIsOn, firstPlayer, currentRoom} = this.state;
    {
      if(!gameIsOn){
        return (
          <div className="app">
            { this.generateNotification() }
          </div>
        );
      }
    }
    return (
      <div className="app">
        <Game
          socket={socket}
          firstPlayer={firstPlayer}
          room={currentRoom}
          userId={this.state.userId}
        />
        <Chat
          socket={socket}
          room={currentRoom}
          />
      </div>
    );
  }
}


ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}/>
    <Route path="invite/:id" component={App}/>
  </Router>,
  document.querySelector('.container') );
