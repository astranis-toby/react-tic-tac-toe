import React, { Component } from 'react';
import { Toaster } from '@blueprintjs/core';

import Board from './Board';
import {calculateWinner, isGameOver} from './gameModel';

import './Game.css';

const GameToaster = Toaster.create();

const HOST = 'http://happy-lappy-toby:3002/';

async function throwyJSONFetch(url) {
  const response = await fetch(url);
  if (response.status !== 200) throw new Error();
  return await response.json();
}

async function fetchBoard() {
  return throwyJSONFetch(HOST + 'board');
}

function fetchPlayMove(player, position) {
  return throwyJSONFetch(HOST + `play?player=${player}&position=${position}`);
}

function fetchTurn() {
  return throwyJSONFetch(HOST + 'turn');
}

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      board: undefined,
      xTurn: undefined,
    };
  }

  async componentDidMount() {
    const [board, turn] = await Promise.all([fetchBoard(), fetchTurn()]);
    this.setState({ board, xTurn: turn === 'X' });
    GameToaster.show({ message: 'Yo.' });

    setInterval(async () => {
      const [board, turn] = await Promise.all([fetchBoard(), fetchTurn()]);
      this.setState({ board, xTurn: turn === 'X' });
    }, 1000);

  }

  async handleClick(i) {
    const { board } = this.state;
    if (!board || board[i] || isGameOver(board)) return;

    let newBoard;
    try {
      newBoard = await fetchPlayMove(this.currentPlayer(), i);
    } catch (_) {
      newBoard = await fetchBoard();
    }
    this.setState({
      board: newBoard,
      xTurn: !this.state.xTurn,
    });
  }

  currentPlayer() {
    return this.state.xTurn ? 'X' : 'O';
  }

  statusMessage() {
    if (this.state.board === undefined) {
      return '';
    }
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
        <Board board={this.state.board || Array(9).fill(null)} onClick={i => this.handleClick(i)} />
        <p className="Game-status">{this.statusMessage()}</p>
      </div>
    );
  }
}
