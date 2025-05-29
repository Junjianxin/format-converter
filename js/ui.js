/**
 * 全能格式转换工具 - UI增强
 */

// 语法高亮功能
class SyntaxHighlighter {
    constructor() {
        this.inputText = document.getElementById('inputText');
        this.outputText = document.getElementById('outputText');
        this.currentTool = 'json';
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // 监听工具切换
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                this.currentTool = item.getAttribute('data-tool');
            });
        });
        
        // 监听输出内容变化
        const observer = new MutationObserver(() => {
            this.highlightOutput();
        });
        
        observer.observe(this.outputText, { 
            attributes: true, 
            attributeFilter: ['value'] 
        });
        
        // 监听输入内容变化
        this.inputText.addEventListener('input', () => {
            if (['json', 'html', 'xml', 'sql'].includes(this.currentTool)) {
                this.highlightInput();
            }
        });
    }
    
    highlightInput() {
        // 实现输入框语法高亮
        // 由于浏览器限制，我们不能直接修改textarea内容的样式
        // 这里可以使用一个覆盖层来实现高亮，但为简化实现，这里不做具体实现
        console.log('Input highlighting for', this.currentTool);
    }
    
    highlightOutput() {
        // 实现输出框语法高亮
        // 同样，这里只是占位，实际实现需要更复杂的DOM操作
        console.log('Output highlighting for', this.currentTool);
    }
}

// 动画效果
class AnimationEffects {
    constructor() {
        this.setupButtonAnimations();
        this.setupNotificationAnimations();
    }
    
    setupButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.add('clicked');
                setTimeout(() => {
                    btn.classList.remove('clicked');
                }, 200);
            });
        });
    }
    
    setupNotificationAnimations() {
        // 通知动画在main.js的showNotification函数中已实现
    }
}

// 主题切换增强
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        
        this.setupThemeToggleAnimation();
    }
    
    setupThemeToggleAnimation() {
        this.themeToggle.addEventListener('click', () => {
            // 添加旋转动画
            this.themeToggle.classList.add('rotate');
            setTimeout(() => {
                this.themeToggle.classList.remove('rotate');
            }, 500);
        });
    }
}

// 初始化UI增强功能
document.addEventListener('DOMContentLoaded', () => {
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        /* 按钮点击动画 */
        .btn.clicked {
            transform: scale(0.95);
        }
        
        /* 主题切换按钮旋转动画 */
        .theme-toggle button.rotate {
            animation: rotate-theme 0.5s ease;
        }
        
        @keyframes rotate-theme {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* 工具选项按钮样式 */
        .option-btn {
            padding: 0.4rem 0.8rem;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            background-color: var(--button-bg);
            color: var(--text-color);
            cursor: pointer;
            transition: var(--transition);
        }
        
        .option-btn:hover {
            background-color: var(--button-hover-bg);
        }
        
        .option-btn.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
    `;
    document.head.appendChild(style);
    
    // 初始化UI组件
    const syntaxHighlighter = new SyntaxHighlighter();
    const animationEffects = new AnimationEffects();
    const themeManager = new ThemeManager();
}); 