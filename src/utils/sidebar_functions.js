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

export function showMistake(sudokuBoard, setSudokuBoard) {
    //check if there's a mistake and highlight the related conflicting squares
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isMistake !== true && square.isOriginal !== true && square.isHint !== true && square.value !== null) {
                const foundConflicts = findAllMistakes(sudokuBoard, square.value, i, j);
                if (foundConflicts.size > 1) {

                    setSudokuBoard(prevBoard => {
                        const newBoard = prevBoard.map(row => ([...row]));
                        foundConflicts.forEach(conflict => {
                            const [row, col] = conflict.split(',');
                            if (newBoard[row][col].isOriginal !== true) {
                                newBoard[row][col] = {
                                    ...newBoard[row][col],
                                    isMistake: true
                                };
                            }
                        });
                        return newBoard;
                    });
                    return true;
                }
            }
        }
    }
}

function findAllMistakes(sudokuBoard, squareValue, row, col) {
    const foundConflicts = new Set();
    foundConflicts.add(`${row},${col}`);

    //mistakes in a row
    for (let i = 0; i < 9; i++) {
        if (sudokuBoard[row][i].value === squareValue) foundConflicts.add(`${row},${i}`);
    }

    //mistakes in a column
    for (let i = 0; i < 9; i++) {
        if (sudokuBoard[i][col].value === squareValue) foundConflicts.add(`${i},${col}`);
    }

    //mistakes in a block 
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuBoard[blockRow + i][blockCol + j].value === squareValue) foundConflicts.add(`${blockRow + i},${blockCol + j}`);
        }
    }

    return foundConflicts;
}

// export function verifySudoku(sudokuBoard, setSudokuBoard) {
//     const emptySquare = isAnySquareEmpty(sudokuBoard);
//     // if (emptySquare[0] !== null) return false;
//     let foundConflicts = new Set();

//     for (let i = 0; i < 9; i++) {
//         for (let j = 0; j < 9; j++) {
//             const square = sudokuBoard[i][j];
//             if (square.isOriginal !== true && square.isHint !== true && square.value !== null) {
//                 const newConflicts = findAllMistakes(sudokuBoard, square.value, i, j);
//                 foundConflicts = new Set([...foundConflicts, ...newConflicts]);
//             }
//         }
//     }

//     if (foundConflicts.size > 1) {
//         setSudokuBoard(prevBoard => {
//             const newBoard = prevBoard.map(row => ([...row]));
//             foundConflicts.forEach(conflict => {
//                 const [row, col] = conflict.split(',');
//                 if (newBoard[row][col].isOriginal !== true) {
//                     newBoard[row][col] = {
//                         ...newBoard[row][col],
//                         isMistake: true
//                     };
//                 }
//             });
//             return newBoard;
//         });
//         return false;
//     }

//     return true;
// }
