import './css/main.css';
import './css/sidebar.css';
import './css/sudoku_board.css';
import './css/dialog_windows/difficulty_dialog.css';
import './css/numbers_row.css';
import './css/additional_settings_row.css';
import './css/dialog_windows/new_restart_dialog.css';
import './css/settings_window.css';
import { useCallback, useState, useEffect } from 'react';
import NumbersRow from './components/numbers_row';
import Sidebar from './components/sidebar';
import SudokuBoard from './components/sudoku_board';
import generateSudokuBoard from './utils/sudoku_algorithm';
import AdditionalSettingsRow from './components/additonal_settings_row';
import useTimer from './utils/additional_settings_functions';
import DifficultyDialog, { NewGameDialog, RestartDialog } from './components/dialog_windows';
import SettingsWindow from './components/settings_window';

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
        isConflict: false
      }))
    )
  );
  const [activeOverlays, setActiveOverlays] = useState({
    difficulty: true,
    restart: false,
    newGame: false,
    settings: false,
  });
  const areButtonsDisabled = Object.values(activeOverlays).some(Boolean);
  const [gameSettings, setGameSettings] = useState({
    squaresToRemove: 0,
    isPencilModeOn: false,
    conflictIndex: 0,
    isFillHint: false,
  });
  const { time, startTimer, stopTimer, resetTimer } = useTimer();

  //generate sudoku board at the beginning
  useEffect(() => {
    if (gameSettings.squaresToRemove === 0) return;

    const newBoard = generateSudokuBoard(gameSettings.squaresToRemove);
    setSudokuBoard(newBoard);

    startTimer();
    setSelectedSquare({ row: null, col: null });
  }, [gameSettings.squaresToRemove]);

  //stop timer when a dialog window pops up
  useEffect(() => {
    if (Object.values(activeOverlays).some(Boolean))
      stopTimer();
  }, [activeOverlays]);

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
      fillSquare(selectedSquare, value, gameSettings.isPencilModeOn);
    } else if (pressedKey === 'Backspace' || pressedKey === 'Delete') {
      fillSquare(selectedSquare, null, gameSettings.isPencilModeOn);
    }
  }, [selectedSquare, gameSettings.isPencilModeOn]);

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
          square.isConflict = false;
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
        square.isConflict = false;
      }

      return newBoard;
    });
  }

  const changeGameSetting = (setting, value) => {
    setGameSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const toggleOverlay = (window) => {
    setActiveOverlays((prev) => ({
      ...prev,
      [window]: !prev[window]
    }));
  };

  return (
    <>
      <div className='sudoku'>
        <Sidebar
          sudokuBoard={sudokuBoard}
          setSudokuBoard={setSudokuBoard}
          squaresToRemove={gameSettings.squaresToRemove}
          toggleOverlay={toggleOverlay}
          areButtonsDisabled={areButtonsDisabled}
          setSelectedSquare={setSelectedSquare}
        />
        <div className='main-space'>
          <DifficultyDialog
            visible={activeOverlays.difficulty}
            squaresToRemove={gameSettings.squaresToRemove}
            changeGameSetting={changeGameSetting}
            closeDialog={() => toggleOverlay('difficulty')}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <RestartDialog
            visible={activeOverlays.restart}
            restartGame={() => {
              const originalBoard = sudokuBoard.map(row => row.map(square => ({
                ...square,
                value: square.isOriginal ? square.originalValue : null,
                originalValue: square.originalValue,
                pencil_notes: [],
                isOriginal: square.isOriginal,
                isHint: square.isHint,
                isConflict: false
              }))
              );
              setSudokuBoard(originalBoard);
            }}
            closeDialog={() => toggleOverlay('restart')}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <NewGameDialog
            visible={activeOverlays.newGame}
            generateNewGame={() => {
              const newBoard = generateSudokuBoard(gameSettings.squaresToRemove);
              setSudokuBoard(newBoard);
            }}
            closeDialog={() => toggleOverlay('newGame')}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <SettingsWindow
            visible={activeOverlays.settings}
            closeWindow={() => toggleOverlay('settings')}
            gameSettings={gameSettings}
            changeGameSetting={changeGameSetting}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />
          <AdditionalSettingsRow
            squaresToRemove={gameSettings.squaresToRemove}
            gameSettings={gameSettings}
            changeGameSetting={changeGameSetting}
            openDifficultyDialog={() => toggleOverlay('difficulty')}
            time={time}
          />
          <SudokuBoard
            sudokuBoard={sudokuBoard}
            selectedSquare={selectedSquare}
            selectSquare={selectSquare}
          />
          <NumbersRow
            fillSquare={fillSquare}
            selectedSquare={selectedSquare}
            isPencilModeOn={gameSettings.isPencilModeOn} />
        </div>
      </div>
    </>
  );
}