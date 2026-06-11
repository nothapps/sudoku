import { useState} from "react";
import { FaClock, FaPencil, FaFireFlameCurved } from "react-icons/fa6";
import { formatTime } from '../utils/additional_settings_functions';

export default function SettingsRow({ squaresToRemove, setSquaresToRemove, time, setShowDifficultyDialog}) {
    const [isPencilModeOn, setIsPencilModeOn] = useState(false);
    const difficultyLevels = new Map([
        [40, 'Easy'],
        [50, 'Medium'],
        [60, 'Hard']
    ]);

    return (
        <div className="settings-row">
            <div className="settings-element">
                <FaClock className="icons" /> {'Timer:'}
                <button className="settings-button">
                    {formatTime(time)}
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
                    onClick={() => setShowDifficultyDialog(true)}>
                    {difficultyLevels.get(squaresToRemove) ?? '?'}
                </button>
            </div>
        </div >
    );
}

