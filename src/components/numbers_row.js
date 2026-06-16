import { FaEraser } from "react-icons/fa";

export default function NumbersRow({ fillSquare, selectedSquare, isPencilModeOn }) {
    return (
        <div className='numbers-row'>
            {Array(9).fill().map((_, i) => (
                <NumberButton
                    key={`${i}`}
                    value={i + 1}
                    fillSquare={fillSquare}
                    selectedSquare={selectedSquare}
                    isPencilModeOn={isPencilModeOn} />
            ))}
            <NumberButton value={100} fillSquare={fillSquare} selectedSquare={selectedSquare} />
        </div>
    );
}

function NumberButton({ value, fillSquare, selectedSquare, isPencilModeOn }) {
    if (value === 100) {
        return (
            <button className='number-button' onClick={() => fillSquare(selectedSquare, null, isPencilModeOn)}>
                <FaEraser className='icon' />
            </button>
        );
    }

    return (
        <div>
            <button className='number-button' onClick={() => fillSquare(selectedSquare, value, isPencilModeOn)}>
                {value}
            </button>
        </div>
    );
}