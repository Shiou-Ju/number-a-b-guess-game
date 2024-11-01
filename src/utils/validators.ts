export const numberRegex = /^[1-9]{4}$/;

export const validateNumber = (number: string): boolean => {
  return numberRegex.test(number) && new Set(number).size === 4;
};

export const validateGuess = validateNumber; // 因為目前驗證邏輯相同
