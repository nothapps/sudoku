import { useState } from "react";
import { FaClock, FaPencil, FaFireFlameCurved } from "react-icons/fa6";

export default function SettingsRow() {
    const [isPencilModeOn, setIsPencilModeOn] = useState(false);
    const [sudokuDifficulty, setSudokuDifficulty] = useState('Easy');
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];

    return (
        <div className="settings-row">
            <div className="settings-element">
                <FaClock className="icons" /> {'Timer:'}
                <button className="settings-button">
                    {'11:00:01'}
                </button>
            </div>
            <div className="settings-element">
                <FaPencil className="icons" /> {'Pencil mode:'}
                <button className="settings-button"
                    onClick={() => setIsPencilModeOn(!isPencilModeOn)}>
                    {isPencilModeOn ? 'On' : 'Off'}
                </button>
            </div>
            <div className="settings-element">
                <FaFireFlameCurved className="icons" />
                {'Difficulty:'}
                <button className="settings-button"

                    onClick={() => {
                        setSudokuDifficulty((prev) => {
                            return difficultyLevels[(difficultyLevels.indexOf(prev) + 1) % 3];
                        });
                    }}>
                    {sudokuDifficulty}
                </button>
            </div>
        </div >
    );
}

