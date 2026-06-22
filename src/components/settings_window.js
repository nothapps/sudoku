import { FaLightbulb, FaTriangleExclamation } from "react-icons/fa6";

export default function SettingsWindow({ visible, closeWindow, gameSettings, changeGameSetting, startTimer, resetTimer }) {
    const conflictLevels =
        ['highlight one conflict - button',
            'highlight all conflicts - button',
            'automatically highlight all conflicts']


    if (!visible) return null;

    return (
        <div className='overlay'>
            <div className='settings-window'>
                <div className="title-text">
                    <h2>Settings</h2>
                </div>
                <div className="settings-text">
                    <FaLightbulb className="settings-icons" />
                    Hints:
                    <button className="settings-button"
                        onClick={() => changeGameSetting('isFillHint', !gameSettings.isFillHint)}>
                        {gameSettings.isFillHint ? 'reveal one random square' : 'show subtle hint'}
                    </button>
                </div>
                <div className="settings-text">
                    <FaTriangleExclamation className="settings-icons" />
                    Conflicts:
                    <button className="settings-button"
                        onClick={() => {
                            const nextIndex = (gameSettings.conflictIndex + 1) % conflictLevels.length;
                            changeGameSetting('conflictIndex', nextIndex);
                        }}>
                        {conflictLevels[gameSettings.conflictIndex]}
                    </button>
                </div>
                <div className="settings-text">
                    <input className='settings-checkbox' type='checkbox' defaultChecked={false}>
                    </input>
                    Highlight row and column on square click
                </div>
                <button className='back-button'
                    onClick={() => {
                        closeWindow();
                        startTimer();
                    }}>
                    Back
                </button>

            </div>
        </div >
    );
}