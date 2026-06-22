import { FaClock, FaPencil, FaFireFlameCurved } from "react-icons/fa6";
import { formatTime } from '../utils/additional_settings_functions';

export default function AdditionalSettingsRow({ squaresToRemove, gameSettings, changeGameSetting, openDifficultyDialog, time }) {
    const difficultyLevels = new Map([
        [40, 'Easy'],
        [50, 'Medium'],
        [60, 'Hard']
    ]);

    return (
        <div className="add-settings-row">
            <div className="add-settings-element">
                <FaClock className="settings-icons" /> {'Timer:'}
                <button className="add-settings-button">
                    {formatTime(time)}
                </button>
            </div>
            <div className="add-settings-element">
                <FaPencil className="settings-icons" /> {'Pencil mode:'}
                <button className="add-settings-button"
                    onClick={() => changeGameSetting('isPencilModeOn', !gameSettings.isPencilModeOn)}>
                    {gameSettings.isPencilModeOn ? 'On' : 'Off'}
                </button>
            </div>
            <div className="add-settings-element">
                <FaFireFlameCurved className="settings-icons" />
                {'Difficulty:'}
                <button className="add-settings-button"
                    onClick={() => openDifficultyDialog('difficulty')}>
                    {difficultyLevels.get(squaresToRemove) ?? '?'}
                </button>
            </div>
        </div >
    );
}

