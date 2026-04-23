export default function generateSudokuBoard(squaresToRemove) {
    let newBoard = Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => ({
            value: null,
            originalValue: null,
            isOriginal: false,
            isHint: false,
            isMistake: false
        }))
    );
    fillBoard(newBoard);

    // removing squares
    while (squaresToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (newBoard[row][col].value !== null) {
            newBoard[row][col].value = null;
            newBoard[row][col].isOriginal = false;
            const prevValue = newBoard[row][col].value;

            const testBoard = newBoard.map(row =>
                row.map(square => ({
                    value: square.value,
                    originalValue: square.originalValue,
                    isOriginal: square.isOriginal,
                    isHint: square.isHint,
                    isMistake: square.isMistake
                }))
            );
            let solutionCount = [0];

            if (solveSudoku(testBoard, solutionCount) === false || solutionCount[0] !== 1) {
                newBoard[row][col].value = prevValue;
                newBoard[row][col].isOriginal = true;
            } else {
                squaresToRemove--;
            }
        }
    }
    return newBoard;
}

function fillBoard(sudokuBoard) {
    const emptySquare = isAnySquareEmpty(sudokuBoard);
    if (emptySquare[0] === null) return true; //full board
    const [row, col] = emptySquare;

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleNumbers(numbers);

    for (let num of numbers) {
        if (isMoveValid(sudokuBoard, row, col, num) === true) {
            sudokuBoard[row][col].value = num;
            sudokuBoard[row][col].originalValue = num;
            sudokuBoard[row][col].isOriginal = true;
            if (fillBoard(sudokuBoard)) return true;
            //backtracking
            sudokuBoard[row][col].value = null;
            sudokuBoard[row][col].originalValue = null;
            sudokuBoard[row][col].isOriginal = false;
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
    const emptySquare = isAnySquareEmpty(sudokuBoard);
    if (emptySquare[0] === null) { //full board
        solutionCount[0]++;
        return solutionCount[0] <= 2;
    }
    const [row, col] = emptySquare;
    for (let i = 1; i <= 9; i++) {
        if (isMoveValid(sudokuBoard, row, col, i) === true) {
            sudokuBoard[row][col].value = i;
            if (solveSudoku(sudokuBoard, solutionCount)) return true;
            sudokuBoard[row][col].value = null; //backtracking
        }
    }
    return false;
}

export function isMoveValid(sudokuBoard, row, col, newNumber) {
    //isRowValid
    for (let i = 0; i < 9; i++) {
        if (i !== col && sudokuBoard[row][i].value === newNumber) return false;
    }

    // isColumnValid
    for (let i = 0; i < 9; i++) {
        if (i !== row && sudokuBoard[i][col].value === newNumber) return false;
    }

    //isBlockValid
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (blockRow + i !== row && blockCol + j !== col && sudokuBoard[blockRow + i][blockCol + j].value === newNumber) return false;
        }
    }

    return true;
}

export function isAnySquareEmpty(sudokuBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (sudokuBoard[i][j].value === null) return [i, j];
        }
    }
    return [null, null];
}
