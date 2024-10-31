export class NumberKeypad {
  private selectedNumbers: Set<number> = new Set();
  private callback: (numbers: string) => void;

  constructor(container: HTMLElement, onComplete: (numbers: string) => void) {
    this.callback = onComplete;
    this.render(container);
  }

  private render(container: HTMLElement) {
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    const buttons = numbers.map(n => {
      const btn = document.createElement('button');
      btn.textContent = n.toString();
      btn.onclick = () => this.toggleNumber(n);
      return btn;
    });
    
    const randomBtn = document.createElement('button');
    randomBtn.textContent = '隨機生成';
    randomBtn.onclick = () => this.generateRandom();
    
    container.append(...buttons, randomBtn);
  }

  private toggleNumber(n: number) {
    if (this.selectedNumbers.has(n)) {
      this.selectedNumbers.delete(n);
    } else if (this.selectedNumbers.size < 4) {
      this.selectedNumbers.add(n);
    }

    if (this.selectedNumbers.size === 4) {
      this.callback(Array.from(this.selectedNumbers).join(''));
    }
  }

  private generateRandom() {
    const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
    const result = [];
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * numbers.length);
      result.push(numbers.splice(index, 1)[0]);
    }
    this.callback(result.join(''));
  }
}
