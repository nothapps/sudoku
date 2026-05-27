import { useState, useEffect } from "react";
import { FaClock, FaPencil, FaFireFlameCurved } from "react-icons/fa6";
import { formatTime } from '../utils/settings_functions';

export default function SettingsRow({ squaresToRemove, setSquaresToRemove, time }) {
    const [isPencilModeOn, setIsPencilModeOn] = useState(false);
    const removedSquares = [45, 55, 64];
    const difficultyLevels = new Map([
        [45, 'Easy'],
        [55, 'Medium'],
        [64, 'Hard']
    ]);

    return (
        <div className="settings-row">
            <div className="settings-element">
                <FaClock className="icons" /> {'Timer:'}
                <button className="settings-button"
                    style={{ width: '60px' }}>
                    {formatTime(time)}
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
                            const currentIndex = removedSquares.indexOf(prev);
                            const newIndex = currentIndex === -1 ? 0 : currentIndex;
                            return removedSquares[(newIndex + 1) % removedSquares.length];
                        });

                    }}>
                    {difficultyLevels.get(squaresToRemove) ?? '?'}
                </button>
            </div>
        </div >
    );
}

