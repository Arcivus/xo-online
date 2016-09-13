import React from 'react';
import ReactDOM from 'react-dom';

import * as audio from '../audio';

export default class Chat extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      messages: [],
      text: ""
    }

    this.renderMessage = this.renderMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._receiveMessage = this._receiveMessage.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('message:send', this._receiveMessage);
  }

  componentDidUpdate() {
    // autoscroll to last message
    const node = ReactDOM.findDOMNode(this.refs.last);
    if(node){
      node.scrollIntoView();
    }
  }

  _receiveMessage(message) {
    const {messages} = this.state;
    messages.push({
      name: "Opponent",
      text: message
    });
    this.setState({ messages });
    audio.play('boop');
  }

  sendMessage(message) {
    const {messages} = this.state;
    messages.push({
                  name: "You",
                  text: message.text
                 });
    this.setState({ messages });
    this.props.socket.emit('message:send', message);
  }

  handleSubmit(e) {
    e.preventDefault();
    if(this.state.text){
      let message = {
        text: this.state.text,
        room: this.props.room
      }
      this.sendMessage(message);

      this.setState({ text: "" });
    }
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  renderMessage(message, i) {
    return(
      <li key={i} className="message" ref="last">
        <strong>{message.name}:</strong> <span>{message.text}</span>
      </li>
    );
  }

  render() {
    return (
      <div className="chatbox">
        <ul className="message-list">
          { this.state.messages.map(this.renderMessage) }
        </ul>
        <form className="message-form" onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            value={this.state.text}
          />
        </form>
      </div>
    );
  }
}
