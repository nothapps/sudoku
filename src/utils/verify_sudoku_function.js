import { findAllConflictsOnBoard } from "./show_conflicts_functions";
import { isAnySquareEmpty } from "./sidebar_functions";

export function verifySudoku(sudokuBoard) {
    const emptySquare = isAnySquareEmpty(sudokuBoard);
    if (emptySquare[0] !== null) return false; //board not full yet

    return findAllConflictsOnBoard(sudokuBoard).size === 0;
}
