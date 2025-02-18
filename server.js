const express = require('express');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8080;

// 禁用X-Powered-By头
app.disable('x-powered-by');

// 日志中间件
app.use(morgan('dev'));

// 静态文件服务（修复MIME类型问题）
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',  // 添加缓存控制
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        // 添加安全头
        res.setHeader('X-Content-Type-Options', 'nosniff');
    },
    extensions: ['html', 'htm'], // 自动补全扩展名
    index: ['index.html']        // 明确指定默认文件
}));

// 添加第二个静态资源目录用于访问src目录
app.use('/src', express.static(path.join(__dirname, 'src').replace(/\\/g, '/'), {
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/javascript');
    }
}));

// 添加assets目录的静态资源服务
app.use('/assets', express.static(path.join(__dirname, 'public/assets'), {
    maxAge: '1d',
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'image/png');
    }
}));

// 添加安全头中间件
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

// 通用路由处理
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), {}, (err) => {
        if (err) {
            res.status(404).send('页面未找到');
        }
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('服务器内部错误');
});

app.listen(PORT, () => {
    console.log(`服务运行在 http://localhost:${PORT}`);
}); 