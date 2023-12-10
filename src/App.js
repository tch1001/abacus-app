import logo from './logo.svg';
import './App.css';
import { useEffect, useRef } from 'react';

const App = props => {

  const numRods = 10;
  const canvasRef = useRef(null)
  const feedbackRef = useRef(null)
  const inputRef = useRef(null)
  function drawAbacus(canvas, stateOfTopBeads, stateOfBottomBeads) {

    // Clear the canvas
    const ctx = canvas.getContext('2d') 
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the abacus frame
    // Picture frame style
    const frameWidth = 175;
    const frameHeight = 100;
    const frameThickness = 5;
    const frameX = 10;
    const frameY = 30;

    // Draw the outer frame
    ctx.fillStyle = 'brown';
    ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

    // Draw the inner frame
    ctx.fillStyle = 'white';
    ctx.fillRect(frameX + frameThickness, frameY + frameThickness, frameWidth - 2 * frameThickness, frameHeight - 2 * frameThickness);


    // Draw the abacus rods
    const rodWidth = frameThickness;
    const rodHeight = frameHeight - 2 * frameThickness;
    const rodSpacing = (frameWidth - 2 * frameThickness - numRods * rodWidth) / (numRods + 1);
    const rodColor = '#B8860B';

    const barRatio = 0.2;
    const barY = frameY + frameThickness + (frameHeight - 2*frameThickness) * barRatio;
    // each rod has 1 bead on top which is either down or up, and 4 beads below which has a total of 5 states
    // 0: all beads down
    // 1: 1 bead up
    // 2: 2 beads up
    // 3: 3 beads up
    // 4: all beads up
    // generate random states for each rod
    // var stateOfTopBeads = [];
    // var stateOfBottomBeads = [];
    // for (let i = 0; i < numRods; i++) {
    //   stateOfBottomBeads.push(Math.floor(Math.random() * 5));
    //   stateOfTopBeads.push(Math.floor(Math.random() * 2));
    // }
    const beadHeight = rodWidth * 1.5;
    const beadWidth = rodWidth * 2;
    const topBeadUpStateY = frameY + frameThickness;
    const topBeadDownStateY = barY - beadHeight;
    const barHeight = frameThickness;
    for (let i = 0; i < numRods; i++) {
      ctx.fillStyle = rodColor;
      ctx.fillRect(frameX + frameThickness + rodSpacing + i * (rodWidth + rodSpacing), frameY + frameThickness, rodWidth, rodHeight);
      ctx.fillStyle = 'black'
      const beadX = frameX + frameThickness + rodSpacing + i * (rodWidth + rodSpacing) + rodWidth / 2 - beadWidth / 2;
      if(stateOfTopBeads[i] === 1) {
        ctx.fillRect(beadX, topBeadUpStateY, beadWidth, beadHeight);
      }else{
        ctx.fillRect(beadX, topBeadDownStateY, beadWidth, beadHeight);
      }
      for(let j = 0; j < stateOfBottomBeads[i]; j++) {
        const bottomBeadY = barY + barHeight + j * beadHeight * 1.3 + beadHeight * 0.3;
        ctx.fillRect(beadX, bottomBeadY, beadWidth, beadHeight);
      }
      for(let j = stateOfBottomBeads[i]; j < 4; j++) {
        const bottomBeadY = frameY + frameHeight - frameThickness - (4 - j) * beadHeight * 1.3;
        ctx.fillRect(beadX, bottomBeadY, beadWidth, beadHeight);
      }
    }

    // Draw the dividing bar
    const barX = frameX + frameThickness;
    ctx.fillStyle = 'brown';
    ctx.fillRect(barX, barY, frameWidth - 2 * frameThickness, barHeight);
  }

  const blankTop = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const blankBottom = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  useEffect(() => {
    const canvas = canvasRef.current
    drawAbacus(canvas, blankTop, blankBottom)
  }, []);

  var number = 0;
  var feedback = 'Feedback';
  function checkAnswer(e) {
    e.preventDefault();
    var answer = document.getElementById('quiz-input').value;
    console.log(answer);
    try{
      answer = parseInt(answer);
    }catch(err) {
      feedback = 'Please enter a number';
      feedbackRef.current.innerHTML = feedback;
      return;
    }
    if(number == answer) {
      feedback = 'Correct!';
      feedbackRef.current.innerHTML = feedback;
      setTimeout(() => {
        feedback = '';
        feedbackRef.current.innerHTML = feedback;
      }, 500);
    }else{
      feedback = `Incorrect. The answer is ${number}.`
      feedbackRef.current.innerHTML = feedback;
    }
    inputRef.current.value = '';
    number = Math.floor(Math.random() * 100);
    const topState = [];
    const bottomState = [];
    // generate the state of the abacus
    var temp = number;
    for(let i = 0; i < numRods; i++) {
      bottomState.push(temp % 5);
      topState.push((temp % 10 - temp % 5) == 5 ? 0 : 1);
      temp -= temp % 10;
      temp /= 10;
    }
    topState.reverse();
    bottomState.reverse();
    console.log(topState, bottomState, number);
    setTimeout(() => {
      drawAbacus(canvasRef.current, topState, bottomState);
    }
    , 1000);
    // wait for 0.5 seconds
    setTimeout(() => {
      drawAbacus(canvasRef.current, blankTop, blankBottom);
    }
    , 1500);
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* virtual abacus on a canvas */}
        <canvas ref={canvasRef} {...props} id="myCanvas" style={{ height: '100vh', width: '100%'}}></canvas>
        {/* have a bit of text on the right */}
        <div class='quiz-div'>
          <p class='quiz-text'>
            Number:
          </p>
          <form onSubmit={checkAnswer}>
            <input ref={inputRef} {...props} type='text' id='quiz-input' autocomplete='off' class='quiz-input' placeholder=''></input><br></br>
            <input type='submit' id='quiz-submit' value='Submit'></input>
          </form>
          <p ref={feedbackRef} {...props} class='quiz-feedback'>
            {feedback}
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
