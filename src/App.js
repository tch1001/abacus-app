import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

const App = props => {

  const numRods = 10;
  const canvasRef = useRef(null)
  const keypadRef = useRef([])
  const sliderRef = useRef(null)
  const feedbackRef = useRef(null)
  const inputRef = useRef(null)
  // Draw the abacus frame
  // Picture frame style
  const frameWidth = 175;
  const frameHeight = 100;
  const frameThickness = 5;
  const frameX = 10;
  const frameY = 30;
  const rodWidth = frameThickness;
  const rodHeight = frameHeight - 2 * frameThickness;
  const rodSpacing = (frameWidth - 2 * frameThickness - numRods * rodWidth) / (numRods + 1);
  const rodColor = '#B8860B';

  const barRatio = 0.2;
  const barY = frameY + frameThickness + (frameHeight - 2 * frameThickness) * barRatio;
  const beadHeight = rodWidth * 1.5;
  const beadWidth = rodWidth * 2;
  const topBeadUpStateY = frameY + frameThickness;
  const topBeadDownStateY = barY - beadHeight;
  const barHeight = frameThickness;

  function drawAbacus(canvas, stateOfTopBeads, stateOfBottomBeads) {

    // Clear the canvas
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the outer frame
    ctx.fillStyle = 'brown';
    ctx.fillRect(frameX, frameY, frameWidth, frameHeight);

    // Draw the inner frame
    ctx.fillStyle = 'white';
    ctx.fillRect(frameX + frameThickness, frameY + frameThickness, frameWidth - 2 * frameThickness, frameHeight - 2 * frameThickness);


    // Draw the abacus rods

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

    for (let i = 0; i < numRods; i++) {
      ctx.fillStyle = rodColor;
      ctx.fillRect(frameX + frameThickness + rodSpacing + i * (rodWidth + rodSpacing), frameY + frameThickness, rodWidth, rodHeight);
      ctx.fillStyle = 'black'
      const beadX = frameX + frameThickness + rodSpacing + i * (rodWidth + rodSpacing) + rodWidth / 2 - beadWidth / 2;
      if (stateOfTopBeads[i] === 1) {
        ctx.fillRect(beadX, topBeadUpStateY, beadWidth, beadHeight);
      } else {
        ctx.fillRect(beadX, topBeadDownStateY, beadWidth, beadHeight);
      }
      for (let j = 0; j < stateOfBottomBeads[i]; j++) {
        const bottomBeadY = barY + barHeight + j * beadHeight * 1.3 + beadHeight * 0.3;
        ctx.fillRect(beadX, bottomBeadY, beadWidth, beadHeight);
      }
      for (let j = stateOfBottomBeads[i]; j < 4; j++) {
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
  var streak = 0;
  var feedback = 'Feedback';
  function keypadClick(e) {
    e.preventDefault();
    var value = e.target.value;
    inputRef.current.value += value;
  }
  var topState = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  var bottomState = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  function checkAnswer(e) {
    e.preventDefault();
    var answer = document.getElementById('quiz-input').value;
    console.log(answer);
    try {
      answer = parseInt(answer);
    } catch (err) {
      feedback = 'Please enter a number';
      feedbackRef.current.innerHTML = feedback;
      return;
    }
    if (number == answer) {
      feedback = 'Correct! Streak = ' + ++streak;
      feedbackRef.current.innerHTML = feedback;
    } else {
      feedback = `Incorrect. The answer is ${number}.`
      streak = 0
      feedbackRef.current.innerHTML = feedback;
    }
    inputRef.current.value = '';
    number = Math.floor(Math.random() * Math.pow(10, sliderRef.current.value));
    topState = [];
    bottomState = [];
    // generate the state of the abacus
    var temp = number;
    for (let i = 0; i < numRods; i++) {
      bottomState.push(temp % 5);
      topState.push((temp % 10 - temp % 5) == 5 ? 0 : 1);
      temp -= temp % 10;
      temp /= 10;
    }
    topState.reverse();
    bottomState.reverse();
    setTimeout(() => {
      drawAbacus(canvasRef.current, topState, bottomState);
    }
      , 1000);
    // wait for 0.5 seconds
    setTimeout(() => {
      drawAbacus(canvasRef.current, blankTop, blankBottom);
    }
      , 1000 + parseInt(timerRef.current.value));
  }
  const settingsRef = useRef(null);
  const timerRef = useRef(null);
  function sliderChange(e) {
    settingsRef.current.innerHTML = `${e.target.value} digits, ${timerRef.current.value}ms`;
  }
  function timerChange(e) {
    settingsRef.current.innerHTML = `${sliderRef.current.value} digits, ${e.target.value}ms`;
  }
  const backspaceRef = useRef(null);
  function backspaceClick(e) {
    e.preventDefault();
    var value = inputRef.current.value;
    inputRef.current.value = value.substring(0, value.length - 1);
  }
  const [gameMode, setGameMode] = useState(0);
  function canvasClick(e) {
    e.preventDefault();
    if (gameMode != 1) return;
    // map the click to the closest bead
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    x *= canvas.width / rect.width;
    y *= canvas.height / rect.height;
    if (x < frameX + frameThickness || x > frameX + frameWidth - frameThickness || y < frameY + frameThickness || y > frameY + frameHeight - frameThickness) {
      console.log("out of bounds")
      return;
    }
    const rod = Math.floor((x - frameX - frameThickness - rodSpacing) / (rodWidth + rodSpacing));
    var bead = Math.floor((y - frameY - frameThickness) / beadHeight);
    if (bead >= 11) {
      bead = 10;
    }
    if (bead >= 2 && bead <= 3) {
      bead = 4;
    }
    if (bead == 0) {
      topState[rod] = 0;
    } else if (bead == 1) {
      topState[rod] = 1;
    } else
      switch (bottomState[rod]) {
        case 0:
          if (bead >= 7) {
            bottomState[rod] = bead - 6;
            break;
          }
        case 1:
          if (bead >= 8) {
            bottomState[rod] = bead - 6;
          } else if (bead <= 4) {
            bottomState[rod] = 0;
          }
          break;
        case 2:
          if (bead >= 9) {
            bottomState[rod] = bead - 6;
          } else if (bead <= 5) {
            bottomState[rod] = bead - 4;
          }
          break;
        case 3:
          if (bead >= 10) {
            bottomState[rod] = bead - 6;
          } else if (bead <= 6) {
            bottomState[rod] = bead - 4;
          }
          break;
        case 4:
          if (bead <= 7) {
            bottomState[rod] = bead - 4;
          }
          break;
      }
    drawAbacus(canvasRef.current, topState, bottomState);
    // calculate the number
    var inputtedNumber = 0;
    for (let i = 0; i < numRods; i++) {
      inputtedNumber += bottomState[i] * Math.pow(10, i);
    }
    for (let i = 0; i < numRods; i++) {
      inputtedNumber += topState[i] * Math.pow(10, i) * 5;
    }
  }
  const [question, setQuestion] = useState('Question: ');
  var streak2 = useRef(0);
  var flashNumber = useRef(0);
  function setFlashNumber(newnumber) {
    flashNumber.current = newnumber;
  }
  function checkAbacusAnswer(e) {
    e.preventDefault();
    var inputtedNumber = 0;
    for (let i = 0; i < numRods; i++) {
      inputtedNumber += bottomState[i] * Math.pow(10, 10 - i - 1);
    }
    for (let i = 0; i < numRods; i++) {
      inputtedNumber += (1 - topState[i]) * Math.pow(10, 10 - i - 1) * 5;
    }
    console.log(inputtedNumber, flashNumber.current);
    if (inputtedNumber == flashNumber.current) {
      feedback = 'Correct! Streak = ' + ++streak2.current;
      feedbackRef.current.innerHTML = feedback;
    } else {
      feedback = `Incorrect.`
      streak2.current = 0
      feedbackRef.current.innerHTML = feedback;
    }
    topState = blankTop;
    bottomState = blankBottom;
    drawAbacus(canvasRef.current, topState, bottomState);
    setTimeout(() => {
      setFlashNumber(Math.floor(Math.random() * Math.pow(10, sliderRef.current.value)));
      setQuestion('Question: ' + flashNumber.current);
    }, 100);
    setTimeout(() => {
      setQuestion('Input Beads: ');
    }, parseInt(timerRef.current.value));
  }

  const renderGame = () => {
    if (gameMode == 0) {
      return (<form onSubmit={checkAnswer}>
        <input ref={inputRef} {...props} type='text' id='quiz-input' autocomplete='off' class='quiz-input' placeholder=''></input><br></br>
        <table class='keypadTable'>
          <tr className='keypadRow'>
            <td class='keypadCol'><input ref={keypadRef[1]} type='button' value='1' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={keypadRef[2]} type='button' value='2' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={keypadRef[3]} type='button' value='3' class='keypadButton' onClick={keypadClick}></input></td>
          </tr>
          <tr className='keypadRow'>
            <td class='keypadCol'><input ref={keypadRef[4]} type='button' value='4' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={keypadRef[5]} type='button' value='5' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={keypadRef[6]} type='button' value='6' class='keypadButton' onClick={keypadClick}></input></td>
          </tr>
          <tr className='keypadRow'>
            <td class='keypadCol'><input ref={keypadRef[7]} type='button' value='7' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={keypadRef[8]} type='button' value='8' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={keypadRef[9]} type='button' value='9' class='keypadButton' onClick={keypadClick}></input></td>
          </tr>
          <tr className='keypadRow'>
            <td class='keypadCol'></td>
            <td class='keypadCol'><input ref={keypadRef[0]} type='button' value='0' class='keypadButton' onClick={keypadClick}></input></td>
            <td class='keypadCol'><input ref={backspaceRef} type='button' value='BS' class='keypadButton' onClick={backspaceClick}></input></td>
          </tr>
        </table>
        <br></br>
        <input type='submit' class='quiz-submit' value='Submit'></input>
      </form>)
    } else if (gameMode == 1) {
      return (
        <div>
          <p>{question}</p>
          <form onSubmit={checkAbacusAnswer}>
            <input type='submit' class='quiz-submit' value='Submit'></input>
          </form>
        </div>
      )
    }
  }
  function changeGamemode(e) {
    setGameMode((old) => (old + 1) % 2);
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* virtual abacus on a canvas */}
        <canvas onClick={canvasClick} ref={canvasRef} {...props} id="myCanvas" style={{ height: '100vh', width: '100%' }}></canvas>
        {/* have a bit of text on the right */}
        <div class='quiz-div'>
          {/* slider */}
          <input ref={sliderRef} onChange={sliderChange} type='range' min='1' max='10' defaultValue="3" class='quiz-slider'></input>
          <input ref={timerRef} onChange={timerChange} type='range' min='100' max='2000' defaultValue="750" class='quiz-slider'></input>
          <input type='button' value='Game Mode' class='quiz-submit' onClick={changeGamemode}></input>
          <p ref={settingsRef}>3 digits, 750ms</p>
          {renderGame()}
          <p ref={feedbackRef} {...props} class='quiz-feedback'>
            {feedback}
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
