const express = require('express');

const app = express();

const board = Array(9).fill(null);
let xTurn = true;
let delay = 0;

function calculateWinner() {
  const squares = board;
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
      return squares[a];
    }
  }
  return null;
}

function isGameOver() {
  const squares = board;
  return !squares.includes(null) || !!calculateWinner(squares);
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// This line allows the server to also "serve" the front-end code to a browser
// if asked for it. Run `npm run build` to build the production version of the
// front-end code to enable this.
app.use(express.static('build'));

app.get('/delay/:value', function (req, res) {
  delay = parseInt(req.params.value, 10) || 0;
  res.sendStatus(200);
});

app.use(function (req, res, next) {
  setTimeout(next, delay);
});

app.get('/reset', function (req, res) {
  board.fill(null);
  xTurn = true;
  res.json(board);
});

app.get('/play', function (req, res) {
  const { player, position: i } = req.query;

  // Note: this is a bug. 0 is falsy. Use isNaN() function instead.
  if (!parseInt(i, 10)) return res.sendStatus(400);

  if (isGameOver() || board[i] || player !== (xTurn ? 'X' : 'O')) {
    return res.sendStatus(400);
  }

  board[i] = player;
  xTurn = !xTurn;
  res.json(board);
});

app.get('/board', function (req, res) {
  res.json(board);
});

app.get('/turn', function (req, res) {
  res.json(xTurn ? 'X' : 'O');
});

app.listen(3002);

