export class GameState {
  private secretNumber: string;
  private attempts: number;

  constructor() {
    this.secretNumber = this.generateSecretNumber();
    this.attempts = 0;
  }

  private generateSecretNumber(): string {
    const numbers = Array.from({ length: 10 }, (_, i) => i);
    const result: number[] = [];

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      result.push(numbers[randomIndex]);
      numbers.splice(randomIndex, 1);
    }

    return result.join("");
  }

  getSecretNumber(): string {
    return this.secretNumber;
  }

  checkGuess(guess: string): string {
    this.attempts++;
    let a = 0,
      b = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === this.secretNumber[i]) {
        a++;
      } else if (this.secretNumber.includes(guess[i])) {
        b++;
      }
    }

    return `${a}A${b}B`;
  }
}
