import { useState, useEffect } from "react";
import { FaClock, FaPencil, FaFireFlameCurved } from "react-icons/fa6";

export default function SettingsRow({ squaresToRemove, setSquaresToRemove }) {
    const [isPencilModeOn, setIsPencilModeOn] = useState(false);
    const [sudokuDifficulty, setSudokuDifficulty] = useState('?');
    const difficultyLevels = ['Easy', 'Medium', 'Hard'];
    const removedSquares = [45, 55, 64];

    useEffect(() => {
        if (squaresToRemove === 0) return;
        switch (squaresToRemove) {
            case 45:
                setSudokuDifficulty('Easy');
                break;
            case 55:
                setSudokuDifficulty('Medium');
                break;
            case 64:
                setSudokuDifficulty('Hard');
                break;
            default:
                setSudokuDifficulty('?');
                break;
        }
    }, [squaresToRemove]);

    return (
        <div className="settings-row">
            <div className="settings-element">
                <FaClock className="icons" /> {'Timer:'}
                <button className="settings-button"
                    style={{ width: '55px' }}>
                    {'11:00'}
                </button>
            </div>
            <div className="settings-element">
                <FaPencil className="icons" /> {'Pencil mode:'}
                <button className="settings-button"
                    style={{ width: '40px' }}
                    onClick={() => setIsPencilModeOn(!isPencilModeOn)}>
                    {isPencilModeOn ? 'On' : 'Off'}
                </button>
            </div>
            <div className="settings-element">
                <FaFireFlameCurved className="icons" />
                {'Difficulty:'}
                <button className="settings-button"
                    style={{ width: '85px' }}
                    onClick={() => {
                        setSquaresToRemove((prev) => {
                            return removedSquares[(removedSquares.indexOf(prev) + 1) % 3];
                        });
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

