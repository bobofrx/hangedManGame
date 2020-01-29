import React, { Component } from 'react';

import './App.css';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const PHRASES = `
AVEC REACT LA VIE EST BELLE
DOMMAGE ELIANE
IL EST SYMPA CE PETIT EXO
J’ADORE REACT !
LA VIE L’UNIVERS ET LE RESTE
OPENCLASSROOMS EST MON AMI
`

  .trim()
  .split('\n')

class App extends Component {

  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
  }

  state = this.generateInitialState();

  componentDidMount() {
    this.nameInput.current.focus();
  }

  generateInitialState() {
    const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    const usedLetters = new Set()
    const display = computeDisplay(phrase, usedLetters)

    return { phrase, display, usedLetters, won: false}
  }

  handletter(letter){
    let { phrase, display, usedLetters} = this.state
    console.log(letter)
    usedLetters.add(letter)
    display = computeDisplay(phrase,usedLetters)
    const won = !display.includes('_')
    
    this.setState({ display, usedLetters, won })
  }

  reset() {
    this.setState(this.generateInitialState()) 
  }

  render() {
    const { usedLetters, display, won} = this.state

    return (
      <div className={`hangman ${(won && 'won') || ''}`}>
        <p className="display">{display}</p>
        <p className="letters">
          {won ? (
            <button className="replay" onClick={() => this.reset()}>
              Rejouer
            </button>
          ) : (
            ALPHABET.map((letter) => (
              <button disabled={usedLetters.has(letter)} key={letter} onClick={() => this.handletter(letter)}>
                {letter}
              </button>
            ))
          )}
        </p>
        <input ref={this.nameInput} size="1" maxLength="1" onChange={() => this.handletter(this.nameInput.current.value)} /> 
      </div>
    );
  }
}

export default App;

function computeDisplay(phrase, usedLetters) {  
  return phrase.replace(/\w/g, (letter) => (usedLetters.has(letter) ? letter : '_'))
}
