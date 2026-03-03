export default function generateSudokuBoard() {
    let removedSquares = Array(9).fill(null).map(() => Array(9).fill(null));
    let newBoard = Array(9).fill(null).map(() => Array(9).fill(null));
    fillBoard(newBoard);

    // removing squares
    let squaresToRemove = 45;
    while (squaresToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (newBoard[row][col] != null) {
            removedSquares[row][col] = newBoard[row][col];
            newBoard[row][col] = null;
            const testBoard = newBoard.map(row => row.map(value => value));
            let solutionCount = [0];

            if (solveSudoku(testBoard, solutionCount) === false || solutionCount[0] !== 1) {
                newBoard[row][col] = removedSquares[row][col];
                removedSquares[row][col] = null;
            } else {
                squaresToRemove--;
            }
        }
    }
    return [newBoard, removedSquares];
}

export function solveSudoku(squareValues, solutionCount) {
    const emptySquare = isSquareEmpty(squareValues);
    if (emptySquare[0] === null) { //full board
        solutionCount[0]++;
        return solutionCount[0] <= 2;
    }
    const [row, col] = emptySquare;
    for (let i = 1; i <= 9; i++) {
        if (isMoveValid(squareValues, row, col, i)) {
            squareValues[row][col] = i;
            if (solveSudoku(squareValues, solutionCount)) return true;
            squareValues[row][col] = null; //backtracking
        }
    }
    return false;
}


function fillBoard(squareValues) {
    const emptySquare = isSquareEmpty(squareValues);
    if (emptySquare[0] === null) return true; //full board
    const [row, col] = emptySquare;

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleNumbers(numbers);

    for (let num of numbers) {
        if (isMoveValid(squareValues, row, col, num)) {
            squareValues[row][col] = num;
            if (fillBoard(squareValues)) return true;
            squareValues[row][col] = null; //backtracking
        }
    }
    return false;
}

function shuffleNumbers(array) {
    let i = array.length, j, temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[j];
        array[j] = array[i];
        array[i] = temp;
    }
}

export function isMoveValid(squareValues, row, col, newNumber) {
    //isRowValid
    for (let i = 0; i < 9; i++) {
        if (squareValues[i][col] === newNumber) return false;
    }

    //isColumnValid
    for (let i = 0; i < 9; i++) {
        if (squareValues[row][i] === newNumber) return false;
    }

    //isBlockValid
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (squareValues[blockRow + i][blockCol + j] === newNumber) return false;
        }
    }

    return true;
}

export function isSquareEmpty(squareValues) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (squareValues[i][j] === null) return [i, j];
        }
    }
    return [null, null];
}
