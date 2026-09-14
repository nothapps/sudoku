import { formatTime } from '../utils/additional_settings_functions';
import { FaClock, FaFireFlameCurved } from "react-icons/fa6";

export default function DifficultyDialog({ visible, squaresToRemove, changeGameSetting, closeDialog, startTimer, resetTimer }) {
  if (!visible) return null;

  const handleClick = (squares) => {
    if (squares === squaresToRemove) {
      closeDialog();
      startTimer();
      return;
    }
    changeGameSetting('squaresToRemove', squares);
    closeDialog();
    resetTimer();
    startTimer();
  };

  return (
    <div className='overlay'>
      <div className='difficulty-dialog'>
        <h2>Choose your difficulty level:</h2>
        <button className='difficulty-button'
          onClick={() => handleClick(40)}>
          Easy
        </button>

        <button className='difficulty-button'
          onClick={() => handleClick(50)}>
          Medium
        </button>

        <button className='difficulty-button'
          onClick={() => handleClick(60)}>
          Hard
        </button>

        {squaresToRemove > 0 && (
          <button className='back-button'
            onClick={() => {
              closeDialog();
              startTimer();
            }}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export function RestartDialog({ visible, restartGame, closeDialog, startTimer, resetTimer }) {
  if (!visible) return null;

  const handleClick = () => {
    restartGame();
    closeDialog();
    resetTimer();
    startTimer();
  };

  return (
    <div className='overlay'>
      <div className='new-restart-dialog'>
        <h2>Do you want to restart your game?</h2>
        <button className='new-restart-button'
          onClick={() => handleClick()}>
          Yes
        </button>
        <button className='new-restart-button'
          onClick={() => {
            closeDialog();
            startTimer();
          }}>
          No
        </button>
      </div>
    </div>
  );
}

export function NewGameDialog({ visible, generateNewGame, closeDialog, startTimer, resetTimer }) {
  if (!visible) return null;

  const handleClick = () => {
    generateNewGame();
    closeDialog();
    resetTimer();
    startTimer();
  };

  return (
    <div className='overlay'>
      <div className='win-dialog'>
        <h2>Do you want to start a new game?</h2>
        <button className='new-restart-button'
          onClick={() => handleClick()}>
          Yes
        </button>
        <button className='new-restart-button'
          onClick={() => {
            closeDialog();
            startTimer();
          }}>
          No
        </button>
      </div>
    </div>
  );
}

export function WinDialog({ visible, closeDialog, time, difficulty,generateNewGame, restartGame }) {
  if (!visible) return null;

  return (
    <div className='overlay'>
      <div className='win-dialog'>
        <h2>You won! 🎉</h2>
        <div className='win-info'>
          <p> ⏱️ <span className='win-smaller-text'>Time: {formatTime(time)}</span> </p>
          <p> 🔥 <span className='win-smaller-text'>Difficulty: {difficulty}</span> </p>
        </div>
        <div>
        <button className='win-button'
          onClick={() => {
            generateNewGame();
            closeDialog();
          }}>
          New game
        </button>
          <button className='win-button'
          onClick={() => {
            restartGame();
            closeDialog();
          }}>
          Restart
        </button>
        <button className='win-button'
          onClick={() => {
            closeDialog();
          }}>
          Close
        </button>
        </div>
      </div>
    </div>
  );
}