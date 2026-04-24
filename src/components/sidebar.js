import { useState } from "react";
import generateSudokuBoard from "../utils/sudoku_algorithm";
import showHint, { showMistake } from "../utils/sidebar_functions";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function Sidebar({ sudokuBoard, setSudokuBoard, squaresToRemove }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);

    return (
        <div className='sidebar'>
            <header> SUDOKU </header>
            <SidebarButton
                squaresToRemove={squaresToRemove}
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
                squaresToRemove={squaresToRemove}
                value={'New game'}
                clickButton={() => {
                    const newBoard = generateSudokuBoard(squaresToRemove);
                    setSudokuBoard(newBoard);
                }}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Verify sudoku'}
                clickButton={() => showHint(sudokuBoard, setSudokuBoard)}
            />
            <div className="wide-screen-buttons">
                <SidebarButton
                    squaresToRemove={squaresToRemove}
                    value={'Show hint'}
                    clickButton={() => showHint(sudokuBoard, setSudokuBoard)}
                />
                <SidebarButton
                    squaresToRemove={squaresToRemove}
                    value={'Show mistake'}
                    clickButton={() => showMistake(sudokuBoard, setSudokuBoard)}
                />
            </div>
            <div className="small-screen-buttons">
                <SidebarButton
                    squaresToRemove={squaresToRemove}
                    value={'More'}
                    clickButton={() => setIsSettingsOpen(!isSettingsOpen)}
                />
            </div>
            <div className={`dropdown-settings ${isSettingsOpen ? 'open' : ''}`}>
                <DropdownButton
                    value={'Show hint'}
                    clickButton={() => showHint(sudokuBoard, setSudokuBoard)}
                />
                <DropdownButton
                    value={'Show mistake'}
                    clickButton={() => showMistake(sudokuBoard, setSudokuBoard)}
                />
            </div>
            <div className="theme-icon"
                onClick={() => setIsLightMode(!isLightMode)}>
                {isLightMode ? <FaSun /> : <FaMoon />}
            </div>
        </div>
    );
}

function SidebarButton({ value, clickButton, squaresToRemove }) {
    const isDisabled = squaresToRemove === 0 ? true : false;
    return (
        <button className='sidebar-button'
            disabled={isDisabled}
            onClick={clickButton}>
            {value}
        </button>

    );
}

function DropdownButton({ value, clickButton }) {
    return (
        <button className='dropdown-button'
            onClick={clickButton}>
            {value}
        </button>

    );
}