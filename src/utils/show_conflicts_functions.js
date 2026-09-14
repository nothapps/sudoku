export function showOneConflict(sudokuBoard, setSudokuBoard) {
    //check if there's a conflict and highlight the related conflicting squares
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isOriginal !== true && square.isHint !== true && square.value !== null) {
                const foundConflicts = findAllConflictsForSquare(sudokuBoard, square.value, i, j);
                if (foundConflicts.size > 1) {
                    updateSudokuBoard(setSudokuBoard, foundConflicts, true);

                    //revert the conflict status after 5 seconds
                    setTimeout(() => {
                        updateSudokuBoard(setSudokuBoard, foundConflicts, false);
                    }, 5000);

                    return true;
                }
            }
        }
    }
}

export function showAllConflicts(sudokuBoard, setSudokuBoard) {
    //check if there are conflicts and highlight them all
    const allConflicts = findAllConflictsOnBoard(sudokuBoard);

    if (allConflicts.size > 0) {
        updateSudokuBoard(setSudokuBoard, allConflicts, true);

        //revert the conflict status after 5 seconds
        setTimeout(() => {
            updateSudokuBoard(setSudokuBoard, allConflicts, false);
        }, 5000);
    }
}

export function showConflictsAutomatically(sudokuBoard) {
    //check if there's a new conflict and highlight it permanently 
    const allConflicts = findAllConflictsOnBoard(sudokuBoard);
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const square = sudokuBoard[row][col];

            if (square.isOriginal !== true) {
                square.isConflict = allConflicts.has(`${row},${col}`);
            }
        }
    }
}

function findAllConflictsForSquare(sudokuBoard, squareValue, row, col) {
    const foundConflicts = new Set();
    foundConflicts.add(`${row},${col}`);

    //conflicts in a row
    for (let i = 0; i < 9; i++) {
        if (sudokuBoard[row][i].value === squareValue) foundConflicts.add(`${row},${i}`);
    }

    //conflicts in a column
    for (let i = 0; i < 9; i++) {
        if (sudokuBoard[i][col].value === squareValue) foundConflicts.add(`${i},${col}`);
    }

    //conflicts in a block 
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuBoard[blockRow + i][blockCol + j].value === squareValue) foundConflicts.add(`${blockRow + i},${blockCol + j}`);
        }
    }

    return foundConflicts;
}

export function findAllConflictsOnBoard(sudokuBoard) {
    const allConflicts = new Set();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isOriginal !== true && square.isHint !== true && square.value !== null) {
                const foundConflicts = findAllConflictsForSquare(sudokuBoard, square.value, i, j);
                if (foundConflicts.size > 1) {
                    foundConflicts.forEach(coord => allConflicts.add(coord));
                }
            }
        }
    }

    return allConflicts;
}

export function updateSudokuBoard(setSudokuBoard, foundConflicts, isConflict) {
    setSudokuBoard(prevBoard => {
        const newBoard = prevBoard.map(row => ([...row]));
        foundConflicts.forEach(conflict => {
            const [row, col] = conflict.split(',');
            if (newBoard[row][col].isOriginal !== true) {
                newBoard[row][col] = {
                    ...newBoard[row][col],
                    isConflict: isConflict
                };
            }
        });
        return newBoard;
    });
}