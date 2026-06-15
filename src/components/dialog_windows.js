export default function DifficultyDialog({ visible, squaresToRemove, setSquaresToRemove, closeDialog, startTimer, resetTimer}) {
  if (!visible) return null;

  const handleClick = (squares) => {
    if (squares === squaresToRemove) {
        closeDialog();
        startTimer();
        return;
    }
    setSquaresToRemove(squares);
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

export function RestartDialog({ visible, restartGame, closeDialog, startTimer, resetTimer}) {
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

export function NewGameDialog({ visible, generateNewGame, closeDialog, startTimer, resetTimer}) {
  if (!visible) return null;

  const handleClick = () => {
    generateNewGame();
    closeDialog();
    resetTimer();
    startTimer();
  };

  return (
    <div className='overlay'>
      <div className='new-restart-dialog'>
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