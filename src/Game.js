import React, { Component } from 'react';

import Board from './Board';
import {calculateWinner, isGameOver} from './gameModel';

import './Game.css';

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      board: Array(9).fill(null),
      xTurn: true,
    };
  }

  handleClick(i) {
    if (this.state.board[i] || isGameOver(this.state.board)) return;
    const board = this.state.board.slice();
    board[i] = this.currentPlayer();
    this.setState({
      board: board,
      xTurn: !this.state.xTurn,
    });
  }

  currentPlayer() {
    return this.state.xTurn ? 'X' : 'O';
  }

  statusMessage() {
    if (isGameOver(this.state.board)) {
      const winner = calculateWinner(this.state.board);
      return winner ? `Player ${winner} won!` : 'It\'s a tie!';
    } else {
      return `Player ${this.currentPlayer()}, take your turn.`;
    }
  }

  render() {
    return (
      <div className="Game">
        <Board board={this.state.board} onClick={i => this.handleClick(i)} />
        <p className="Game-status">{this.statusMessage()}</p>
      </div>
    );
  }
}
