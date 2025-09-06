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