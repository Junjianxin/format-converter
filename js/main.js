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
    
    // 新增：交换按钮
    const swapBtn = document.getElementById('swapBtn');
    if (swapBtn) {
        swapBtn.addEventListener('click', swapInputOutput);
    }
    
    // 新增：下载按钮
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadOutput);
    }
    
    // 输入框事件
    elements.inputText.addEventListener('input', () => {
        updateInputStats();
    });
    
    // 新增：快捷键支持
    setupKeyboardShortcuts();
    
    // 新增：工具搜索
    setupToolSearch();
    
    // 文件拖放功能
    setupFileDrop();
}

// 交换输入输出内容
function swapInputOutput() {
    const inputVal = elements.inputText.value;
    const outputVal = elements.outputText.value;
    elements.inputText.value = outputVal;
    elements.outputText.value = inputVal;
    updateInputStats();
    updateOutputStats();
    showNotification('已交换输入输出', 'success');
}

// 下载输出结果
function downloadOutput() {
    const output = elements.outputText.value;
    if (!output) {
        showNotification('没有可下载的内容', 'error');
        return;
    }
    
    // 根据工具类型确定文件扩展名
    const extensions = {
        'json': '.json',
        'html': '.html',
        'xml': '.xml',
        'sql': '.sql',
        'csv': '.json',
        'jsmin': '.js',
        'headers': '.txt',
        'cookie': '.json'
    };
    const ext = extensions[appState.currentTool] || '.txt';
    const filename = `output_${Date.now()}${ext}`;
    
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('文件已下载', 'success');
}

// 键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter 或 Cmd+Enter 执行转换
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleConvert();
        }
        // Ctrl+Shift+C 复制结果
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            copyOutput();
        }
        // Ctrl+Shift+X 交换
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
            e.preventDefault();
            swapInputOutput();
        }
        // Escape 清除
        if (e.key === 'Escape' && document.activeElement === elements.inputText) {
            // 仅在输入框聚焦时生效
        }
    });
}

