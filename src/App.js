import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Markdown from 'react-markdown'

class App extends Component {
  state = {message: ''}
  originalMessage =''
 
  async componentDidMount(){
    const result = await fetch('/get-message') //?
    const resultJason = await result.json() //? 
    this.originalMessage = resultJason.message //?
    this.setState({message:this.originalMessage} )
  }

  textChanged = e =>{
    const {value} = e.target 
    const regex = new RegExp(value, 'g')
    const newStr = this.originalMessage.replace(regex, `**${value}**`) //?
    this.setState({message: newStr})
  }

  render() {
    return (
      <div className="App">
        <input className="search-input" onChange={this.textChanged}></input>
        <Markdown source={this.state.message} />
      </div>
    );
  }
}

export default App;
