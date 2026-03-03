import './css/main.css';
import './css/sudoku-board.css';
import './css/settings-dialog.css';
import { useCallback, useState, useEffect } from 'react';
import { FaEraser } from "react-icons/fa";
import generateSudokuBoard, { isMoveValid, isSquareEmpty} from './components/sudoku_algorithm.js';

export default function Sudoku() {
  const [selectedSquare, setSelectedSquare] = useState({ row: null, col: null });
  const [squareValues, setSquareValues] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [originalBoard, setOriginalBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [hintSquares, setHintSquares] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));

  useEffect(() => {
    const [newBoard, removedSquares] = generateSudokuBoard();
    setSquareValues(newBoard);
    setOriginalBoard(newBoard);
    setHintSquares(removedSquares);
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
        <Sidebar setSquareValues={setSquareValues}
        setHintSquares={setHintSquares} 
        setOriginalBoard={setOriginalBoard}  
        originalBoard={originalBoard}
        hintSquares={hintSquares}
        squareValues={squareValues}
        />
        <div className='main-space'>
          <SudokuBoard
            selectedSquare={selectedSquare}
            squareValues={squareValues}
            selectSquare={selectSquare}
            originalBoard={originalBoard}
            hintSquares={hintSquares}
          />
          <NumbersRow fillSquare={fillSquare} selectedSquare={selectedSquare} />
        </div>
      </div>

    </>

  );
}

function showHint(squareValues, hintSquares) {
  //check if any are wrong in a full board
  if(isSquareEmpty(squareValues)[0] === null) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (isMoveValid(squareValues, i, j, squareValues[i][j]) === false) {
               console.log('hehe');
            }
        }
    }
  } else { //fill one square
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (hintSquares[i][j] !== null) {
              squareValues[i][j] = hintSquares[i][j];
              return;
            }
        }
    }
  }
}

function Sidebar({ setSquareValues, setHintSquares, setOriginalBoard, originalBoard, squareValues, hintSquares}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className='sidebar'>
      <header> SUDOKU </header>
      <button onClick={() => setSquareValues(originalBoard)}>
        {'restart'}
      </button>
      <button onClick={() => {
        const [newBoard, removedSquares] = generateSudokuBoard();
        setSquareValues(newBoard);
        setOriginalBoard(newBoard);
        setHintSquares(removedSquares);
      }}>
        {'new game'}
      </button>
      <button onClick={() => showHint(squareValues, hintSquares)}>
        {'hint'}
      </button>
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

function SudokuBoard({ selectedSquare, squareValues, selectSquare, originalBoard, hintSquares}) {
  return (
    <div className='sudoku-board'>
      {Array(9).fill().map((_, row) => (
        <div className='sudoku-row' key={row}>
          {Array(9).fill().map((_, col) => {
            if (originalBoard[row][col] !== null) {
              return (
              <UntouchableSquare key={`${row}-${col}`} value={squareValues[row][col]}
          />
            )
            } else if (squareValues[row][col] === hintSquares[row][col]){
              return (
              <NormalSquare key={`${row}-${col}`} value={squareValues[row][col]}
                isSquareClicked={selectedSquare.row === row && selectedSquare.col === col}
                isHint={true}
                onSquareClick={() => selectSquare(row, col)} />
            )
            } else {
               return (
              <NormalSquare key={`${row}-${col}`} value={squareValues[row][col]}
                isSquareClicked={selectedSquare.row === row && selectedSquare.col === col}
                onSquareClick={() => selectSquare(row, col)} />
            )
            }
          })}
        </div>
      ))}
    </div>
  );
}

function UntouchableSquare({value}) {
   return (
   <button className={'sudoku-square untouchable'}>
      {value}
    </button>
    );
}

function NormalSquare({ value, isSquareClicked, isHint, onSquareClick }) {
  return (
    <button className={`sudoku-square ${isSquareClicked ? 'active' : ''} ${isHint ? 'hint' : ''}`}
      onClick={onSquareClick}>
      {value}
    </button>
  );
}
