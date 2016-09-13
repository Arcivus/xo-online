import React from 'react';
import ReactDOM from 'react-dom';

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
    this.addMessage = this.addMessage.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('message:send', this.addMessage);
  }

  componentDidUpdate() {
    // scroll to last message
    const node = ReactDOM.findDOMNode(this.refs.last);
    if(node){
      node.scrollIntoView();
    }
  }

  addMessage(message) {
    const {messages} = this.state;
    messages.push({
                  name: message.name,
                  text: message.text
                 });
    this.setState({ messages });
  }

  handleSubmit(e) {
    e.preventDefault();
    let message = {
      name: "You",
      text: this.state.text,
      room: this.props.room
    }
    // Save message to our state, send message to opponent
    this.addMessage(message);
    this.props.socket.emit('message:send', message);

    this.setState({ text: "" });
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
