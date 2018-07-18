import React, { Component } from 'react';
import { Button, Intent, Toaster } from '@blueprintjs/core';
import '@blueprintjs/core/lib/css/blueprint.css';

import Board from './Board';
import {calculateWinner, isGameOver} from './gameModel';

import './Game.css';

const GameToaster = Toaster.create();

const HOST = '/';

async function throwyJSONFetch(url) {
  const response = await fetch(url);
  if (response.status !== 200) throw new Error();
  return await response.json();
}

async function fetchReset() {
  return throwyJSONFetch(HOST + 'reset');
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
    setInterval(async () => {
      const [board, turn] = await Promise.all([fetchBoard(), fetchTurn()]);
      this.setState({ board, xTurn: turn === 'X' });
    }, 1000);
    const [board, turn] = await Promise.all([fetchBoard(), fetchTurn()]);
    this.setState({ board, xTurn: turn === 'X' });
    GameToaster.show({ message: 'Loaded!' });
  }

  async handleClick(i) {
    const { board } = this.state;
    if (!board || board[i] || isGameOver(board)) return;

    let newBoard;
    try {
      newBoard = await fetchPlayMove(this.currentPlayer(), i);
    } catch (_) {
      GameToaster.show({ message: 'You are very bad.', intent: Intent.DANGER });
      newBoard = await fetchBoard();
    }
    this.setState({
      board: newBoard,
      xTurn: !this.state.xTurn,
    });

    if (calculateWinner(newBoard)) {
      GameToaster.show({ message: 'Nice!', intent: Intent.SUCCESS });
    }
  }

  async handleReset() {
    this.setState({ board: await fetchReset(), xTurn: true });
    GameToaster.show({
      message: 'Now, we are back to the beginning.',
      intent: Intent.WARNING,
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
        <Board
          board={this.state.board || Array(9).fill(null)}
          onClick={i => this.handleClick(i)}
        />
        <p className="Game-status">{this.statusMessage()}</p>
        <Button
          className="Game-reset"
          onClick={() => this.handleReset()} icon="refresh"
        />
      </div>
    );
  }
}
