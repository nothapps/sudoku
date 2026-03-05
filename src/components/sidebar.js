import { useState } from "react";
import generateSudokuBoard from "./sudoku_algorithm";
import { isMoveValid } from "./sudoku_algorithm";

export default function Sidebar({ sudokuBoard, setSudokuBoard, squaresToRemove }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className='sidebar'>
            <header> SUDOKU </header>
            <button
                onClick={() => {
                    const originalBoard = sudokuBoard.map(row =>
                        row.map(square => ({
                            ...square,
                            value: square.isOriginal ? square.originalValue : null,
                            originalValue: square.originalValue,
                            isOriginal: square.isOriginal,
                            isHint: square.isHint,
                            isMistake: square.isMistake
                        }))
                    );
                    setSudokuBoard(originalBoard);
                }}
            >
                {'restart'}
            </button>
            <button onClick={() => {
                const newBoard = generateSudokuBoard(squaresToRemove);
                setSudokuBoard(newBoard);
            }}>
                {'new game'}
            </button>
            <button onClick={() => showHint(sudokuBoard, setSudokuBoard)}>
                {'hint'}
            </button>
            <button onClick={() => setIsSettingsOpen(true)}>
                {'settings'}
            </button>
            {/* <div>
                <button onClick={() => setIsSettingsOpen(true)}>
                    {'settings'}
                </button>
                {
                    isSettingsOpen && (
                        <div className='overlay'>
                            <div className='dialog'>
                                <h2>Settings</h2>
                                <p>some settings</p>
                                <button onClick={() => setIsSettingsOpen(false)}>Close</button>
                            </div>
                        </div>
                    )
                }
            </div> */}
        </div>
    );
}

function SidebarButton({ value }) {
    return (
        <button>
            {value}
        </button>

    );
}

function showHint(sudokuBoard, setSudokuBoard) {
    //check if any are wrong
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const square = sudokuBoard[i][j];
            if (square.isMistake !== true && square.isOriginal !== true && square.value !== null && isMoveValid(sudokuBoard, i, j, sudokuBoard[i][j].value) === false) {
                setSudokuBoard(prevBoard => {
                    const newBoard = prevBoard.map(row => ([...row]));
                    newBoard[i][j] = {
                        ...newBoard[i][j],
                        isMistake: true
                    };
                    return newBoard;
                });
                return true;
            }
        }
    }

    //fill one random square
    while (true) {
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
