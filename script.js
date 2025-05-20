let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameMode = 'player';
let gameActive = false;
let timer;
let timeLeft = 90;

const statusDisplay = document.getElementById('status');
const boardEl = document.getElementById('board');
const timerEl = document.getElementById('timer');

function startGame(mode) {
  gameMode = mode;
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  timeLeft = 90;

  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'flex';
  renderBoard();
  updateTimer();
  startTimer();
  statusDisplay.textContent = "Vez de: " + currentPlayer;
}

function renderBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.textContent = board[i];
    cell.addEventListener('click', () => handleCellClick(i, cell));
    boardEl.appendChild(cell);
  }
}

function handleCellClick(index, cellElement = null) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  const cell = cellElement || boardEl.children[index];
  cell.textContent = currentPlayer;
  cell.classList.add('played');

  if (checkWin()) {
    gameActive = false;
    statusDisplay.textContent = `${currentPlayer} venceu!`;
    stopTimer();
    setTimeout(returnToMenu, 3000);
    return;
  }

  if (board.every(cell => cell)) {
    gameActive = false;
    statusDisplay.textContent = "Empate!";
    stopTimer();
    setTimeout(returnToMenu, 3000);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = "Vez de: " + currentPlayer;

  if (gameMode === 'bot' && currentPlayer === 'O') {
    setTimeout(botMove, 400);
  }
}

function botMove() {
  const emptyIndices = board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
  const choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const cellEl = boardEl.children[choice];
  handleCellClick(choice, cellEl);
}

function checkWin() {
  const winConditions = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winConditions.some(([a, b, c]) => board[a] && board[a] === board[b] && board[b] === board[c]);
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      stopTimer();
      statusDisplay.textContent = "Tempo esgotado!";
      gameActive = false;
      setTimeout(returnToMenu, 3000);
    }
  }, 1000);
}

function updateTimer() {
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  timerEl.textContent = `Tempo restante: ${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function stopTimer() {
  clearInterval(timer);
}

function pauseGame() {
  stopTimer();
  returnToMenu();
}

function returnToMenu() {
  gameActive = false;
  document.getElementById('menu').style.display = 'flex';
  document.getElementById('game').style.display = 'none';
}
