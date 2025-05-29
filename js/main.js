/**
 * 全能格式转换工具 - 主脚本
 */

// 应用状态
const appState = {
    currentTool: 'json',
    history: [],
    theme: 'light-theme'
};

// DOM元素
const elements = {
    themeToggle: document.getElementById('themeToggle'),
    navItems: document.querySelectorAll('.nav-item'),
    currentToolTitle: document.getElementById('currentToolTitle'),
    toolOptions: document.getElementById('toolOptions'),
    inputText: document.getElementById('inputText'),
    outputText: document.getElementById('outputText'),
    convertBtn: document.getElementById('convertBtn'),
    clearBtn: document.getElementById('clearBtn'),
    copyBtn: document.getElementById('copyBtn'),
    inputStats: document.getElementById('inputStats'),
    outputStats: document.getElementById('outputStats'),
    historyList: document.getElementById('historyList'),
    notification: document.getElementById('notification'),
    fileDropArea: document.getElementById('fileDropArea'),
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    sidebar: document.getElementById('sidebar')
};

// 初始化应用
function initApp() {
    loadThemePreference();
    setupEventListeners();
    updateToolOptions();
    
    // 默认加载JSON格式化工具
    changeTool('json');
}

// 设置事件监听器
function setupEventListeners() {
    // 主题切换
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // 导航菜单点击
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.getAttribute('data-tool');
            changeTool(tool);
        });
    });
    
    // 按钮操作
    elements.convertBtn.addEventListener('click', handleConvert);
    elements.clearBtn.addEventListener('click', clearContent);
    elements.copyBtn.addEventListener('click', copyOutput);
    
    // 输入框事件
    elements.inputText.addEventListener('input', () => {
        updateInputStats();
    });
    
    // 文件拖放功能
    setupFileDrop();
}

