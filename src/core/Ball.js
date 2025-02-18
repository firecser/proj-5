// @ts-check

// 在文件顶部添加JSDoc类型定义
/**
 * @typedef {HTMLImageElement & { isReady: boolean }} CustomImage
 */

export class Ball {
    constructor(canvas, sizeLevel = 5) {
        this.canvas = canvas;
        this.sizeLevel = sizeLevel;
        this.baseSize = Math.min(canvas.width, canvas.height) * 0.08;
        this.radius = this.baseSize * (1 + sizeLevel * 0.2);
        this.x = canvas.width / 2;
        this.y = canvas.height - this.radius - 20;
        this.speedY = 0;
        this.isMoving = false;
        this.mass = 1000 / (this.radius ** 2);
        this.mergeScale = 1;
        this.lastBuoyancyTime = Date.now();
        this.speedX = 0;
        this.isIdle = true;
        
        // 加载气球图片
        this.image = Object.assign(new Image(), { isReady: false });
        this.image.src = `/assets/images/ball-${this.sizeLevel}.png`;
        this.image.onload = () => {
            this.image.isReady = true;
            console.log(`图片加载成功: ball-${this.sizeLevel}.png`);
        };
        this.image.onerror = () => {
            console.error(`图片加载失败: ball-${this.sizeLevel}.png`);
        };

        this.constrainPosition = () => {
            this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));
        };
        this.constrainPosition(); // 初始化位置
        this.constrainPosition(); // 确保初始位置正确
    }

    update() {
        if (this.isMoving) {
            console.log(`Ball[${this.sizeLevel}] 更新前: y=${this.y.toFixed(2)} speedY=${this.speedY.toFixed(2)}`);
            this.speedY -= 0.5;
            this.y += this.speedY;
            this.speedY *= 0.98;
            console.log(`更新后: y=${this.y.toFixed(2)} speedY=${this.speedY.toFixed(2)}`);
            
            if (Math.abs(this.speedY) < 0.1) {
                this.isMoving = false;
                this.speedY = 0;
            }
            
            if (this.y < this.radius) {
                this.y = this.radius;
                this.speedY = Math.abs(this.speedY) * 0.6;
            }
        } else if (this.isIdle) {
            // 待机时保持底部位置
            this.y = this.canvas.height - this.radius - 20;
        }
        this.constrainPosition();
    }

    draw(ctx) {
        // 确保基础图形始终可见
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = '#FF000055'; // 半透明红色作为背景
        ctx.fill();
        
        if (this.image.complete && this.image.naturalHeight !== 0) {
            ctx.drawImage(
                this.image,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
        }
    }

    checkCollisionBelow() {
        // 碰撞检测逻辑...
        return false; // 示例返回值
    }

    constrainPosition() {
        this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));
    }

    resize(canvas) {
        this.canvas = canvas;
        this.baseSize = Math.min(canvas.width, canvas.height) * 0.08;
        this.radius = this.baseSize * (1 + this.sizeLevel * 0.2);
        this.x = canvas.width / 2;
        this.y = canvas.height - this.radius - 20;
        this.constrainPosition();
    }
} 