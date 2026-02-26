import './css/main.css';
import './css/sudoku-board.css';
import './css/settings-dialog.css';
import { useCallback, useState, useEffect } from 'react';
import { FaEraser } from "react-icons/fa";
import generateSudokuBoard, { solveSudoku } from './components/sudoku_algorithm.js';

export default function Sudoku() {
  const [selectedSquare, setSelectedSquare] = useState({ row: null, col: null });
  const [squareValues, setSquareValues] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));

  useEffect(() => {
    const newBoard = generateSudokuBoard();
    setSquareValues(newBoard);
  }, []);

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
    setSquareValues(prevSquares => {
      const newSquares = [...prevSquares];
      newSquares[selectedSquare.row] = [...prevSquares[selectedSquare.row]];
      newSquares[selectedSquare.row][selectedSquare.col] = value;
      return newSquares;
    })
  }

  return (
    <>
      <div className='sudoku'>
        <Sidebar setSquareValues={setSquareValues} />
        <div className='main-space'>
          <SudokuBoard
            selectedSquare={selectedSquare}
            squareValues={squareValues}
            selectSquare={selectSquare}
          />
          <NumbersRow fillSquare={fillSquare} selectedSquare={selectedSquare} />
        </div>
      </div>

    </>

  );
}

function Sidebar({ setSquareValues }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className='sidebar'>
      <header> SUDOKU </header>
      <SidebarButton value='restart' />
      <button onClick={() => {
        const newBoard = generateSudokuBoard();
        setSquareValues(newBoard);
      }}>
        {'new game'}
      </button>
      <SidebarButton value='hint' />
      <div>
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
      </div>
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

function NumbersRow({ fillSquare, selectedSquare }) {
  return (
    <div className='numbers-row'>
      {Array(9).fill().map((_, i) => (
        <NumberButton
          key={`${i}`}
          value={i + 1}
          fillSquare={fillSquare}
          selectedSquare={selectedSquare} />
      ))}
      <NumberButton value={100} fillSquare={fillSquare} selectedSquare={selectedSquare} />
    </div>
  );
}

function NumberButton({ value, fillSquare, selectedSquare }) {
  if (value === 100) {
    return (
      <button className='number-button' onClick={() => fillSquare(selectedSquare, null)}>
        <FaEraser />
      </button>
    );
  }

  return (
    <div>
      <button className='number-button' onClick={() => fillSquare(selectedSquare, value)}>
        {value}
      </button>
    </div>
  );
}

function SudokuBoard({ selectedSquare, squareValues, selectSquare }) {
  return (
    <div className='sudoku-board'>
      {Array(9).fill().map((_, row) => (
        <div className='sudoku-row' key={row}>
          {Array(9).fill().map((_, col) => {
            return (
              <Square key={`${row}-${col}`} value={squareValues[row][col]}
                isSquareClicked={selectedSquare.row === row && selectedSquare.col === col}
                onSquareClick={() => selectSquare(row, col)} />
            )
          })}
        </div>
      ))}
    </div>
  );
}

function Square({ value, isSquareClicked, onSquareClick }) {
  return (
    <button className={`sudoku-square ${isSquareClicked ? 'active' : ''}`}
      onClick={onSquareClick}>
      {value}
    </button>
  );
}