// 切换工具
function changeTool(tool) {
    // 更新导航菜单激活状态
    elements.navItems.forEach(item => {
        if (item.getAttribute('data-tool') === tool) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 更新当前工具状态
    appState.currentTool = tool;
    elements.currentToolTitle.textContent = getToolTitle(tool);
    
    // 更新工具特定选项
    updateToolOptions();
    // 切换工具时自动清空输入输出内容
    clearContent();
    updateOutputPanelDisplay();
    // 如果不是base64img，清空图片预览内容
    if (tool !== 'base64img') {
        let container = document.getElementById('base64imgPreview');
        if (container) container.innerHTML = '';
    }
}

// 获取工具标题
function getToolTitle(tool) {
    const titles = {
        'json': 'JSON格式化',
        'html': 'HTML格式化',
        'xml': 'XML格式化',
        'base64': 'Base64编解码',
        'base64img': 'Base64转图片',
        'url': 'URL编解码',
        'timestamp': '时间戳转换',
        'csv': 'CSV转JSON',
        'sql': 'SQL格式化',
        'jsmin': 'JS压缩',
        'md5': 'MD5加密'
    };
    return titles[tool] || '格式转换';
}

// 更新工具特定选项
function updateToolOptions() {
    elements.toolOptions.innerHTML = '';
    
    switch (appState.currentTool) {
        case 'json':
            elements.toolOptions.innerHTML = `
                <button id="formatBtn" class="option-btn active">格式化</button>
                <button id="compressBtn" class="option-btn">压缩</button>
            `;
            document.getElementById('formatBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            document.getElementById('compressBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            break;
            
        case 'html':
        case 'xml':
            elements.toolOptions.innerHTML = `
                <button id="formatBtn" class="option-btn active">格式化</button>
                <button id="compressBtn" class="option-btn">压缩</button>
            `;
            document.getElementById('formatBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            document.getElementById('compressBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            break;
            
        case 'base64':
            elements.toolOptions.innerHTML = `
                <button id="encodeBtn" class="option-btn active">编码</button>
                <button id="decodeBtn" class="option-btn">解码</button>
                <button id="fileBtn" class="option-btn">文件</button>
            `;
            document.getElementById('encodeBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            document.getElementById('decodeBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            document.getElementById('fileBtn').addEventListener('click', () => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.onchange = handleFileSelect;
                fileInput.click();
            });
            break;
            
        case 'base64img':
            elements.toolOptions.innerHTML = '';
            break;
            
        case 'url':
            elements.toolOptions.innerHTML = `
                <button id="encodeBtn" class="option-btn active">编码</button>
                <button id="decodeBtn" class="option-btn">解码</button>
            `;
            document.getElementById('encodeBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            document.getElementById('decodeBtn').addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
            });
            break;
            
        case 'timestamp':
            elements.toolOptions.innerHTML = `
                <button id="toDateBtn" class="option-btn active">时间戳转日期</button>
                <button id="toTimestampBtn" class="option-btn">日期转时间戳</button>
                <select id="timestampType">
                    <option value="ms">毫秒</option>
                    <option value="s">秒</option>
                </select>
            `;
            const toDateBtn = document.getElementById('toDateBtn');
            const toTimestampBtn = document.getElementById('toTimestampBtn');
            const timestampType = document.getElementById('timestampType');
            // 默认禁用下拉框
            timestampType.disabled = true;
            toDateBtn.addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
                timestampType.disabled = true;
            });
            toTimestampBtn.addEventListener('click', (e) => {
                toggleOptionButtons(e.target);
                timestampType.disabled = false;
            });
            timestampType.addEventListener('change', () => {
                // 不再自动转换
            });
            break;
            
        case 'csv':
            elements.toolOptions.innerHTML = `
                <select id="csvDelimiter">
                    <option value=",">逗号 (,)</option>
                    <option value=";">分号 (;)</option>
                    <option value="\t">制表符 (Tab)</option>
                </select>
                <label><input type="checkbox" id="csvHeader" checked> 包含表头</label>
            `;
            document.getElementById('csvDelimiter').addEventListener('change', () => {
                // 不再自动转换
            });
            document.getElementById('csvHeader').addEventListener('change', () => {
                // 不再自动转换
            });
            break;
            
        case 'sql':
            elements.toolOptions.innerHTML = `
                <select id="sqlDialect">
                    <option value="standard">标准 SQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                </select>
            `;
            document.getElementById('sqlDialect').addEventListener('change', () => {
                // 不再自动转换
            });
            break;
            
        case 'jsmin':
            elements.toolOptions.innerHTML = '';
            break;
            
        case 'md5':
            elements.toolOptions.innerHTML = '';
            break;
    }
    
    // 更新输入框占位符
    updatePlaceholder();
}

// 更新输入框占位符
function updatePlaceholder() {
    const placeholders = {
        'json': '请输入JSON数据...',
        'html': '请输入HTML代码...',
        'xml': '请输入XML数据...',
        'base64': '请输入要编码/解码的文本...',
        'base64img': '请输入图片Base64字符串（支持data:image/png;base64,...或纯base64）...',
        'url': '请输入要编码/解码的URL...',
        'timestamp': '请输入时间戳或日期...',
        'csv': '请输入CSV数据...',
        'sql': '请输入SQL查询...',
        'jsmin': '请输入需要压缩的JS代码...',
        'md5': '请输入需要加密的内容...'
    };
    elements.inputText.placeholder = placeholders[appState.currentTool] || '请在此输入内容...';
}

// 切换选项按钮状态
function toggleOptionButtons(clickedButton) {
    const buttons = clickedButton.parentElement.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// 处理转换操作
function handleConvert() {
    const input = elements.inputText.value.trim();
    if (!input) {
        elements.outputText.value = '';
        updateOutputStats();
        // base64img 清空图片
        if(appState.currentTool === 'base64img') {
            showBase64Image('');
        }
        return;
    }
    try {
        let result = '';
        switch (appState.currentTool) {
            case 'json':
                result = handleJsonConversion(input);
                break;
            case 'html':
                result = handleHtmlConversion(input);
                break;
            case 'xml':
                result = handleXmlConversion(input);
                break;
            case 'base64':
                result = handleBase64Conversion(input);
                break;
            case 'base64img':
                showBase64Image(input);
                result = '[图片预览]';
                break;
            case 'url':
                result = handleUrlConversion(input);
                break;
            case 'timestamp':
                result = handleTimestampConversion(input);
                break;
            case 'csv':
                result = handleCsvConversion(input);
                break;
            case 'sql':
                result = handleSqlFormatting(input);
                break;
            case 'jsmin':
                result = handleJsMinify(input);
                break;
            case 'md5':
                const md5Raw = handleMd5Encrypt(input);
                const md5Lower = md5Raw.toLowerCase();
                const md5Upper = md5Raw.toUpperCase();
                const md5Lower16 = md5Lower.slice(8, 24);
                const md5Upper16 = md5Upper.slice(8, 24);
                result =
                    `32位大写：${md5Upper}\n` +
                    `32位小写：${md5Lower}\n` +
                    `16位大写：${md5Upper16}\n` +
                    `16位小写：${md5Lower16}`;
                break;
        }
        elements.outputText.value = result;
        updateOutputStats();
        addToHistory(appState.currentTool, input.substring(0, 30));
        showNotification('转换成功', 'success');
    } catch (error) {
        elements.outputText.value = `错误: ${error.message}`;
        showNotification('转换失败: ' + error.message, 'error');
        if(appState.currentTool === 'base64img') {
            showBase64Image('');
        }
    }
    updateOutputPanelDisplay();
}

// 清空内容
function clearContent() {
    elements.inputText.value = '';
    elements.outputText.value = '';
    updateInputStats();
    updateOutputStats();
}

// 复制输出结果
function copyOutput() {
    const output = elements.outputText.value;
    if (!output) {
        showNotification('没有可复制的内容', 'error');
        return;
    }
    
    navigator.clipboard.writeText(output)
        .then(() => {
            showNotification('已复制到剪贴板', 'success');
        })
        .catch(err => {
            showNotification('复制失败: ' + err, 'error');
        });
}

// 更新输入统计
function updateInputStats() {
    const text = elements.inputText.value;
    const charCount = text.length;
    const lineCount = text ? text.split('\n').length : 0;
    elements.inputStats.textContent = `${charCount} 字符 | ${lineCount} 行`;
}

// 更新输出统计
function updateOutputStats() {
    const text = elements.outputText.value;
    const charCount = text.length;
    const lineCount = text ? text.split('\n').length : 0;
    elements.outputStats.textContent = `${charCount} 字符 | ${lineCount} 行`;
}

// 添加到历史记录
function addToHistory(tool, preview) {
    const historyItem = {
        tool: tool,
        preview: preview,
        timestamp: new Date().toISOString(),
        input: elements.inputText.value,
        output: elements.outputText.value
    };
    
    // 限制历史记录最多保存20条
    appState.history.unshift(historyItem);
    if (appState.history.length > 20) {
        appState.history.pop();
    }
    
    saveHistory();
    updateHistoryUI();
}

// 更新历史记录UI
function updateHistoryUI() {
    elements.historyList.innerHTML = '';
    
    appState.history.forEach((item, index) => {
        const li = document.createElement('li');
        const time = new Date(item.timestamp);
        const timeStr = time.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        // 获取功能类型前缀
        const toolTitle = getToolTitle(item.tool);
        li.innerHTML = `
            <span class="history-tool" style="font-weight:bold;color:var(--primary-color);margin-right:6px;">${toolTitle}:</span>
            <span class="history-content">${item.preview}</span>
            <span class="history-time">${timeStr}</span>
        `;
        li.addEventListener('click', () => loadHistoryItem(item));
        elements.historyList.appendChild(li);
    });
}

// 加载历史记录项
function loadHistoryItem(item) {
    changeTool(item.tool);
    elements.inputText.value = item.input;
    elements.outputText.value = item.output;
    updateInputStats();
    updateOutputStats();
    
    // 滚动到顶部
    elements.historyList.scrollTop = 0;
}

// 保存历史记录到本地存储
function saveHistory() {
    localStorage.setItem('formatConverterHistory', JSON.stringify(appState.history));
}

// 加载历史记录
function loadHistory() {
    const savedHistory = localStorage.getItem('formatConverterHistory');
    if (savedHistory) {
        try {
            appState.history = JSON.parse(savedHistory);
            updateHistoryUI();
        } catch (e) {
            console.error('加载历史记录失败', e);
        }
    }
}

// 显示通知
function showNotification(message, type = 'success') {
    elements.notification.textContent = message;
    elements.notification.className = 'notification ' + type;
    elements.notification.classList.add('show');
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// 切换主题
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        appState.theme = 'dark-theme';
    } else {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        appState.theme = 'light-theme';
    }
    
    // 保存主题偏好
    localStorage.setItem('theme', appState.theme);
}

// 加载主题偏好
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(savedTheme);
        appState.theme = savedTheme;
    }
}

