import { useState } from "react";
import showHint, { showMistake } from "../utils/sidebar_functions";
import { FaMoon, FaSun, FaCirclePlus, FaLightbulb, FaGear, FaTriangleExclamation, FaArrowRotateLeft } from "react-icons/fa6";

export default function Sidebar({ sudokuBoard, setSudokuBoard, squaresToRemove, setShowRestartDialog, setShowNewGameDialog, areButtonsDisabled, setSelectedSquare }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLightMode, setIsLightMode] = useState(false);

    return (
        <div className='sidebar'>
            <header> SUDOKU </header>
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Restart'}
                areButtonsDisabled={areButtonsDisabled}
                clickButton={() => setShowRestartDialog(true)}
                icon={< FaArrowRotateLeft className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'New game'}
                areButtonsDisabled={areButtonsDisabled}
                clickButton={() => setShowNewGameDialog(true)}
                icon={< FaCirclePlus className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Show hint'}
                areButtonsDisabled={areButtonsDisabled}
                clickButton={() => {
                    setSelectedSquare({ row: null, col: null });
                    showHint(sudokuBoard, setSudokuBoard);
                }}
                icon={< FaLightbulb className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Show conflict'}
                areButtonsDisabled={areButtonsDisabled}
                clickButton={() => {
                    setSelectedSquare({ row: null, col: null });
                    showMistake(sudokuBoard, setSudokuBoard);
                }}
                icon={< FaTriangleExclamation className="sidebar-button-icon" size={20} />}
            />
            <SidebarButton
                squaresToRemove={squaresToRemove}
                value={'Options'}
                areButtonsDisabled={areButtonsDisabled}
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

function SidebarButton({ value, clickButton, squaresToRemove, icon, areButtonsDisabled }) {
    return (
        <button className='sidebar-button'
            title={value}
            disabled={areButtonsDisabled}
            onClick={clickButton}>
            {icon}
            <span className="sidebar-button-text"> {value} </span>
        </button>

    );
}
