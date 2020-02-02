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
    this.canvas = React.createRef();
  }

  state = this.generateInitialState();

  componentDidMount() {
    this.nameInput.current.focus();
    this.nameInput.current.value=""
  }

  componentDidUpdate() {
    let {token} = this.state
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    this.draw(ctx,token)
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
      countGamer1 = this.countChange(letter,display,countLetters,token,countGamer1)
    } else {
      countGamer2 = this.countChange(letter,display,countLetters,token,countGamer2)
    }
    token = token === 1 ? 2 : 1
    this.setState({ display, usedLetters, won, token, countGamer1, countGamer2 })
    this.componentDidMount()
    this.componentDidUpdate()
  }

  reset() { 
    this.setState(this.generateInitialState()) 
  }

  countChange(letter, display, countLetters, token, count) {
    count = display.includes(letter) && !countLetters.has(letter) ? Number(count) + Number(GOOD_PTS) : (!display.includes(letter) && !countLetters.has(letter) ? Number(BAD_PTS) + Number(count) : (countLetters.has(letter) ? count : null) )
    countLetters = !countLetters.has(letter) ? countLetters.add(letter) : countLetters
    return count
  }

  draw(ctx,token) {
    if(token === 2){
      ctx.beginPath();
      ctx.arc(75, 75, 50, 0, Math.PI * 2, true);  // Cercle extérieur
      ctx.moveTo(110,75);
      ctx.arc(75, 75, 35, 0, Math.PI, false);  // Bouche (sens horaire)
      ctx.moveTo(65, 65);
      ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Oeil gauche
      ctx.moveTo(95, 65);
      ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Oeil droite
      ctx.stroke();
    }
      
  }

  render() {
    const { usedLetters, display, won, countGamer1, countGamer2, token} = this.state

    return (
      <div className={`hangman ${(won && 'won') || ''}`}>
        <p className={token === 1 ? "gamerActive1" : "gamer1"}>{GAMER_1} : <span className={countGamer1 >=0 ? "countPositive" : "countNegative"}>{countGamer1}</span></p>
        <p className={token === 2 ? "gamerActive2" : "gamer2"}>{GAMER_2} : <span className={countGamer2 >=0 ? "countPositive" : "countNegative"}>{countGamer2}</span></p>
        <br /><br />
        <canvas className="canvas" width={350} height={550} ref="canvas" style={{border:'1px solid #000000',float:'left'}} ></canvas>
        <br /><br />
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
