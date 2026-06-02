import { useState } from "react";
import generateSudokuBoard from "../utils/sudoku_algorithm";
import showHint, { showMistake, verifySudoku } from "../utils/sidebar_functions";
import { FaMoon, FaSun, FaCirclePlus, FaLightbulb, FaGear, FaTriangleExclamation, FaArrowRotateLeft } from "react-icons/fa6";
import { VscDebugRestart } from "react-icons/vsc";
import { GoGear } from "react-icons/go";

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
                }}
                icon={< FaArrowRotateLeft className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'New game'}
                clickButton={() => {
                    const newBoard = generateSudokuBoard(squaresToRemove);
                    setSudokuBoard(newBoard);
                }}
                icon={< FaCirclePlus className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Show hint'}
                clickButton={() => showHint(sudokuBoard, setSudokuBoard)}
                icon={< FaLightbulb className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Show conflict'}
                clickButton={() => showMistake(sudokuBoard, setSudokuBoard)}
                icon={< FaTriangleExclamation className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Options'}
                clickButton={() => showHint(sudokuBoard, setSudokuBoard)}
                icon={< FaGear className="sidebar-button-icon" size={20} />}
            />
            <div className="theme-icon"
                onClick={() => setIsLightMode(!isLightMode)}>
                {isLightMode ? <FaSun /> : <FaMoon />}
            </div>
        </div>
    );
}

function SidebarButton({ value, clickButton, squaresToRemove, icon }) {
    const isDisabled = squaresToRemove === 0 ? true : false;
    return (
        <button className='sidebar-button'
            disabled={isDisabled}
            onClick={clickButton}>
            {icon}
            <span className="sidebar-button-text"> {value} </span>
        </button>

    );
}