// 设置文件拖放功能
function setupFileDrop() {
    const dropArea = elements.fileDropArea;
    const inputText = elements.inputText;
    
    // 阻止默认拖放行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // 高亮拖放区域
    ['dragenter', 'dragover'].forEach(eventName => {
        document.body.addEventListener(eventName, () => {
            dropArea.classList.add('active');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        document.body.addEventListener(eventName, () => {
            dropArea.classList.remove('active');
        }, false);
    });
    
    // 处理拖放文件
    document.body.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFiles(files);
        }
    }
}

// 处理文件选择
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFiles(files);
    }
}

// 处理文件
function handleFiles(files) {
    const file = files[0]; // 只处理第一个文件
    
    if (appState.currentTool === 'base64') {
        // 处理Base64编码
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64String = e.target.result;
            elements.inputText.value = file.name;
            elements.outputText.value = base64String;
            updateInputStats();
            updateOutputStats();
            showNotification('文件已转换为Base64', 'success');
        };
        reader.readAsDataURL(file);
    } else if (appState.currentTool === 'csv') {
        // 处理CSV文件
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            elements.inputText.value = content;
            updateInputStats();
            handleConvert();
        };
        reader.readAsText(file);
    } else {
        // 其他文件类型，直接读取文本内容
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            elements.inputText.value = content;
            updateInputStats();
            handleConvert();
        };
        reader.readAsText(file);
    }
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 汉堡菜单与侧边栏弹出
function setupSidebarHamburger() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    let mask = null;

    function openSidebar() {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
        hamburger.classList.add('hidden');
        if (!document.querySelector('.sidebar-mask')) {
            mask = document.createElement('div');
            mask.className = 'sidebar-mask';
            mask.onclick = closeSidebar;
            document.body.appendChild(mask);
        }
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        hamburger.classList.remove('hidden');
        const existMask = document.querySelector('.sidebar-mask');
        if (existMask) existMask.remove();
        mask = null;
    }
    hamburger.addEventListener('click', openSidebar);
    // 侧边栏内点击导航项后自动关闭（无论是否active）
    sidebar.addEventListener('click', e => {
        // 找到最近的.nav-item
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
            closeSidebar();
        }
    });
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeSidebar();
    });
}

