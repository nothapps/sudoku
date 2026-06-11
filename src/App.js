import './css/main.css';
import './css/sidebar.css';
import './css/sudoku_board.css';
import './css/difficulty_dialog.css';
import './css/numbers_row.css';
import './css/additional_settings_row.css';
import './css/new_restart_dialog.css';
import { useCallback, useState, useEffect } from 'react';
import NumbersRow from './components/numbers_row';
import Sidebar from './components/sidebar';
import SudokuBoard from './components/sudoku_board';
import generateSudokuBoard from './utils/sudoku_algorithm';
import SettingsRow from './components/additonal_settings_row';
import useTimer from './utils/additional_settings_functions';

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
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const areButtonsDisabled = showDifficultyDialog || showRestartDialog || showNewGameDialog;
  const { time, startTimer, stopTimer, resetTimer } = useTimer();

  //generate sudoku board at the beginning
  useEffect(() => {
    if (squaresToRemove === 0) return;

    const newBoard = generateSudokuBoard(squaresToRemove);
    setSudokuBoard(newBoard);

    startTimer();
  }, [squaresToRemove]);

  //stop timer when a dialog window pops up
  useEffect(() => {
    if (showDifficultyDialog || showRestartDialog)
      stopTimer();
  }, [showDifficultyDialog, showRestartDialog]);

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
  }, [handleKeyPress]);

  function fillSquare(selectedSquare, value) {
    if (selectedSquare.row === null || selectedSquare.col === null) return;

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
          setShowRestartDialog={setShowRestartDialog}
          setShowNewGameDialog={setShowNewGameDialog}
          areButtonsDisabled = {areButtonsDisabled}
        />
        <div className='main-space'>
          {showDifficultyDialog && <div className='overlay'>
            <div className='difficulty-dialog'>
              <h2>Choose your difficulty level:</h2>
              <button className='difficulty-button'
                onClick={() => {
                  setSquaresToRemove(40);
                  setShowDifficultyDialog(false);
                  startTimer();
                }}>
                Easy
              </button>
              <button className='difficulty-button'
                onClick={() => {
                  setSquaresToRemove(50);
                  setShowDifficultyDialog(false);
                  startTimer();
                }}>
                Medium
              </button>
              <button className='difficulty-button' onClick={() => {
                setSquaresToRemove(60);
                setShowDifficultyDialog(false);
                startTimer();
              }}>
                Hard
              </button>
              {squaresToRemove > 0 && (
              <button className='back-button' 
              onClick={() => {
                setShowDifficultyDialog(false);
                startTimer();
              }}>
                Back
              </button>
          )}
            </div>
          </div>}
          {showRestartDialog && <div className='overlay'>
            <div className='new-restart-dialog'>
              <h2>Do you want to restart your game?</h2>
              <button className='new-restart-button'
                onClick={() => {
                  const originalBoard = sudokuBoard.map(row => row.map(square => ({
                    ...square,
                    value: square.isOriginal ? square.originalValue : null,
                    originalValue: square.originalValue,
                    isOriginal: square.isOriginal,
                    isHint: square.isHint,
                    isMistake: false
                  }))
                  );
                  setSudokuBoard(originalBoard);
                  setShowRestartDialog(false);
                  resetTimer();
                  startTimer();
                }}>
                Yes
              </button>
              <button className='new-restart-button'
                onClick={() => {
                  setShowRestartDialog(false);
                  startTimer();
                }}>
                No
              </button>
            </div>
          </div>}
          {showNewGameDialog && <div className='overlay'>
            <div className='new-restart-dialog'>
              <h2>Do you want to start a new game?</h2>
              <button className='new-restart-button'
                onClick={() => {
                  const newBoard = generateSudokuBoard(squaresToRemove);
                  setSudokuBoard(newBoard);
                  setShowNewGameDialog(false);
                  resetTimer();
                  startTimer();
                }}>
                Yes
              </button>
              <button className='new-restart-button'
                onClick={() => {
                  setShowNewGameDialog(false);
                  startTimer();
                }}>
                No
              </button>
            </div>
          </div>}
          <SettingsRow
            squaresToRemove={squaresToRemove}
            setSquaresToRemove={setSquaresToRemove}
            time={time}
            setShowDifficultyDialog={setShowDifficultyDialog}
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