import React from 'react';
import './NumberPad.scss';

interface NumberPadProps {
  selectedNumbers: string[];
  onNumberSelect: (number: string) => void;
  onClear: () => void;
  onRandom: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export const NumberPad = ({
  selectedNumbers,
  onNumberSelect,
  onClear,
  onRandom,
  onConfirm,
  disabled = false
}: NumberPadProps): React.ReactElement => {
  const numbers = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
  
  const isNumberDisabled = (num: string) => 
    disabled || selectedNumbers.includes(num) || selectedNumbers.length >= 4;

  return (
    <div className="number-pad">
      <div className="selected-numbers">
        已選擇：{selectedNumbers.join('') || '未設定'}
      </div>
      <div className="number-grid">
        {numbers.map(num => (
          <button
            key={num}
            onClick={() => onNumberSelect(num)}
            disabled={isNumberDisabled(num)}
            className="number-button"
          >
            {num}
          </button>
        ))}
      </div>
      <div className="control-buttons">
        <button onClick={onClear} disabled={disabled}>
          清除
        </button>
        <button onClick={onRandom} disabled={disabled}>
          隨機
        </button>
        <button 
          onClick={onConfirm} 
          disabled={disabled || selectedNumbers.length !== 4}
        >
          確定
        </button>
      </div>
    </div>
  );
};
