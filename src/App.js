import './css/main.css';
import './css/sidebar.css';
import './css/sudoku_board.css';
import './css/difficulty_dialog.css';
import './css/settings_row.css';
import { useCallback, useState, useEffect } from 'react';
import NumbersRow from './components/numbers_row';
import Sidebar from './components/sidebar';
import SudokuBoard from './components/sudoku_board';
import generateSudokuBoard from './utils/sudoku_algorithm';
import SettingsRow from './components/settings_row';
import useTimer, { formatTime } from './utils/settings_functions';

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
  const [squaresToRemove, setSquaresToRemove] = useState(0);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(true);
  const { time, startTimer, stopTimer, resetTimer } = useTimer();

  //generate sudoku board at the beginning
  useEffect(() => {
    if (squaresToRemove === 0) return;
    const newBoard = generateSudokuBoard(squaresToRemove);
    setSudokuBoard(newBoard);
    startTimer();
  }, [squaresToRemove]);

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
    } else if (pressedKey === 'Backspace' || pressedKey === 'Delete') {
      fillSquare(selectedSquare, null);
    }
  }, [selectedSquare]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  function fillSquare(selectedSquare, value) {
    if (selectedSquare.row === null || !selectedSquare.col === null) return;

    setSudokuBoard(prevBoard => {
      const newBoard = prevBoard.map(row => ([...row]));
      newBoard[selectedSquare.row][selectedSquare.col] = {
        ...newBoard[selectedSquare.row][selectedSquare.col],
        value: value,
        isMistake: false
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
          squaresToRemove={squaresToRemove}
        />
        <div className='main-space'>
          {showDifficultyDialog && <div className='overlay'>
            <div className='difficulty-dialog'>
              <h2>Choose your difficulty level:</h2>
              <button className='difficulty-button'
                onClick={() => {
                  setSquaresToRemove(45);
                  setShowDifficultyDialog(false);
                }}>
                Easy
              </button>
              <button className='difficulty-button'
                onClick={() => {
                  setSquaresToRemove(55);
                  setShowDifficultyDialog(false);
                }}>
                Medium
              </button>
              <button className='difficulty-button' onClick={() => {
                setSquaresToRemove(64);
                setShowDifficultyDialog(false);
              }}>
                Hard
              </button>
            </div>
          </div>}
          <SettingsRow
            squaresToRemove={squaresToRemove}
            setSquaresToRemove={setSquaresToRemove}
            time={time}
          />
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