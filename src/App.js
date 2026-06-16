import './css/main.css';
import './css/sidebar.css';
import './css/sudoku_board.css';
import './css/dialog_windows/difficulty_dialog.css';
import './css/numbers_row.css';
import './css/additional_settings_row.css';
import './css/dialog_windows/new_restart_dialog.css';
import { useCallback, useState, useEffect } from 'react';
import NumbersRow from './components/numbers_row';
import Sidebar from './components/sidebar';
import SudokuBoard from './components/sudoku_board';
import generateSudokuBoard from './utils/sudoku_algorithm';
import AdditionalSettingsRow from './components/additonal_settings_row';
import useTimer from './utils/additional_settings_functions';
import DifficultyDialog, { NewGameDialog, RestartDialog } from './components/dialog_windows';

export default function Sudoku() {
  const [selectedSquare, setSelectedSquare] = useState({ row: null, col: null });
  const [sudokuBoard, setSudokuBoard] = useState(
    Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        originalValue: null,
        pencil_notes: [],
        isOriginal: false,
        isHint: false,
        isMistake: false
      }))
    )
  );
  const [squaresToRemove, setSquaresToRemove] = useState(0);
  const [isPencilModeOn, setIsPencilModeOn] = useState(false);
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
    setSelectedSquare({ row: null, col: null });
  }, [squaresToRemove]);

  //stop timer when a dialog window pops up
  useEffect(() => {
    if (showDifficultyDialog || showRestartDialog || showNewGameDialog)
      stopTimer();
  }, [showDifficultyDialog, showRestartDialog, showNewGameDialog]);

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
      fillSquare(selectedSquare, value, isPencilModeOn);
    } else if (pressedKey === 'Backspace' || pressedKey === 'Delete') {
      fillSquare(selectedSquare, null, isPencilModeOn);
    }
  }, [selectedSquare, isPencilModeOn]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  function fillSquare(selectedSquare, value, isPencilModeOn) {
    if (selectedSquare.row === null || selectedSquare.col === null) return;

    setSudokuBoard(prevBoard => {
      const newBoard = prevBoard.map(row =>
        row.map(square => ({ ...square }))
      );
      const square = newBoard[selectedSquare.row][selectedSquare.col];

      if (isPencilModeOn) {
        if (value === null) {
          square.value = value;
          square.pencil_notes = [];
          square.isMistake = false;
        }
        const pencil_notes = square.pencil_notes || [];
        if (pencil_notes.includes(value)) {
          square.pencil_notes = pencil_notes.filter(note => note !== value);
        } else {
          square.pencil_notes = [...pencil_notes, value];
        }
      }
      else {
        square.value = value;
        square.pencil_notes = [];
        square.isMistake = false;
      }

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
          areButtonsDisabled={areButtonsDisabled}
          setSelectedSquare={setSelectedSquare}
        />
        <div className='main-space'>
          <DifficultyDialog
            visible={showDifficultyDialog}
            squaresToRemove={squaresToRemove}
            setSquaresToRemove={setSquaresToRemove}
            closeDialog={() => setShowDifficultyDialog(false)}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <RestartDialog
            visible={showRestartDialog}
            restartGame={() => {
              const originalBoard = sudokuBoard.map(row => row.map(square => ({
                ...square,
                value: square.isOriginal ? square.originalValue : null,
                originalValue: square.originalValue,
                pencil_notes: [],
                isOriginal: square.isOriginal,
                isHint: square.isHint,
                isMistake: false
              }))
              );
              setSudokuBoard(originalBoard);
            }}
            closeDialog={() => setShowRestartDialog(false)}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <NewGameDialog
            visible={showNewGameDialog}
            generateNewGame={() => {
              const newBoard = generateSudokuBoard(squaresToRemove);
              setSudokuBoard(newBoard);
            }}
            closeDialog={() => setShowNewGameDialog(false)}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <AdditionalSettingsRow
            squaresToRemove={squaresToRemove}
            setSquaresToRemove={setSquaresToRemove}
            time={time}
            setShowDifficultyDialog={setShowDifficultyDialog}
            isPencilModeOn={isPencilModeOn}
            setIsPencilModeOn={setIsPencilModeOn}
          />
          <SudokuBoard
            sudokuBoard={sudokuBoard}
            selectedSquare={selectedSquare}
            selectSquare={selectSquare}
          />
          <NumbersRow
            fillSquare={fillSquare}
            selectedSquare={selectedSquare}
            isPencilModeOn={isPencilModeOn} />
        </div>
      </div>
    </>
  );
}