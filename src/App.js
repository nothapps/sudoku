import './css/main.css';
import './css/sudoku-board.css';
import './css/settings-dialog.css';
import { useCallback, useState, useEffect } from 'react';
import NumbersRow from './components/numbers_row';
import Sidebar from './components/sidebar';
import SudokuBoard from './components/sudoku_board';
import generateSudokuBoard from './components/sudoku_algorithm';

export default function Sudoku() {
  const [selectedSquare, setSelectedSquare] = useState({ row: null, col: null });
  const [sudokuBoard, setSudokuBoard] = useState(
    Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        originalValue: null,
        isOriginal: false,
        isHint: false,
        isMistake: false
      }))
    )
  );

  //generate sudoku board at the beginning
  useEffect(() => {
    const newBoard = generateSudokuBoard();
    setSudokuBoard(newBoard);
  }, []);

  //selecting and filling a square
  const selectSquare = (row, col) => {
    setSelectedSquare(prevSquare =>
      prevSquare.row === row &&
        prevSquare.col === col ?
        { row: null, col: null } : { row, col });
  };

  const handleKeyPress = useCallback((event) => {
    if (!selectedSquare) return;

    const pressedKey = event.key;

    if (pressedKey >= '1' && pressedKey <= '9') {
      const value = parseInt(pressedKey);
      fillSquare(selectedSquare, value);
    } else if (pressedKey === 'Backspace') {
      fillSquare(selectedSquare, null);
    }
  }, [selectedSquare]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  function fillSquare(selectedSquare, value) {
    setSudokuBoard(prevBoard => {
      const newBoard = prevBoard.map(row => ([...row]));
      newBoard[selectedSquare.row][selectedSquare.col] = {
        ...newBoard[selectedSquare.row][selectedSquare.col],
        value: value
      };
      return newBoard;
    });
  }

  return (
    <>
      <div className='sudoku'>
        <Sidebar
          sudokuBoard={sudokuBoard}
          setSudokuBoard={setSudokuBoard}
        />
        <div className='main-space'>
          <SudokuBoard
            sudokuBoard={sudokuBoard}
            selectedSquare={selectedSquare}
            selectSquare={selectSquare}
          />
          <NumbersRow
            fillSquare={fillSquare}
            selectedSquare={selectedSquare} />
        </div>
      </div>
    </>
  );
}