
export default function SudokuBoard({ sudokuBoard, selectedSquare, selectSquare, animateConflicts}) {
    return (
        <div className={`sudoku-board ${animateConflicts ? 'animate-conflicts' : ''}`}>
            {Array(9).fill().map((_, row) => (
                <div className='sudoku-row' key={row}>
                    {Array(9).fill().map((_, col) => {
                        const square = sudokuBoard[row][col];
                        if (square.isOriginal === true) {
                            return (
                                <UntouchableSquare key={`${row}-${col}`}
                                    value={square.value}

                                />
                            )
                        } else {
                            return (
                                <NormalSquare key={`${row}-${col}`}
                                    value={square.value}
                                    pencil_notes={square.pencil_notes}
                                    isSquareClicked={selectedSquare.row === row && selectedSquare.col === col}
                                    onSquareClick={() => selectSquare(row, col)}
                                    isConflict={square.isConflict}
                                    isHint={square.isHint}
                                />
                            )
                        }
                    })}
                </div>
            ))}
        </div>
    );
}

function UntouchableSquare({ value }) {
    return (
        <button className={`sudoku-square untouchable`}>
            {value}
        </button>
    );
}

function NormalSquare({ value, pencil_notes, isSquareClicked, onSquareClick, isConflict, isHint }) {
    if (pencil_notes.length > 0) {
        return (
            <button
                className={`sudoku-square ${'pencil-mode'} ${isSquareClicked ? 'active' : ''} ${isConflict ? 'conflict' : ''} ${isHint ? 'hint' : ''}`}
                onClick={onSquareClick}>
                {Array(9).fill().map((_, index) => {
                    const value = index + 1;
                    const isNotePresent = pencil_notes.includes(value);
                    return (
                        <span key={value} className="pencil-note">
                            {isNotePresent ? value : ""}
                        </span>
                    );
                })}
            </button>
        );
    }

    return (
        <button className={`sudoku-square ${isSquareClicked ? 'active' : ''} ${isConflict ? 'conflict' : ''} ${isHint ? 'hint' : ''}`}
            onClick={onSquareClick}>
            {value}
        </button>
    );

}
