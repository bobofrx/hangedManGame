import React, { Component } from 'react';

import './App.css';
import { PHRASES } from './Phrase'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')


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
    let {draw_step} = this.state
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    
    this.draw(ctx,draw_step)
  }

  generateInitialState() {
    const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)]
    const usedLetters = new Set()
    const display = computeDisplay(phrase, usedLetters)
    const countGamer1 = 0
    const countGamer2 = 0
    const token = 1
    const draw_step = 0
    const countLetters = new Set()

    return { phrase, display, usedLetters, won: false, countLetters, countGamer1, countGamer2, token, draw_step, exception:false}
  }

  handletter(letter){
    let { phrase, display, usedLetters, countLetters, token, countGamer1, countGamer2, draw_step} = this.state
    letter = letter.toUpperCase()
    let won = false
    let exception = false
    if(ALPHABET.indexOf(letter) >= 0){
      usedLetters.add(letter)
      display = computeDisplay(phrase,usedLetters)
      won = !display.includes('_')
      if(token === 1 ){
        countGamer1 = this.countChange(letter,display,countLetters,countGamer1,draw_step)
      } else {
        countGamer2 = this.countChange(letter,display,countLetters,countGamer2,draw_step)
      }
      token = token === 1 ? 2 : 1
    } else {
      exception = true
    }
    
    this.setState({ display, usedLetters, won, token, countGamer1, countGamer2, exception })
    this.componentDidMount()
    this.componentDidUpdate()
  }

  reset() { 
    this.setState(this.generateInitialState()) 
  }

  countChange(letter, display, countLetters, count,draw_step) {
    count = display.includes(letter) && !countLetters.has(letter) ? Number(count) + Number(GOOD_PTS) : (!display.includes(letter) && !countLetters.has(letter) ? Number(BAD_PTS) + Number(count) : (countLetters.has(letter) ? count : null) )
    if(!display.includes(letter) && !countLetters.has(letter)){
      draw_step = draw_step + 1
    }
    countLetters = !countLetters.has(letter) ? countLetters.add(letter) : countLetters
    this.setState({draw_step})
    return count
  }

  draw(ctx,draw_step) {

    ctx.beginPath();
    ctx.lineWidth = 5;
      //potence 1
      if(draw_step === 1 ) {
        ctx.moveTo(10,10);
        ctx.lineTo(10,530);
        ctx.lineTo(200,530);
      //potence 2  
      } else if(draw_step === 2 ) {
        ctx.moveTo(10,10);
        ctx.lineTo(180,10);
        ctx.lineTo(180,25);
      //corps - tête
      } else if(draw_step === 3 ) {
        ctx.moveTo(227,75);
        ctx.arc(180, 75, 50, 0, Math.PI * 2, true);  // Cercle extérieur
        ctx.moveTo(215,75);
        ctx.arc(180, 75, 35, 0, Math.PI, false);  // Bouche (sens horaire)
        ctx.moveTo(165, 65);
        ctx.arc(160, 65, 5, 0, Math.PI * 2, true);  // Oeil gauche
        ctx.moveTo(200, 65);
        ctx.arc(195, 65, 5, 0, Math.PI * 2, true);  // Oeil droite
      //corps - cou
      } else if(draw_step === 4 ) {
        ctx.moveTo(170,125);
        ctx.lineTo(170, 140);
        ctx.moveTo(190,125);
        ctx.lineTo(190, 140);
      //corps - tronc
      } else if(draw_step === 5 ) {
        ctx.moveTo(140,150);
        ctx.lineTo(140, 260);
        ctx.lineTo(220, 260);
        ctx.moveTo(220,150);
        ctx.lineTo(220, 260);
      //corps - bras 
      } else if(draw_step === 6 ) {
        ctx.moveTo(140,170);
        ctx.lineTo(80, 260);
        ctx.moveTo(220,170);
        ctx.lineTo(280, 260);
      //corps - jambe
      } else if(draw_step === 7 ) {
        ctx.moveTo(160,260);
        ctx.lineTo(160, 360);
        ctx.lineTo(140, 360);
        ctx.moveTo(200,260);
        ctx.lineTo(200, 360);
        ctx.lineTo(220, 360);
      } else {
        ctx.clearRect(0,0,350,550)
      }
      ctx.stroke();
      
  }

  render() {
    const { usedLetters, display, won, countGamer1, countGamer2, token, draw_step,phrase,exception} = this.state

    return (
      <div className={`hangman ${(won && 'won') || ''}`}>
        <p className={token === 1 ? "gamerActive1" : "gamer1"}>{GAMER_1} : <span className={countGamer1 >=0 ? "countPositive" : "countNegative"}>{countGamer1}</span>
        {(won && draw_step < 7) && (countGamer1 > countGamer2) ? " 👑" : ""}</p>
        <p className={token === 2 ? "gamerActive2" : "gamer2"}>{GAMER_2} : <span className={countGamer2 >=0 ? "countPositive" : "countNegative"}>{countGamer2}</span>
        {(won && draw_step < 7) && (countGamer1 < countGamer2) ? " 👑" : ""}</p>
        <br /><br />
        <canvas className="canvas" width={350} height={550} ref="canvas" style={{border:'1px solid #000000',float:'left'}} ></canvas>
        <br /><br />
        { draw_step >= 7 ? (
          <p className="looser">
              Vous avez perdu ! 
              Mot à trouver : {phrase}
        </p>
        ) : (
          <p className="display">{display}</p>
        )}
        { exception ? (
        <p className="exception">Saisie de caractères interdit ! Veuillez jouer à nouveau :)</p>
        ) : (
          ""
        )}
        <p className="letters">
          {(won && draw_step < 7) ? (
            <button className="replay" onClick={() => this.reset()}>
              Rejouer
            </button>
          ) : (draw_step >= 7) ? (
            <button className="loose" onClick={() => this.reset()}>Rejouer</button>
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