// 清空历史记录
function clearHistory() {
    if (!window.confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
        return;
    }
    appState.history = [];
    saveHistory();
    updateHistoryUI();
    showNotification('历史记录已清空');
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadHistory();
    setupSidebarHamburger();
    // 绑定清空历史记录按钮
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearHistory);
    }
});

// base64图片预览
function showBase64Image(base64) {
    let container = document.getElementById('base64imgPreview');
    if (!container) {
        container = document.createElement('div');
        container.id = 'base64imgPreview';
        container.style.marginTop = '16px';
        container.style.textAlign = 'center';
        elements.outputText.parentElement.appendChild(container);
    }
    container.innerHTML = '';
    if (!base64) return;
    let src = base64;
    if (!/^data:image\//.test(base64)) {
        // 自动补全data url
        src = 'data:image/png;base64,' + base64;
    }
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Base64图片预览';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '240px';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    img.style.marginBottom = '12px';
    // 下载按钮
    const downloadBtn = document.createElement('a');
    downloadBtn.href = src;
    downloadBtn.download = 'image.png';
    downloadBtn.textContent = '下载图片';
    downloadBtn.className = 'btn primary';
    downloadBtn.style.display = 'inline-block';
    downloadBtn.style.marginTop = '12px';
    downloadBtn.style.padding = '6px 18px';
    downloadBtn.style.fontSize = '1em';
    downloadBtn.style.textDecoration = 'none';
    downloadBtn.style.borderRadius = '6px';
    downloadBtn.style.background = 'var(--primary-color)';
    downloadBtn.style.color = '#fff';
    downloadBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    container.appendChild(img);
    container.appendChild(document.createElement('br'));
    container.appendChild(downloadBtn);
}

function updateOutputPanelDisplay() {
    const isImg = appState.currentTool === 'base64img';
    let container = document.getElementById('base64imgPreview');
    if (!container) {
        container = document.createElement('div');
        container.id = 'base64imgPreview';
        container.style.marginTop = '16px';
        container.style.textAlign = 'center';
        elements.outputText.parentElement.appendChild(container);
    }
    if (isImg) {
        elements.outputText.style.display = 'none';
        container.style.display = '';
    } else {
        elements.outputText.style.display = '';
        container.style.display = 'none';
    }
} 