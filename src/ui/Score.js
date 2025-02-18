export class ScoreSystem {
    constructor() {
        this.score = 0;
        this.element = document.getElementById('score');
    }

    add(points) {
        this.score += points;
        this.element.textContent = `得分: ${this.score}`;
    }

    reset() {
        this.score = 0;
        this.element.textContent = `得分: 0`;
    }
} 