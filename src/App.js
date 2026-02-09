import './App.css';
import { useState } from 'react';

export default function Sudoku() {
  const [selectedSquare, setSelectedSquare] = useState({ row: null, col: null });
  const [squareValues, setSquareValues] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));

  const selectSquare = (row, col) => {
    setSelectedSquare(prevSquare =>
      prevSquare.row === row &&
        prevSquare.col === col ?
        { row: null, col: null } : { row, col });
  };

  function fillSquare(selectedSquare, value) {
    setSquareValues(prevSquares => {
      const newSquares = [...prevSquares];
      newSquares[selectedSquare.row] = [...prevSquares[selectedSquare.row]];
      newSquares[selectedSquare.row][selectedSquare.col] = value;
      checkRow(newSquares);
      checkColumn(newSquares);
      checkBlock(newSquares);
      return newSquares;
    })
  }

  function checkRow(squareValues) {
    squareValues.forEach((row, rowIndex) => {
      let duplicateNumbers = row.filter((value, index) => value !== null && row.indexOf(value) !== index);
      if (duplicateNumbers.length > 0) console.log(`row ${rowIndex} duplicates:`, duplicateNumbers);
    }
    )
  }

  function checkColumn(squareValues) {
    for (let i = 0; i < 9; i++) {
      let currentColumn = squareValues.map(row => row[i]);
      let duplicateNumbers = currentColumn.filter((value, index) => value !== null && currentColumn.indexOf(value) !== index);
      if (duplicateNumbers.length > 0) console.log(`column ${i} duplicates:`, duplicateNumbers);
    }
  }

  function checkBlock(squareValues) {
    for (let row = 0; row < 9; row += 3) {
      for (let col = 0; col < 9; col += 3) {
        const threeRows = squareValues.slice(row, row + 3);
        let currentBlock = threeRows.map(row => row.slice(col, col + 3));
        currentBlock = currentBlock[0].concat(currentBlock[1], currentBlock[2]);
        let duplicateNumbers = currentBlock.filter((value, index) => value !== null && currentBlock.indexOf(value) !== index);
        if (duplicateNumbers.length > 0) console.log(`block  duplicates:`, duplicateNumbers);
      }
    }
  }

  return (
    <>
      <div className='sudoku'>
        <Sidebar />
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

function Sidebar() {
  return (
    <div className='sidebar'>
      <header> SUDOKU </header>
      <SidebarButton value='restart' />
      <SidebarButton value='new game' />
      <SidebarButton value='hint' />
      <SidebarButton value='settings' />
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
    </div>
  );
}

function NumberButton({ value, fillSquare, selectedSquare }) {
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