// 工具搜索功能
function setupToolSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();
        const navItems = document.querySelectorAll('.nav-item');
        const categories = document.querySelectorAll('.nav-category');
        
        if (keyword === '') {
            // 清空搜索时显示所有
            navItems.forEach(item => item.style.display = '');
            categories.forEach(cat => cat.style.display = '');
            return;
        }
        
        // 搜索匹配
        navItems.forEach(item => {
            const text = item.querySelector('.text').textContent.toLowerCase();
            const tool = item.getAttribute('data-tool').toLowerCase();
            
            if (text.includes(keyword) || tool.includes(keyword)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
        
        // 隐藏没有可见项的分类
        categories.forEach(cat => {
            const visibleItems = cat.querySelectorAll('.nav-item:not([style*="display: none"])');
            cat.style.display = visibleItems.length > 0 ? '' : 'none';
        });
    });
    
    // 搜索框快捷键 Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    });
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
        'md5': 'MD5加密',
        // 加密功能
        'hash': 'SHA/HMAC哈希',
        'unicode': 'Unicode转义',
        'jwt': 'JWT解码',
        'symmetric': 'AES/DES加解密',
        'rsa': 'RSA非对称加解密',
        // 爬虫逆向工具
        'hex': 'Hex编解码',
        'cookie': 'Cookie解析',
        'regex': '正则表达式测试',
        'radix': '进制转换',
        'jsonpath': 'JSON Path提取',
        'deobfuscate': '代码反混淆',
        'headers': 'Headers解析',
        // 新增工具
        'uuid': 'UUID生成',
        'random': '随机字符串生成',
        'qrcode': '二维码生成',
        'textdiff': '文本比对',
        'crontab': 'Crontab解析',
        'ascii': 'ASCII转换',
        'varname': '变量名转换',
        'htmlencode': 'HTML编码',
        'curl2py': 'cURL转Python',
        'htmlrender': 'HTML渲染预览'
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
        // 新增功能
        case 'hash':
            elements.toolOptions.innerHTML = `
                <select id="hashAlgo">
                    <option value="SHA-1">SHA-1</option>
                    <option value="SHA-256" selected>SHA-256</option>
                    <option value="SHA-384">SHA-384</option>
                    <option value="SHA-512">SHA-512</option>
                </select>
                <input type="text" id="hmacKey" placeholder="HMAC密钥(可选)"
                       style="padding:0.5rem;border-radius:4px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-color);width:150px;">
            `;
            break;
        case 'unicode':
            elements.toolOptions.innerHTML = `
                <select id="unicodeMode">
                    <option value="toNative">转义 -> 中文 (\\u...)</option>
                    <option value="toUnicode">中文 -> 转义 (\\u...)</option>
                    <option value="decodeURI">URL解码 (%E4...)</option>
                </select>
            `;
            document.getElementById('unicodeMode').addEventListener('change', () => {
                 // 可选：触发自动转换
            });
            break;
        case 'jwt':
            elements.toolOptions.innerHTML = ''; // JWT通常不需要额外选项
            break;
        case 'symmetric':
            elements.toolOptions.innerHTML = `
                <div style="display:flex; gap:5px; flex-wrap:wrap; align-items:center;">
                    <select id="symType" style="padding:4px;">
                        <option value="AES">AES</option>
                        <option value="DES">DES</option>
                        <option value="RC4">RC4</option>
                    </select>
                    <select id="symMode" style="padding:4px; font-weight:bold;">
                        <option value="encrypt">加密</option>
                        <option value="decrypt">解密</option>
                    </select>
                    <select id="symAlgoMode" style="padding:4px;">
                        <option value="CBC">CBC</option>
                        <option value="ECB">ECB</option>
                    </select>
                    <input type="text" id="symKey" placeholder="密钥 (Key)"
                           style="width:100px; padding:4px; border:1px solid var(--border-color); border-radius:4px;">
                    <input type="text" id="symIv" placeholder="偏移 (IV)"
                           style="width:80px; padding:4px; border:1px solid var(--border-color); border-radius:4px;">
                </div>
            `;

            // 监听算法变化，RC4 不需要 IV 和 Mode
            document.getElementById('symType').addEventListener('change', (e) => {
                const isRc4 = e.target.value === 'RC4';
                document.getElementById('symAlgoMode').style.display = isRc4 ? 'none' : 'inline-block';
                document.getElementById('symIv').style.display = isRc4 ? 'none' : 'inline-block';
            });
            break;
        case 'rsa':
            elements.toolOptions.innerHTML = `
                <div class="crypto-panel">
                    <div class="crypto-controls-row">
                        <select id="rsaAction" class="crypto-select">
                            <option value="encrypt">🔒 公钥加密</option>
                            <option value="decrypt">🔓 私钥解密</option>
                            <option value="gen">⚙️ 生成密钥对</option>
                        </select>

                        <select id="rsaSize" class="crypto-select hidden">
                            <option value="1024">1024 bit (快)</option>
                            <option value="2048" selected>2048 bit (标准)</option>
                        </select>
                    </div>

                    <div class="crypto-key-area" id="rsaKeyContainer">
                        <textarea
                            id="rsaKeyInput"
                            class="rsa-key-input"
                            placeholder="-----BEGIN PUBLIC KEY-----&#10;在此粘贴密钥..."
                            spellcheck="false"
                        ></textarea>
                    </div>
                </div>
            `;

            // 绑定事件监听
            const rsaAction = document.getElementById('rsaAction');
            const rsaSize = document.getElementById('rsaSize');
            const rsaKeyContainer = document.getElementById('rsaKeyContainer');
            const rsaKeyInput = document.getElementById('rsaKeyInput');

            rsaAction.addEventListener('change', (e) => {
                const val = e.target.value;

                // 控制显示逻辑
                if (val === 'gen') {
                    rsaKeyContainer.classList.add('hidden');
                    rsaSize.classList.remove('hidden');
                    // 生成模式不需要 placeholder，但为了安全起见清空
                } else {
                    rsaKeyContainer.classList.remove('hidden');
                    rsaSize.classList.add('hidden');

                    // 动态更新 Placeholder 提示
                    if (val === 'encrypt') {
                        rsaKeyInput.placeholder = `请粘贴 公钥 (Public Key):\n-----BEGIN PUBLIC KEY-----\n...`;
                    } else {
                        rsaKeyInput.placeholder = `请粘贴 私钥 (Private Key):\n-----BEGIN PRIVATE KEY-----\n...`;
                    }
                }
            });
            break;
        
        // ========== 爬虫逆向新增工具 ==========
        case 'hex':
            elements.toolOptions.innerHTML = `
                <button id="hexEncodeBtn" class="option-btn active">字符串→Hex</button>
                <button id="hexDecodeBtn" class="option-btn">Hex→字符串</button>
                <select id="hexFormat" style="padding:4px;">
                    <option value="plain">无分隔</option>
                    <option value="space">空格分隔</option>
                    <option value="0x">0x前缀</option>
                    <option value="\\x">\\x前缀</option>
                </select>
            `;
            document.getElementById('hexEncodeBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            document.getElementById('hexDecodeBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            break;
            
        case 'cookie':
            elements.toolOptions.innerHTML = `
                <button id="cookieParseBtn" class="option-btn active">解析Cookie</button>
                <button id="cookieBuildBtn" class="option-btn">生成Cookie</button>
            `;
            document.getElementById('cookieParseBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            document.getElementById('cookieBuildBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            break;
            
        case 'regex':
            elements.toolOptions.innerHTML = `
                <input type="text" id="regexPattern" placeholder="输入正则表达式..." 
                       style="flex:1; padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; background:var(--input-bg); color:var(--text-color); min-width:200px;">
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="regexGlobal" checked> g
                </label>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="regexIgnoreCase"> i
                </label>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="regexMultiline"> m
                </label>
            `;
            break;
            
        case 'radix':
            elements.toolOptions.innerHTML = `
                <select id="radixFrom" style="padding:4px;">
                    <option value="10" selected>十进制</option>
                    <option value="2">二进制</option>
                    <option value="8">八进制</option>
                    <option value="16">十六进制</option>
                </select>
                <span style="color:var(--text-secondary);">→</span>
                <select id="radixTo" style="padding:4px;">
                    <option value="16" selected>十六进制</option>
                    <option value="2">二进制</option>
                    <option value="8">八进制</option>
                    <option value="10">十进制</option>
                </select>
                <button id="radixAllBtn" class="option-btn">全部转换</button>
            `;
            document.getElementById('radixAllBtn').addEventListener('click', () => {
                document.getElementById('radixAllBtn').classList.toggle('active');
            });
            break;
            
        case 'jsonpath':
            elements.toolOptions.innerHTML = `
                <input type="text" id="jsonPathExpr" placeholder="输入JSONPath表达式，如: $.data[0].name" 
                       style="flex:1; padding:6px 10px; border:1px solid var(--border-color); border-radius:4px; background:var(--input-bg); color:var(--text-color); min-width:250px;">
            `;
            break;
            
        case 'deobfuscate':
            elements.toolOptions.innerHTML = `
                <select id="deobfuscateMode" style="padding:4px;">
                    <option value="reverse">字符串反转</option>
                    <option value="charcode">CharCode还原</option>
                    <option value="atob">atob解码</option>
                    <option value="unescape">unescape解码</option>
                    <option value="eval">eval提取</option>
                    <option value="aaencode">AAEncode解码</option>
                    <option value="jjencode">JJEncode解码</option>
                </select>
            `;
            break;
            
        case 'headers':
            elements.toolOptions.innerHTML = `
                <button id="headerParseBtn" class="option-btn active">解析Headers</button>
                <button id="headerBuildBtn" class="option-btn">生成Headers</button>
                <button id="headerCurlBtn" class="option-btn">转cURL</button>
            `;
            document.getElementById('headerParseBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            document.getElementById('headerBuildBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            document.getElementById('headerCurlBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            break;
        
        // ========== 新增工具选项 ==========
        case 'uuid':
            elements.toolOptions.innerHTML = `
                <select id="uuidVersion" style="padding:6px 12px;">
                    <option value="v4" selected>UUID v4 (随机)</option>
                    <option value="v1">UUID v1 (时间戳)</option>
                </select>
                <select id="uuidCount" style="padding:6px 12px;">
                    <option value="1">生成 1 个</option>
                    <option value="5">生成 5 个</option>
                    <option value="10">生成 10 个</option>
                    <option value="20">生成 20 个</option>
                </select>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="uuidUppercase"> 大写
                </label>
            `;
            break;
            
        case 'random':
            elements.toolOptions.innerHTML = `
                <input type="number" id="randomLength" value="16" min="1" max="256" 
                       style="width:60px; padding:6px; border:1px solid var(--border-color); border-radius:4px;">
                <span style="color:var(--text-secondary);">位</span>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="randomLower" checked> a-z
                </label>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="randomUpper" checked> A-Z
                </label>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="randomNumber" checked> 0-9
                </label>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="randomSymbol"> 符号
                </label>
            `;
            break;
            
        case 'qrcode':
            elements.toolOptions.innerHTML = `
                <select id="qrcodeSize" style="padding:6px 12px;">
                    <option value="128">128 x 128</option>
                    <option value="200" selected>200 x 200</option>
                    <option value="300">300 x 300</option>
                    <option value="400">400 x 400</option>
                </select>
            `;
            break;
            
        case 'textdiff':
            elements.toolOptions.innerHTML = `
                <span style="color:var(--text-secondary); font-size:0.9rem;">在输入框中用 ===分隔符=== 分隔两段文本</span>
            `;
            break;
            
        case 'crontab':
            elements.toolOptions.innerHTML = `
                <span style="color:var(--text-secondary); font-size:0.9rem;">输入Cron表达式，如: */5 * * * *</span>
            `;
            break;
            
        case 'ascii':
            elements.toolOptions.innerHTML = `
                <button id="asciiToCharBtn" class="option-btn active">ASCII→字符</button>
                <button id="charToAsciiBtn" class="option-btn">字符→ASCII</button>
                <select id="asciiFormat" style="padding:6px 12px;">
                    <option value="dec">十进制</option>
                    <option value="hex">十六进制</option>
                    <option value="bin">二进制</option>
                </select>
            `;
            document.getElementById('asciiToCharBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            document.getElementById('charToAsciiBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            break;
            
        case 'varname':
            elements.toolOptions.innerHTML = `
                <select id="varnameFrom" style="padding:6px 12px;">
                    <option value="auto">自动检测</option>
                    <option value="camel">驼峰 camelCase</option>
                    <option value="pascal">帕斯卡 PascalCase</option>
                    <option value="snake">下划线 snake_case</option>
                    <option value="kebab">中划线 kebab-case</option>
                    <option value="constant">常量 CONSTANT_CASE</option>
                </select>
                <span style="color:var(--text-secondary);">→</span>
                <select id="varnameTo" style="padding:6px 12px;">
                    <option value="camel">驼峰 camelCase</option>
                    <option value="pascal">帕斯卡 PascalCase</option>
                    <option value="snake" selected>下划线 snake_case</option>
                    <option value="kebab">中划线 kebab-case</option>
                    <option value="constant">常量 CONSTANT_CASE</option>
                </select>
            `;
            break;
            
        case 'htmlencode':
            elements.toolOptions.innerHTML = `
                <button id="htmlEncodeBtn" class="option-btn active">编码</button>
                <button id="htmlDecodeBtn" class="option-btn">解码</button>
            `;
            document.getElementById('htmlEncodeBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            document.getElementById('htmlDecodeBtn').addEventListener('click', (e) => toggleOptionButtons(e.target));
            break;
            
        case 'curl2py':
            elements.toolOptions.innerHTML = `
                <select id="curlLibrary" style="padding:6px 12px;">
                    <option value="requests" selected>requests</option>
                    <option value="httpx">httpx</option>
                    <option value="aiohttp">aiohttp</option>
                </select>
            `;
            break;
            
        case 'htmlrender':
            elements.toolOptions.innerHTML = `
                <button id="renderBtn" class="option-btn active">渲染预览</button>
                <label style="display:flex; align-items:center; gap:4px;">
                    <input type="checkbox" id="renderSandbox" checked> 沙箱模式
                </label>
            `;
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
        'md5': '请输入需要加密的内容...',
        // 新增功能
        'hash': '请输入需要计算哈希的文本...',
        'unicode': '输入 \\u4f60\\u597d 或 中文...',
        'jwt': '请输入 eyJ... 开头的 JWT Token...',
        'symmetric': '输入待加密的文本 或 待解密的密文 (Base64格式)...',
        'rsa': '输入待处理的内容...',
        // 爬虫逆向新增工具
        'hex': '请输入字符串或Hex值...\n示例: Hello 或 48656c6c6f',
        'cookie': '请输入Cookie字符串...\n示例: name=value; session=abc123; token=xyz',
        'regex': '请输入要匹配的文本...',
        'radix': '请输入数字...\n支持多个数字，每行一个',
        'jsonpath': '请输入JSON数据...\n然后在上方输入JSONPath表达式提取数据',
        'deobfuscate': '请输入混淆的代码或字符串...',
        'headers': '请输入HTTP Headers...\n示例:\nContent-Type: application/json\nAuthorization: Bearer xxx',
        // 新增工具
        'uuid': '点击转换按钮生成UUID...',
        'random': '点击转换按钮生成随机字符串...',
        'qrcode': '请输入要生成二维码的内容...',
        'textdiff': '请输入两段文本，用 ===分隔符=== 分隔\n\n示例:\n第一段文本内容\n===分隔符===\n第二段文本内容',
        'crontab': '请输入Cron表达式...\n示例: */5 * * * * (每5分钟)\n0 0 * * * (每天0点)',
        'ascii': '请输入ASCII码或字符...\n示例: 72 101 108 108 111 或 Hello',
        'varname': '请输入变量名...\n支持每行一个变量名批量转换\n示例: getUserName 或 get_user_name',
        'htmlencode': '请输入HTML内容...\n示例: <div>Hello & World</div>',
        'curl2py': '请粘贴cURL命令...\n示例: curl \'https://api.example.com\' -H \'Content-Type: application/json\'',
        'htmlrender': '请输入HTML代码进行渲染预览...\n支持HTML、CSS、JavaScript'
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
async function handleConvert() {
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
            // 新增功能
            case 'hash':
                // 注意这里使用了 await
                result = await handleHashConversion(input);
                break;
            case 'unicode':
                result = handleUnicodeConversion(input);
                break;
            case 'jwt':
                result = handleJwtDecode(input);
                break;
            case 'symmetric':
                result = handleSymmetricCrypto(input);
                break;
                case 'rsa':
                // 特殊处理 RSA 生成，因为它是耗时且特殊的
                if (document.getElementById('rsaAction').value === 'gen') {
                    // 使用 JSEncrypt 生成 (稍微有点 trick，因为它是异步回调或者很慢)
                    const crypt = new JSEncrypt({ default_key_size: document.getElementById('rsaSize').value });
                    // 简易生成方式
                    crypt.getKey();
                    const pub = crypt.getPublicKey();
                    const priv = crypt.getPrivateKey();
                    result = `[公钥 Public Key]\n${pub}\n\n[私钥 Private Key]\n${priv}`;
                } else {
                    result = handleRsaCrypto(input);
                }
                break;
            
            // ========== 爬虫逆向新增工具 ==========
            case 'hex':
                result = handleHexConversion(input);
                break;
            case 'cookie':
                result = handleCookieConversion(input);
                break;
            case 'regex':
                result = handleRegexTest(input);
                break;
            case 'radix':
                result = handleRadixConversion(input);
                break;
            case 'jsonpath':
                result = handleJsonPath(input);
                break;
            case 'deobfuscate':
                result = handleDeobfuscate(input);
                break;
            case 'headers':
                result = handleHeadersConversion(input);
                break;
            
            // ========== 新增工具处理 ==========
            case 'uuid':
                result = handleUuidGeneration();
                break;
            case 'random':
                result = handleRandomString();
                break;
            case 'qrcode':
                result = handleQrCodeGeneration(input);
                break;
            case 'textdiff':
                result = handleTextDiff(input);
                break;
            case 'crontab':
                result = handleCrontabParse(input);
                break;
            case 'ascii':
                result = handleAsciiConversion(input);
                break;
            case 'varname':
                result = handleVarnameConversion(input);
                break;
            case 'htmlencode':
                result = handleHtmlEncode(input);
                break;
            case 'curl2py':
                result = handleCurl2Python(input);
                break;
            case 'htmlrender':
                showHtmlRender(input);
                result = '[HTML渲染预览 - 请查看下方预览区域]';
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
    const isQrcode = appState.currentTool === 'qrcode';
    const isHtmlRender = appState.currentTool === 'htmlrender';
    
    // Base64图片预览容器
    let imgContainer = document.getElementById('base64imgPreview');
    if (!imgContainer) {
        imgContainer = document.createElement('div');
        imgContainer.id = 'base64imgPreview';
        imgContainer.style.marginTop = '16px';
        imgContainer.style.textAlign = 'center';
        elements.outputText.parentElement.appendChild(imgContainer);
    }
    
    // HTML渲染预览容器
    let htmlContainer = document.getElementById('htmlRenderPreview');
    if (!htmlContainer) {
        htmlContainer = document.createElement('div');
        htmlContainer.id = 'htmlRenderPreview';
        htmlContainer.style.marginTop = '16px';
        htmlContainer.style.width = '100%';
        htmlContainer.style.minHeight = '200px';
        htmlContainer.style.border = '1px solid var(--border-color)';
        htmlContainer.style.borderRadius = '8px';
        htmlContainer.style.overflow = 'hidden';
        htmlContainer.style.background = '#fff';
        elements.outputText.parentElement.appendChild(htmlContainer);
    }
    
    // 二维码预览容器
    let qrContainer = document.getElementById('qrcodePreview');
    if (!qrContainer) {
        qrContainer = document.createElement('div');
        qrContainer.id = 'qrcodePreview';
        qrContainer.style.marginTop = '16px';
        qrContainer.style.textAlign = 'center';
        elements.outputText.parentElement.appendChild(qrContainer);
    }
    
    if (isImg) {
        elements.outputText.style.display = 'none';
        imgContainer.style.display = '';
        htmlContainer.style.display = 'none';
        qrContainer.style.display = 'none';
    } else if (isHtmlRender) {
        elements.outputText.style.display = 'none';
        imgContainer.style.display = 'none';
        htmlContainer.style.display = '';
        qrContainer.style.display = 'none';
    } else if (isQrcode) {
        elements.outputText.style.display = 'none';
        imgContainer.style.display = 'none';
        htmlContainer.style.display = 'none';
        qrContainer.style.display = '';
    } else {
        elements.outputText.style.display = '';
        imgContainer.style.display = 'none';
        htmlContainer.style.display = 'none';
        qrContainer.style.display = 'none';
    }
}

// HTML渲染预览
function showHtmlRender(html) {
    let container = document.getElementById('htmlRenderPreview');
    if (!container) {
        container = document.createElement('div');
        container.id = 'htmlRenderPreview';
        elements.outputText.parentElement.appendChild(container);
    }
    container.innerHTML = '';
    
    if (!html.trim()) return;
    
    const sandbox = document.getElementById('renderSandbox');
    const useSandbox = sandbox ? sandbox.checked : true;
    
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.minHeight = '300px';
    iframe.style.border = 'none';
    iframe.style.background = '#fff';
    
    if (useSandbox) {
        iframe.sandbox = 'allow-same-origin';
    }
    
    container.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
    
    // 自动调整高度
    setTimeout(() => {
        try {
            const height = doc.body.scrollHeight + 20;
            iframe.style.height = Math.max(height, 200) + 'px';
        } catch (e) {
            iframe.style.height = '300px';
        }
    }, 100);
} 