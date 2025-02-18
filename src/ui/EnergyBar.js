export class EnergyBar {
    constructor() {
        this.bar = document.getElementById('energyFill');
        this.levels = [5, 7, 9, 11, 13]; // 对应能量阶段
    }

    update(currentLevel) {
        const targetLevel = this.levels.findIndex(l => currentLevel < l) + 1;
        const progress = Math.min(100, (targetLevel / this.levels.length) * 100);
        this.bar.style.width = `${progress}%`;
        
        // 动态颜色变化
        const hue = 240 - (progress * 2.4);
        this.bar.style.background = `linear-gradient(90deg, 
            hsl(${hue}, 100%, 50%) 0%, 
            hsl(${hue - 30}, 100%, 60%) 100%)`;
    }
} 