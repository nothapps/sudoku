import { useState } from "react";
import generateSudokuBoard from "./sudoku_algorithm";
import showHint, {showMistake} from "./sidebar_functions";

export default function Sidebar({ sudokuBoard, setSudokuBoard, squaresToRemove }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className='sidebar'>
            <header> SUDOKU </header>
            <SidebarButton 
            value={'Restart'}
            clickButton={() => {
                    const originalBoard = sudokuBoard.map(row =>
                        row.map(square => ({
                            ...square,
                            value: square.isOriginal ? square.originalValue : null,
                            originalValue: square.originalValue,
                            isOriginal: square.isOriginal,
                            isHint: square.isHint,
                            isMistake: false
                        }))
                    );
                    setSudokuBoard(originalBoard);
                }}
            />
            <SidebarButton 
            value={'New game'}
            clickButton={() => {
                    const newBoard = generateSudokuBoard(squaresToRemove);
                    setSudokuBoard(newBoard);
                }}
            />
            <SidebarButton 
            value={'Show hint'}
            clickButton={() => showHint(sudokuBoard, setSudokuBoard)}
            />
            <SidebarButton 
            value={'Show mistake'}
            clickButton={() => showMistake(sudokuBoard, setSudokuBoard)}
            />
            <SidebarButton 
            value={'Settings'}
            clickButton={() => setIsSettingsOpen(!isSettingsOpen)}
            />
            <div className={`dropdown-settings ${isSettingsOpen ? 'open' : ''}`}>
                <button className='dropdown-button'>
                    Difficulty
                </button>
                <button className='dropdown-button'>
                    Pencil mode
                </button>
                <button className='dropdown-button'>
                    Dark Mode
                </button>
            </div>
        </div>
    );
}

function SidebarButton({ value, clickButton}) {
    return (
        <button className='sidebar-button' 
        onClick={clickButton}>
            {value}
        </button>

    );
}