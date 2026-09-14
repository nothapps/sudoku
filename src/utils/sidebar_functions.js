export default function showHint(sudokuBoard, setSudokuBoard) {
    //fill one random square
    while (true && isAnySquareEmpty(sudokuBoard)[0] !== null) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (sudokuBoard[row][col].value === null) {
            setSudokuBoard(prevBoard => {
                const newBoard = prevBoard.map(row => ([...row]));
                newBoard[row][col] = {
                    ...newBoard[row][col],
                    value: newBoard[row][col].originalValue,
                    pencil_notes: [],
                    isHint: true
                };
                return newBoard;
            });
            return true;
        }
    }
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
            let square = sudokuBoard[blockRow + i][blockCol + j];
            if ((blockRow + i !== row || blockCol + j !== col) && square.value === newNumber) return false;
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