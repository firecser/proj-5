import { CONFIG } from '../config.js'; // 确保导入CONFIG
import { Ball } from './Ball.js'; // 确保导入Ball类

export class PhysicsSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.GRID_SIZE = 150;
        this.GRAVITY_DECAY = 0.2;
        this.BUOYANCY = 1.2;
        this.spatialGrid = new Map();
        this.failureTimer = null; // 新增计时器
        this.baseGravity = 0.5 * (canvas.height / 1000);
    }

    getGridKey(x, y) {
        return `${Math.floor(x/this.GRID_SIZE)},${Math.floor(y/this.GRID_SIZE)}`;
    }

    detectCollisions(balls) {
        const collisions = [];
        const spatialGrid = new Map();
        
        // 空间网格划分
        balls.forEach((ball, index) => {
            const gridX = Math.floor(ball.x / this.GRID_SIZE);
            const gridY = Math.floor(ball.y / this.GRID_SIZE);
            const key = `${gridX},${gridY}`;
            if (!spatialGrid.has(key)) spatialGrid.set(key, []);
            spatialGrid.get(key).push(index);
        });

        // 相邻网格检测
        spatialGrid.forEach((indices, key) => {
            const [gx, gy] = key.split(',').map(Number);
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const neighborKey = `${gx+dx},${gy+dy}`;
                    if (spatialGrid.has(neighborKey)) {
                        indices.forEach(i => {
                            spatialGrid.get(neighborKey).forEach(j => {
                                if (i >= j) return;
                                const b1 = balls[i];
                                const b2 = balls[j];
                                const dx = b2.x - b1.x;
                                const dy = b2.y - b1.y;
                                const distance = Math.sqrt(dx*dx + dy*dy);
                                const minDist = b1.radius + b2.radius + 2;
                                
                                if (distance < minDist) {
                                    collisions.push({ b1, b2, dx, dy, distance });
                                }
                            });
                        });
                    }
                }
            }
        });
        return collisions;
    }

    resolveCollisions(collisions) {
        collisions.forEach(({ b1, b2, dx, dy, distance }) => {
            const overlap = (b1.radius + b2.radius + 2 - distance) * 1.2;
            const nx = dx / distance;
            const ny = dy / distance;
            
            const totalMass = b1.mass + b2.mass;
            b1.x -= nx * overlap * (b2.mass / totalMass);
            b1.y -= ny * overlap * (b2.mass / totalMass);
            b2.x += nx * overlap * (b1.mass / totalMass);
            b2.y += ny * overlap * (b1.mass / totalMass);
            
            b1.constrainPosition();
            b2.constrainPosition();
        });
    }

    checkGameOver(balls, warningLineY) {
        // 只检查已发射的气球
        const activeBalls = balls.filter(ball => ball.isMoving);
        const anyBelow = activeBalls.some(ball => ball.y + ball.radius > warningLineY);
        
        if (anyBelow) {
            if (!this.failureTimer) {
                this.failureTimer = setTimeout(() => {
                    console.log("游戏失败");
                    // 触发游戏失败逻辑
                }, 3000); // 设置为3秒
            }
        } else {
            clearTimeout(this.failureTimer); // 如果气球不在红线下方，清除计时器
            this.failureTimer = null; // 重置计时器
        }
    }

    update(balls) {
        balls.forEach(ball => {
            if (ball.isMoving) {
                ball.update();
            }
        });
    }

    updateGravity(canvas) {
        this.gravity = this.baseGravity * (canvas.height / 1000);
    }
} 