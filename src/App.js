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

  const GOOD_PTS = 5
  const BAD_PTS = -2

class App extends Component {

  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
  }

  state = this.generateInitialState();

  componentDidMount() {
    this.nameInput.current.focus();
    this.nameInput.current.value=""
  }

  generateInitialState() {
    const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    const usedLetters = new Set()
    const display = computeDisplay(phrase, usedLetters)
    const count = 0

    return { phrase, display, usedLetters, won: false, count }
  }

  handletter(letter){
    let { phrase, display, usedLetters, count} = this.state
    letter = letter.toUpperCase()
    usedLetters.add(letter)
    display = computeDisplay(phrase,usedLetters)
    const won = !display.includes('_')
    count = this.countChange(letter,display)
    this.setState({ display, usedLetters, won, count })
    this.componentDidMount()
  }

  reset() {
    this.setState(this.generateInitialState()) 
  }

  countChange(letter, display, count) {
    count = display.includes(letter) ? Number(count) + Number(GOOD_PTS) : Number(BAD_PTS) + Number(count)
    console.log(Number(this.count.value))
    console.log(Number(GOOD_PTS))
    console.log(Number(count) + Number(GOOD_PTS))
    this.setState({ count })
  }

  render() {
    const { usedLetters, display, won, count} = this.state

    return (
      <div className={`hangman ${(won && 'won') || ''}`}>
        <p className="count">{count}</p>
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
        <input className="keyboard" ref={this.nameInput} size="1" maxLength="1" value="" onChange={() => this.handletter(this.nameInput.current.value)}  />
         
      </div>
    );
  }
}

export default App;

function computeDisplay(phrase, usedLetters) {  
  return phrase.replace(/\w/g, (letter) => (usedLetters.has(letter) ? letter : '_'))
}
