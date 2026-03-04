
export default function SudokuBoard({ sudokuBoard, selectedSquare, selectSquare }) {
    return (
        <div className='sudoku-board'>
            {Array(9).fill().map((_, row) => (
                <div className='sudoku-row' key={row}>
                    {Array(9).fill().map((_, col) => {
                        if (sudokuBoard[row][col].isOriginal === true || sudokuBoard[row][col].isHint === true) {
                            return (
                                <UntouchableSquare key={`${row}-${col}`}
                                    value={sudokuBoard[row][col].value}
                                    isHint={sudokuBoard[row][col].isHint}
                                />
                            )
                        } else {
                            return (
                                <NormalSquare key={`${row}-${col}`}
                                    value={sudokuBoard[row][col].value}
                                    isSquareClicked={selectedSquare.row === row && selectedSquare.col === col}
                                    onSquareClick={() => selectSquare(row, col)}
                                    isMistake={sudokuBoard[row][col].isMistake}
                                />
                            )
                        }
                    })}
                </div>
            ))}
        </div>
    );
}

function UntouchableSquare({ value, isHint }) {
    return (
        <button className={`sudoku-square ${isHint ? 'hint' : 'untouchable'}`}>
            {value}
        </button>
    );
}

function NormalSquare({ value, isSquareClicked, onSquareClick, isMistake }) {
    return (
        <button className={`sudoku-square ${isSquareClicked ? 'active' : ''} ${isMistake ? 'mistake' : ''}`}
            onClick={onSquareClick}>
            {value}
        </button>
    );
}
