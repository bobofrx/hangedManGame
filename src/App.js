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
  const GAMER_1 = 'PLAYER 1'
  const GAMER_2 = 'PLAYER 2'

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
    const countGamer1 = 0
    const countGamer2 = 0
    const token = 1
    const countLetters = new Set()

    return { phrase, display, usedLetters, won: false, countLetters, countGamer1, countGamer2, token }
  }

  handletter(letter){
    let { phrase, display, usedLetters, countLetters, token, countGamer1, countGamer2} = this.state
    letter = letter.toUpperCase()
    usedLetters.add(letter)
    display = computeDisplay(phrase,usedLetters)
    const won = !display.includes('_')
    if(token === 1 ){
      countGamer1 = this.countChange(letter,display,countLetters,token,countGamer1, countGamer2)
    } else {
      countGamer2 = this.countChange(letter,display,countLetters,token,countGamer1, countGamer2)
    }
    token = token === 1 ? 2 : 1
    this.setState({ display, usedLetters, won, token, countGamer1, countGamer2 })
    this.componentDidMount()
  }

  reset() { 
    this.setState(this.generateInitialState()) 
  }

  countChange(letter, display, countLetters, token, countGamer1, countGamer2) {
    if (token === 1) {
      countGamer1 = display.includes(letter) && !countLetters.has(letter) ? Number(countGamer1) + Number(GOOD_PTS) : (!display.includes(letter) && !countLetters.has(letter) ? Number(BAD_PTS) + Number(countGamer1) : (countLetters.has(letter) ? countGamer1 : null) )
    } else {
      countGamer2 = display.includes(letter) && !countLetters.has(letter) ? Number(countGamer2) + Number(GOOD_PTS) : (!display.includes(letter) && !countLetters.has(letter) ? Number(BAD_PTS) + Number(countGamer2) : (countLetters.has(letter) ? countGamer2 : null) )
    }
    countLetters = !countLetters.has(letter) ? countLetters.add(letter) : countLetters
    return token === 1 ? countGamer1 : countGamer2
  }

  render() {
    const { usedLetters, display, won, countGamer1, countGamer2, token} = this.state

    return (
      <div className={`hangman ${(won && 'won') || ''}`}>
        <p className={token === 1 ? "gamerActive1" : "gamer1"}>{GAMER_1} : <span className={countGamer1 >=0 ? "countPositive" : "countNegative"}>{countGamer1}</span></p>
        <p className={token === 2 ? "gamerActive2" : "gamer2"}>{GAMER_2} : <span className={countGamer2 >=0 ? "countPositive" : "countNegative"}>{countGamer2}</span></p>
        <br />
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
