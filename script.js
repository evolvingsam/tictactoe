function Gameboard() {
    const row = 3;
    const col = 3;
    let board = [];
    
    for (let i = 0; i < row; i++) {
        board[i] = [];
        for (let j = 0; j < col; j++) {
            board[i][j] = '';
        }
    }

    const getBoard = () => board;
    const setBoard = (row, col, symbol) => {
        if (board[row][col] === '') {
            board[row][col] = symbol;
            return true;
        }
        return false;
    };
    const resetBoard = () => {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                board[i][j] = '';
            }
        }
    };

    return { getBoard, setBoard, resetBoard };
}

function Player(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;

    return { getName, getSymbol };
}
function Game() {
    const gameboard = Gameboard();
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;
    let isGameOver = false;
    let winner = null;  // Track the winner
    let isDraw = false; 

    const switchPlayer = () => {
        console.log(currentPlayer.getName());
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(currentPlayer.getName());
    };

    const checkWin = () => {
        const board = gameboard.getBoard();
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                return true;
            }
            if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                return true;
            }
        }
        // Check diagonals
        if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
            return true;
        }
        if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
            return true;
        }
        return false;
    };

    const checkDraw = () => {
        const board = gameboard.getBoard();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    return false;
                }
            }
        }
        return true;
    };

    const playTurn = (row, col) => {
        if (isGameOver) return;

        if (gameboard.setBoard(row, col, currentPlayer.getSymbol())) {
            if (checkWin()) {
                isGameOver = true;
                winner = currentPlayer.getName();  // Set the winner
                console.log(`${currentPlayer.getName()} wins!`);
            } else if (checkDraw()) {
                isGameOver = true;
                isDraw = true;
                console.log("It's a draw!");
            } else {
               
                switchPlayer();
                

            }
        }
    };
    
    const resetGame = () => {
        gameboard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
        winner = null;
        isDraw = false;
    };

    const getCurrentPlayer = () => currentPlayer;
    const getGameOver = () => isGameOver;
    const getWinner = () => winner;
    const getIsDraw = () => isDraw;

    return { 
        playTurn, 
        resetGame, 
        gameboard, 
        getCurrentPlayer, 
        getGameOver, 
        getWinner,    // Expose winner
        getIsDraw     // Expose draw status
    };
}

function printBoard(board) {
    console.clear();
    console.log('Current Board:');
    board.forEach(row => {
        console.log(row.map(cell => cell || '-').join(' | '));
    });
}

function playgameInConsole() {
    
    const game = Game();

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askMove = () => {
     
        printBoard(game.gameboard.getBoard());
        
        readline.question(`${game.getCurrentPlayer().getName()} (${game.getCurrentPlayer().getSymbol()}), enter your move...`, input => {
          
            const [row, col] = input.split(' ').map(Number);
            console.log([row, col]);
            if (row >= 0 && row < 3 && col >= 0 && col < 3) {
               
                game.playTurn(row, col);
                printBoard(game.gameboard.getBoard());

                if (!game.getGameOver()) {
                    askMove();
                } else {
                    readline.question('Game over! Do you want to play again? (yes/no): ', answer => {
                        if (answer.toLowerCase() === 'yes') {
                            game.resetGame();
                            askMove();
                        } else {
                            readline.close();
                        }
                    });
                }
            } else {
                console.log('Invalid move. Try again.');
                askMove();
            }
        });
    };
    
    askMove();
}

// playgameInConsole();

function setupUI() {
    const game = Game();
    const boardContainer = document.getElementById('board');
    const resetButton = document.getElementById('reset');

    const updateBoard = () => {
        const board = game.gameboard.getBoard();
        const cells = boardContainer.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            cell.textContent = board[row][col];
        });
    };

    const createBoard = () => {
        boardContainer.innerHTML = '';
        const board = game.gameboard.getBoard();
        board.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('cell');
                cellDiv.dataset.row = i;
                cellDiv.dataset.col = j;
                cellDiv.textContent = cell;
                cellDiv.addEventListener('click', () => {
                    if (!game.getGameOver() && cellDiv.textContent === '') {
                        game.playTurn(i, j);
                        updateBoard();
                        
                        if (game.getGameOver()) {
                            setTimeout(() => {
                                if (game.getIsDraw()) {
                                    alert("It's a draw!");
                                    game.resetGame();
                                    updateBoard();
                                } else {
                                    alert(game.getWinner() + ' wins!');
                                    game.resetGame();
                                    updateBoard();
                                }
                            }, 100);
                        }
                    }
                });
                boardContainer.appendChild(cellDiv);
            });
        });
    };

    resetButton.addEventListener('click', () => {
        game.resetGame();
        updateBoard();
    });

    createBoard();
}
setupUI();