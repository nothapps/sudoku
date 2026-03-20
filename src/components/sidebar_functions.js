import { isMoveValid } from "./sudoku_algorithm";
import { isAnySquareEmpty } from "./sudoku_algorithm";

export default function showHint(sudokuBoard, setSudokuBoard) {
    // //check if any are wrong
    // for (let i = 0; i < 9; i++) {
    //     for (let j = 0; j < 9; j++) {
    //         const square = sudokuBoard[i][j];
    //         const conflictingSquare = isMoveValid(sudokuBoard, i, j, sudokuBoard[i][j].value);
    //         if (square.isMistake !== true && square.isOriginal !== true && square.value !== null && conflictingSquare[0] !== null) {
    //             setSudokuBoard(prevBoard => {
    //                 const newBoard = prevBoard.map(row => ([...row]));
    //                 newBoard[i][j] = {
    //                     ...newBoard[i][j],
    //                     isMistake: true
    //                 };
    //                 newBoard[conflictingSquare[0]][conflictingSquare[1]] = {
    //                     ...newBoard[conflictingSquare[0]][conflictingSquare[1]],
    //                     isMistake: true
    //                 };
    //                 return newBoard;
    //             });
    //             return true;
    //         }
    //     }
    // }

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

export function showMistake(sudokuBoard, setSudokuBoard) {
    //check if any are wrong
    const foundConflicts = new Set();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isMistake !== true && square.isOriginal !== true && square.isHint !== true && square.value !== null) {
                const conflictingSquare = isMoveValid(sudokuBoard, i, j, sudokuBoard[i][j].value);
                if (conflictingSquare[0] !== null) {
                    foundConflicts.add(`${i},${j}`);
                    foundConflicts.add(`${conflictingSquare[0]},${conflictingSquare[1]}`);
                }
            }
        }
    }

    if (foundConflicts.size > 0) {
        setSudokuBoard(prevBoard => {
            const newBoard = prevBoard.map(row => ([...row]));
            foundConflicts.forEach(conflict => {
                const [row, col] = conflict.split(',');
                 newBoard[row][col] = {
                    ...newBoard[row][col],
                    isMistake: true
                };
            });
            return newBoard;
        });
        return true;
    }

    return false;
}