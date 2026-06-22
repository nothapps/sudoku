export default function showOneConflict(sudokuBoard, setSudokuBoard) {
    //check if there's a conflict and highlight the related conflicting squares
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isConflict !== true && square.isOriginal !== true && square.isHint !== true && square.value !== null) {
                const foundConflicts = findAllConflicts(sudokuBoard, square.value, i, j);
                if (foundConflicts.size > 1) {

                    setSudokuBoard(prevBoard => {
                        const newBoard = prevBoard.map(row => ([...row]));
                        foundConflicts.forEach(conflict => {
                            const [row, col] = conflict.split(',');
                            if (newBoard[row][col].isOriginal !== true) {
                                newBoard[row][col] = {
                                    ...newBoard[row][col],
                                    isConflict: true
                                };
                            }
                        });
                        return newBoard;
                    });

                    //revert the mistake status after 5 seconds
                    setTimeout(() => {
                        setSudokuBoard(prevBoard => {
                            const newBoard = prevBoard.map(row => ([...row]));
                            foundConflicts.forEach(conflict => {
                                const [row, col] = conflict.split(',');
                                if (newBoard[row][col].isOriginal !== true) {
                                    newBoard[row][col] = {
                                        ...newBoard[row][col],
                                        isConflict: false
                                    };
                                }
                            });
                            return newBoard;
                        });
                    }, 5000);

                    return true;
                }
            }
        }
    }
}

export function showAllConflicts(sudokuBoard, setSudokuBoard) {
    //checks if there are conflicts and highlights them all
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isConflict !== true && square.isOriginal !== true && square.isHint !== true && square.value !== null) {
                const foundConflicts = findAllConflicts(sudokuBoard, square.value, i, j);
                if (foundConflicts.size > 1) {
                    setSudokuBoard(prevBoard => {
                        const newBoard = prevBoard.map(row => ([...row]));
                        foundConflicts.forEach(conflict => {
                            const [row, col] = conflict.split(',');
                            if (newBoard[row][col].isOriginal !== true) {
                                newBoard[row][col] = {
                                    ...newBoard[row][col],
                                    isConflict: true
                                };
                            }
                        });
                        return newBoard;
                    });

                    //revert the mistake status after 5 seconds
                    setTimeout(() => {
                        setSudokuBoard(prevBoard => {
                            const newBoard = prevBoard.map(row => ([...row]));
                            foundConflicts.forEach(conflict => {
                                const [row, col] = conflict.split(',');
                                if (newBoard[row][col].isOriginal !== true) {
                                    newBoard[row][col] = {
                                        ...newBoard[row][col],
                                        isConflict: false
                                    };
                                }
                            });
                            return newBoard;
                        });
                    }, 5000);
                }
            }
        }
    }
}

function findAllConflicts(sudokuBoard, squareValue, row, col) {
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