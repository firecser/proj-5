export class MergeSystem {
    static checkMerges(balls) {
        for (let i = balls.length - 1; i >= 0; i--) {
            for (let j = balls.length - 1; j > i; j--) {
                const b1 = balls[i];
                const b2 = balls[j];
                
                if (b1.sizeLevel === b2.sizeLevel) {
                    const dx = b1.x - b2.x;
                    const dy = b1.y - b2.y;
                    const distance = Math.sqrt(dx*dx + dy*dy);
                    const threshold = (b1.radius + b2.radius) * 1.02;

                    if (distance < threshold) {
                        return { b1, b2 };
                    }
                }
            }
        }
        return null;
    }

    static performMerge(b1, b2, canvas) {
        const newLevel = b1.sizeLevel + 1;
        const newBall = new Ball(canvas, newLevel);
        
        newBall.x = (b1.x * b1.mass + b2.x * b2.mass) / (b1.mass + b2.mass);
        newBall.y = (b1.y + b2.y) / 2 - newBall.radius * 0.5;
        newBall.isMoving = true;

        return newBall;
    }

    static animateMerge(ctx, ball) {
        // 合并动画逻辑...
    }
} 