export default function generateSudokuBoard(squaresToRemove) {
    //sudoku board with only numbers, no extra information
    let rawBoard = Array(9).fill(null).map(() => Array(9).fill(0));

    fillRawBoard(rawBoard);
    const solvedBoard = rawBoard.map(row => [...row]);
    let failedAttempts = 0;
    const maxFailedAttempts = 35;

    // removing squares
    while (squaresToRemove > 0 && failedAttempts < maxFailedAttempts) {
        // attempts++;
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (rawBoard[row][col] !== 0) {
            const prevValue = rawBoard[row][col];
            rawBoard[row][col] = 0;
            const testBoard = rawBoard.map(row => [...row]);

            let solutionCount = [0];
            solveSudoku(testBoard, solutionCount, solvedBoard);

            if (solutionCount[0] !== 1) {
                rawBoard[row][col] = prevValue;
                failedAttempts++;
            } else {
                squaresToRemove--;
                failedAttempts = 0;
            }
        }
    }

    return rawBoard.map((row, rowIndex) => row.map((value, colIndex) => ({
        value: value === 0 ? null : value,
        originalValue: solvedBoard[rowIndex][colIndex],
        isOriginal: value !== 0,
        isHint: false,
        isMistake: false
    })));
}

function fillRawBoard(sudokuBoard) {
    const emptySquare = isAnyRawSquareEmpty(sudokuBoard);
    if (emptySquare[0] === null) return true; //full board
    const [row, col] = emptySquare;

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleNumbers(numbers);

    for (let num of numbers) {
        if (isRawMoveValid(sudokuBoard, row, col, num) === true) {
            sudokuBoard[row][col] = num;
            if (fillRawBoard(sudokuBoard)) return true;
            //backtracking
            sudokuBoard[row][col] = 0;
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

export function solveSudoku(sudokuBoard, solutionCount) {
    const emptySquare = isAnyRawSquareEmpty(sudokuBoard);
    if (emptySquare[0] === null) { //full board
        solutionCount[0]++;
        return solutionCount[0] >= 2;
    }
    const [row, col] = emptySquare;
    for (let i = 1; i <= 9; i++) {
        if (isRawMoveValid(sudokuBoard, row, col, i) === true) {
            sudokuBoard[row][col] = i;
            if (solveSudoku(sudokuBoard, solutionCount)) return true;
            sudokuBoard[row][col] = 0; //backtracking
        }
    }
    return false;
}

export function isRawMoveValid(sudokuBoard, row, col, newNumber) {
    //isRowValid
    for (let i = 0; i < 9; i++) {
        if (i !== col && sudokuBoard[row][i] === newNumber) return false;
    }

    // isColumnValid
    for (let i = 0; i < 9; i++) {
        if (i !== row && sudokuBoard[i][col] === newNumber) return false;
    }

    //isBlockValid
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let square = sudokuBoard[blockRow + i][blockCol + j];
            if ((blockRow + i !== row || blockCol + j !== col) && square === newNumber) return false;
        }
    }

    return true;
}

export function isAnyRawSquareEmpty(sudokuBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuBoard[i][j] === 0) return [i, j];
        }
    }

    return [null, null];
}