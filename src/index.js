import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props) => {
  return(
    <button 
      className="square"
      onClick={props.onClick}
      style={props.style}>
      {props.value}
    </button>
  )
}

const SortToggle = (props) => {
  return(
    <div>
      {props.labels.map((item, index) => (
        <label key={index}>
          <input type="radio" name="sort" value={index} checked={props.historySort === index} onChange={() => props.onChange(index)}></input>
          {item}
        </label>
      ))}
    </div>
  )
}

  
  class Board extends React.Component {
    renderSquare(i, isHighLight=false) {
      let style = {}
      if(isHighLight){
        style = {
          background: "yellow",
        }
      }
      return <Square
        style={style}
        value={this.props.squares[i]}
        onClick={() => {this.props.onClick(i)}}
      />;
    }
  
    render() {
      const ele = [];
      for(let i = 0; i < 3; i++){
        const squares = [];
        for(let j = 0; j < 3; j++){
          const isHighLight = this.props.winLine && this.props.winLine.includes(i*3+j);
          squares.push(this.renderSquare(i*3+j, isHighLight));
        }
        ele.push(<div className="board-row">
          {squares}
        </div>)
      }

      return (
        <div>
          {ele}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          clickSquare: null,
          step: null,
        }],
        historySort: 0,
        stepNumber: 0,
        xIsNext: true,
      }
    }
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]){
        return;
      }
      squares[i] = this.state.xIsNext? 'X':'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          clickSquare: [i % 3, Math.floor(i / 3)],
          step: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
    handleChange(i) {
      this.setState({
        historySort: i,
      });
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }
    render() {
      const history = this.state.history;
      const stepNumber = this.state.stepNumber;
      const current = history[stepNumber];
      const winLine = calculateWinner(current.squares);

      const moves = history.map((move, step) => {
        const desc = step ?
          'Go to move #' + step + '(' + move.clickSquare[0] + ',' + move.clickSquare[1] + ')':
          'Go to game start';
        const style = step === stepNumber ?
          {fontWeight:'bold'}:{};
        return(
          <li key={step}>
            <button onClick={() => this.jumpTo(step)} style={style}>{desc}</button>
          </li>
        )
      })

      if(this.state.historySort){
        moves.reverse();
      }
      let status;
      if (winLine) {
        status = 'Winner: ' + current.squares[winLine[0]];
      }else if(stepNumber >= 9){
        status = 'Draw GG!';
      }else{
        status = 'Next Player: ' + (this.state.xIsNext ? 'X':'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              winLine={winLine}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <SortToggle
              historySort={this.state.historySort}
              onChange={(i) => this.handleChange(i)}
              labels={["昇順","降順"]}
            />
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return null;
  }
