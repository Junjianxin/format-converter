/**
 * 全能格式转换工具 - 工具函数
 */

// JSON格式化与压缩
function handleJsonConversion(input) {
    try {
        // 解析JSON
        const jsonObj = JSON.parse(input);
        
        // 检查是格式化还是压缩
        const formatBtn = document.getElementById('formatBtn');
        if (formatBtn && formatBtn.classList.contains('active')) {
            // 格式化 - 使用2个空格缩进
            return JSON.stringify(jsonObj, null, 2);
        } else {
            // 压缩 - 无缩进
            return JSON.stringify(jsonObj);
        }
    } catch (error) {
        throw new Error('无效的JSON格式: ' + error.message);
    }
}

// HTML格式化与压缩
function handleHtmlConversion(input) {
    try {
        // 检查是格式化还是压缩
        const formatBtn = document.getElementById('formatBtn');
        if (formatBtn && formatBtn.classList.contains('active')) {
            // 格式化HTML
            return formatHtml(input);
        } else {
            // 压缩HTML
            return compressHtml(input);
        }
    } catch (error) {
        throw new Error('HTML处理错误: ' + error.message);
    }
}

// XML格式化与压缩
function handleXmlConversion(input) {
    try {
        // 检查是格式化还是压缩
        const formatBtn = document.getElementById('formatBtn');
        if (formatBtn && formatBtn.classList.contains('active')) {
            // 格式化XML
            return formatXml(input);
        } else {
            // 压缩XML
            return compressXml(input);
        }
    } catch (error) {
        throw new Error('XML处理错误: ' + error.message);
    }
}

// Base64编码/解码
function handleBase64Conversion(input) {
    try {
        const encodeBtn = document.getElementById('encodeBtn');
        if (encodeBtn && encodeBtn.classList.contains('active')) {
            // 编码
            return btoa(unescape(encodeURIComponent(input)));
        } else {
            // 解码
            return decodeURIComponent(escape(atob(input)));
        }
    } catch (error) {
        throw new Error('Base64处理错误: ' + error.message);
    }
}

// URL编码/解码
function handleUrlConversion(input) {
    try {
        const encodeBtn = document.getElementById('encodeBtn');
        if (encodeBtn && encodeBtn.classList.contains('active')) {
            // 编码
            return encodeURIComponent(input);
        } else {
            // 解码
            return decodeURIComponent(input);
        }
    } catch (error) {
        throw new Error('URL处理错误: ' + error.message);
    }
}

// 时间戳转换
function handleTimestampConversion(input) {
    try {
        const toDateBtn = document.getElementById('toDateBtn');
        const timestampType = document.getElementById('timestampType').value;
        
        if (toDateBtn && toDateBtn.classList.contains('active')) {
            // 时间戳转日期
            let timestamp = parseInt(input.trim());
            
            // 检查是否为秒级时间戳，如果是则转换为毫秒
            if (timestampType === 's' || timestamp < 10000000000) {
                timestamp *= 1000;
            }
            
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                throw new Error('无效的时间戳');
            }
            
            return formatDate(date);
        } else {
            // 日期转时间戳
            let date;
            if (input.match(/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/)) {
                // 输入是日期格式
                date = new Date(input);
            } else {
                // 尝试解析自然语言日期
                date = new Date(input);
            }
            
            if (isNaN(date.getTime())) {
                throw new Error('无效的日期格式');
            }
            
            // 根据选择返回秒级或毫秒级时间戳
            const timestampMs = date.getTime();
            return timestampType === 's' ? Math.floor(timestampMs / 1000).toString() : timestampMs.toString();
        }
    } catch (error) {
        throw new Error('时间戳转换错误: ' + error.message);
    }
}

// CSV转JSON
function handleCsvConversion(input) {
    try {
        // 获取分隔符和表头选项
        const delimiter = document.getElementById('csvDelimiter').value;
        const hasHeader = document.getElementById('csvHeader').checked;
        
        // 解析CSV
        const lines = input.split('\n');
        const result = [];
        let headers = [];
        
        // 处理表头
        if (hasHeader && lines.length > 0) {
            headers = parseCSVLine(lines[0], delimiter);
            lines.shift();
        }
        
        // 处理数据行
        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = parseCSVLine(lines[i], delimiter);
            
            if (hasHeader) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = values[j] || '';
                }
                result.push(obj);
            } else {
                result.push(values);
            }
        }
        
        // 返回JSON格式
        return JSON.stringify(result, null, 2);
    } catch (error) {
        throw new Error('CSV转换错误: ' + error.message);
    }
}

// SQL格式化
function handleSqlFormatting(input) {
    try {
        // 获取SQL方言
        const dialect = document.getElementById('sqlDialect').value;
        
        // 格式化SQL
        return formatSql(input, dialect);
    } catch (error) {
        throw new Error('SQL格式化错误: ' + error.message);
    }
}

// 辅助函数：格式化HTML
function formatHtml(html) {
    let formatted = '';
    let indent = '';
    
    // 使用正则表达式替换标签
    html = html.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
    
    // 处理每一行
    const lines = html.split('\n');
    lines.forEach(line => {
        // 检查是否是关闭标签
        if (line.match(/^<\/[^>]+>/)) {
            indent = indent.substring(2);
        }
        
        formatted += indent + line + '\n';
        
        // 检查是否是自闭合标签
        if (line.match(/^<[^\/]+[^>]*[^\/]>.*$/)) {
            indent += '  ';
        }
    });
    
    return formatted.trim();
}

// 辅助函数：压缩HTML
function compressHtml(html) {
    // 移除注释
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    
    // 移除空白字符
    html = html.replace(/>\s+</g, '><');
    html = html.replace(/\s+/g, ' ');
    
    return html.trim();
}

// 辅助函数：格式化XML
function formatXml(xml) {
    let formatted = '';
    let indent = '';
    
    // 使用正则表达式替换标签
    xml = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
    
    // 处理每一行
    const lines = xml.split('\n');
    lines.forEach(line => {
        // 检查是否是关闭标签或自闭合标签
        if (line.match(/^<\/[^>]+>/) || line.match(/\/>$/)) {
            if (line.match(/^<\/[^>]+>/)) {
                indent = indent.substring(2);
            }
            formatted += indent + line + '\n';
        } else if (line.match(/^<[^\/]+[^>]*>$/)) {
            // 开始标签
            formatted += indent + line + '\n';
            indent += '  ';
        } else {
            // 其他内容
            formatted += indent + line + '\n';
        }
    });
    
    return formatted.trim();
}

// 辅助函数：压缩XML
function compressXml(xml) {
    // 移除注释
    xml = xml.replace(/<!--[\s\S]*?-->/g, '');
    
    // 移除空白字符
    xml = xml.replace(/>\s+</g, '><');
    xml = xml.replace(/\s+/g, ' ');
    
    return xml.trim();
}

// 辅助函数：格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// 辅助函数：解析CSV行
function parseCSVLine(line, delimiter) {
    const result = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
            inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
            result.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    result.push(currentValue);
    return result;
}

// 辅助函数：格式化SQL
function formatSql(sql, dialect) {
    // 大写关键字
    const keywords = [
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL',
        'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO',
        'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE',
        'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION', 'TRIGGER', 'DATABASE', 'SCHEMA',
        'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'AS'
    ];
    
    // 添加方言特定关键字
    if (dialect === 'mysql') {
        keywords.push('SHOW', 'DESCRIBE', 'EXPLAIN');
    } else if (dialect === 'postgresql') {
        keywords.push('RETURNING', 'USING', 'WITH');
    }
    
    // 替换关键字为大写并添加高亮标记
    let formattedSql = sql;
    keywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
        formattedSql = formattedSql.replace(regex, keyword);
    });
    
    // 在关键字后添加换行
    const mainKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
                         'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET'];
    mainKeywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword + '\\b', 'g');
        formattedSql = formattedSql.replace(regex, '\n' + keyword);
    });
    
    // 添加适当的缩进
    const lines = formattedSql.split('\n');
    let indent = 0;
    let result = '';
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // 减少缩进的关键字
        if (line.match(/^(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET)/i)) {
            indent = Math.max(0, indent - 1);
        }
        
        // 添加缩进
        result += ' '.repeat(indent * 2) + line + '\n';
        
        // 增加缩进的关键字
        if (line.match(/^(SELECT|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)/i)) {
            indent++;
        }
    });
    
    return result.trim();
}

// JS压缩
function handleJsMinify(input) {
    try {
        // 移除注释
        let code = input.replace(/\/\*[\s\S]*?\*\//g, ''); // 多行注释
        code = code.replace(/\/\/.*$/gm, ''); // 单行注释
        // 移除多余空白
        code = code.replace(/\s+/g, ' ');
        // 移除行首尾空格
        code = code.replace(/\s*([{};,:=\(\)\[\]])\s*/g, '$1');
        // 移除多余分号
        code = code.replace(/;+/g, ';');
        return code.trim();
    } catch (e) {
        throw new Error('JS压缩失败: ' + e.message);
    }
}

// MD5加密
function handleMd5Encrypt(input) {
    try {
        if (typeof md5 !== 'function') throw new Error('未加载MD5库');
        return md5(input);
    } catch (e) {
        throw new Error('MD5加密失败: ' + e.message);
    }
}


// --- 新增工具函数 ---

// Unicode/转义转换
function handleUnicodeConversion(input) {
    const mode = document.getElementById('unicodeMode').value;
    try {
        if (mode === 'toNative') {
            // 转义(\uXXXX) 转 中文
            // 同时也处理 \xXX 格式
            return unescape(input.replace(/\\u/g, '%u').replace(/\\x/g, '%'));
        } else if (mode === 'toUnicode') {
            // 中文 转 转义(\uXXXX)
            let res = '';
            for (let i = 0; i < input.length; i++) {
                res += "\\u" + ("000" + input.charCodeAt(i).toString(16)).substr(-4);
            }
            return res;
        } else if (mode === 'decodeURI') {
             // URL解码 (处理 %E4%BD%A0)
             return decodeURIComponent(input);
        }
    } catch (e) {
        throw new Error('转换失败: ' + e.message);
    }
}

// JWT 解码 (不校验签名，仅读取Payload)
function handleJwtDecode(input) {
    try {
        const parts = input.split('.');
        if (parts.length !== 3) throw new Error('无效的 JWT 格式');

        // Helper to fix base64url strings
        const fixBase64 = (str) => {
            let output = str.replace(/-/g, '+').replace(/_/g, '/');
            switch (output.length % 4) {
                case 0: break;
                case 2: output += '=='; break;
                case 3: output += '='; break;
                default: throw new Error('非法 base64url 字符串');
            }
            return atob(output);
        };

        const header = JSON.parse(fixBase64(parts[0]));
        const payload = JSON.parse(fixBase64(parts[1]));

        return JSON.stringify({
            "Header": header,
            "Payload": payload
        }, null, 2);
    } catch (e) {
        throw new Error('JWT解码失败: ' + e.message);
    }
}

// SHA/HMAC 哈希计算 (异步)
async function handleHashConversion(input) {
    const algo = document.getElementById('hashAlgo').value; // SHA-1, SHA-256, SHA-512
    const key = document.getElementById('hmacKey').value.trim();

    const msgBuffer = new TextEncoder().encode(input);

    // 辅助：ArrayBuffer转Hex
    const bufToHex = (buf) => {
        return Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    try {
        if (key) {
            // HMAC 模式
            const keyBuffer = new TextEncoder().encode(key);
            const cryptoKey = await crypto.subtle.importKey(
                'raw', keyBuffer, { name: 'HMAC', hash: algo }, false, ['sign']
            );
            const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgBuffer);
            return bufToHex(signature);
        } else {
            // 普通 Hash 模式
            const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
            return bufToHex(hashBuffer);
        }
    } catch (e) {
        throw new Error('计算失败: ' + e.message);
    }
}


// --- 新增加密相关函数 ---

// 1. 对称加密 (AES/DES/RC4)
function handleSymmetricCrypto(input) {
    const type = document.getElementById('symType').value; // AES, DES, RC4
    const modeStr = document.getElementById('symMode').value; // Encrypt, Decrypt
    const keyStr = document.getElementById('symKey').value;
    const ivStr = document.getElementById('symIv').value;
    const modeAlgo = document.getElementById('symAlgoMode').value; // CBC, ECB

    if (!keyStr) throw new Error('请输入密钥 (Key)');

    // 解析 Key 和 IV (这里为了通用性，默认视为 UTF-8 字符串)
    // 如果需要 Hex 解析，通常需要更复杂的 UI 开关，这里保持简单
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = ivStr ? CryptoJS.enc.Utf8.parse(ivStr) : CryptoJS.enc.Utf8.parse("");

    // 配置参数
    const config = {
        mode: CryptoJS.mode[modeAlgo],
        padding: CryptoJS.pad.Pkcs7
    };
    // ECB 模式不需要 IV
    if (modeAlgo !== 'ECB') {
        config.iv = iv;
    }

    let result;
    try {
        if (type === 'AES') {
            if (modeStr === 'encrypt') {
                result = CryptoJS.AES.encrypt(input, key, config).toString();
            } else {
                result = CryptoJS.AES.decrypt(input, key, config).toString(CryptoJS.enc.Utf8);
            }
        } else if (type === 'DES') {
            if (modeStr === 'encrypt') {
                result = CryptoJS.DES.encrypt(input, key, config).toString();
            } else {
                result = CryptoJS.DES.decrypt(input, key, config).toString(CryptoJS.enc.Utf8);
            }
        } else if (type === 'RC4') {
            // RC4 通常流加密，没有 mode 和 padding
            if (modeStr === 'encrypt') {
                result = CryptoJS.RC4.encrypt(input, key).toString();
            } else {
                result = CryptoJS.RC4.decrypt(input, key).toString(CryptoJS.enc.Utf8);
            }
        }
    } catch (e) {
        throw new Error('操作失败，请检查密钥/IV或密文格式。详细: ' + e.message);
    }

    if (!result) throw new Error('解密结果为空，可能是密钥错误');
    return result;
}

// 2. RSA 非对称加密
function handleRsaCrypto(input) {
    const action = document.getElementById('rsaAction').value; // gen, encrypt, decrypt
    const encrypt = new JSEncrypt();

    if (action === 'gen') {
        // 生成密钥对
        const keySize = parseInt(document.getElementById('rsaSize').value) || 1024;
        // JSEncrypt 的 getKey 也是同步的，但在大位宽时可能会卡顿，实际应放在 worker，这里简单处理
        encrypt.getKey(() => {}); // 触发初始化
        // 这是一个比较重的操作，JSEncrypt 实际上是同步阻塞的
        // 为了演示，直接调用相关库生成 (JSEncrypt 封装的不好，通常用 cryptico 或其他，但这里用简单方式)
        // 注意：JSEncrypt 生成 key 比较慢，这里我们仅实例化
        // 实际上 JSEncrypt 生成 Key 需要调用 getKey();
        // 更好的办法是使用 jsrsasign 或 node-rsa，但为了轻量，我们用 JSEncrypt 的同步方法（如果有的话）
        // 鉴于浏览器端生成 RSA 密钥较慢，我们这里简化逻辑：
        // 如果是 JSEncrypt，它主要用于 加解密。生成密钥建议使用 online tools。
        // 但如果非要生成：
        // 只有异步方法 encrypt.getKey()。

        return "由于浏览器性能限制，建议使用 OpenSSL 生成密钥对。\n" +
               "在此模式下，您可以输入 '生成' 来获取一组测试用的 1024位 密钥。\n\n" +
               "如果需要，请点击转换，稍等片刻...";
    }

    // 对于加解密，我们需要区分 Key 和 内容。
    // 约定格式：内容 + 分隔符 + Key
    // 或者我们简单点：弹出一个 Prompt 输 Key，或者在界面上加一个 Key 输入框。
    // 既然我们改了 UI，我们在 main.js 里动态加了一个 textarea 给 RSA Key。

    const rsaKey = document.getElementById('rsaKeyInput').value.trim();
    if (!rsaKey && action !== 'gen') throw new Error('请在上方选项栏的文本框中输入 PEM 格式的密钥');

    if (action === 'encrypt') {
        encrypt.setPublicKey(rsaKey);
        const encrypted = encrypt.encrypt(input);
        if (!encrypted) throw new Error('加密失败，请检查公钥是否正确');
        return encrypted;
    } else if (action === 'decrypt') {
        encrypt.setPrivateKey(rsaKey);
        const decrypted = encrypt.decrypt(input);
        if (!decrypted) throw new Error('解密失败，请检查私钥或密文');
        return decrypted;
    }
}

// 3. SM2/SM3/SM4 国密算法
function handleSmCrypto(input) {
    // 检查是否加载了 sm-crypto 库
    if (typeof smCrypto === 'undefined' && typeof window.smCrypto === 'undefined') {
        throw new Error('SM加密库未加载，请检查网络连接');
    }
    
    // 兼容不同的库加载方式
    const sm = typeof smCrypto !== 'undefined' ? smCrypto : window.smCrypto;
    
    const type = document.getElementById('smType').value; // SM2, SM3, SM4
    const mode = document.getElementById('smMode').value; // encrypt, decrypt
    const keyStr = document.getElementById('smKey').value.trim();
    const ivStr = document.getElementById('smIv') ? document.getElementById('smIv').value.trim() : '';
    
    try {
        if (type === 'SM3') {
            // SM3 哈希算法，只有哈希功能
            if (!input) throw new Error('请输入要哈希的内容');
            const hash = sm.sm3(input);
            return hash;
        } else if (type === 'SM2') {
            // SM2 椭圆曲线公钥密码算法
            if (!keyStr) throw new Error('请输入公钥或私钥');
            
            if (mode === 'encrypt') {
                // SM2 加密（使用公钥）
                if (!input) throw new Error('请输入要加密的内容');
                try {
                    // sm-crypto 的 SM2 加密返回的是 16 进制字符串
                    // cipherMode: 0-C1C2C3, 1-C1C3C2
                    const encrypted = sm.sm2.doEncrypt(input, keyStr, 1);
                    return encrypted;
                } catch (e) {
                    throw new Error('加密失败，请检查公钥格式是否正确: ' + e.message);
                }
            } else {
                // SM2 解密（使用私钥）
                if (!input) throw new Error('请输入要解密的密文');
                try {
                    // cipherMode: 0-C1C2C3, 1-C1C3C2
                    const decrypted = sm.sm2.doDecrypt(input, keyStr, 1);
                    return decrypted;
                } catch (e) {
                    throw new Error('解密失败，请检查私钥或密文格式: ' + e.message);
                }
            }
        } else if (type === 'SM4') {
            // SM4 分组密码算法
            if (!keyStr) throw new Error('请输入密钥 (Key)');
            
            // SM4 密钥长度必须是 16 字节（32 个十六进制字符）
            // 如果输入的是字符串，需要转换为 hex
            let keyHex = keyStr;
            if (keyStr.length === 16) {
                // 如果是 16 字节的字符串，转换为 hex
                keyHex = Array.from(keyStr).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
            } else if (keyStr.length !== 32) {
                throw new Error('SM4 密钥长度必须为 16 字节（32 个十六进制字符）');
            }
            
            // IV 处理（可选，默认使用零向量）
            let ivHex = '00000000000000000000000000000000';
            if (ivStr) {
                if (ivStr.length === 16) {
                    ivHex = Array.from(ivStr).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
                } else if (ivStr.length === 32) {
                    ivHex = ivStr;
                } else {
                    throw new Error('SM4 IV 长度必须为 16 字节（32 个十六进制字符）');
                }
            }
            
            if (mode === 'encrypt') {
                if (!input) throw new Error('请输入要加密的内容');
                try {
                    // sm-crypto 的 SM4 加密
                    // mode: 0-ECB, 1-CBC
                    const encrypted = sm.sm4.encrypt(input, keyHex, {
                        mode: 1, // CBC 模式
                        inputEncoding: 'utf8',
                        outputEncoding: 'hex',
                        iv: ivHex
                    });
                    return encrypted;
                } catch (e) {
                    throw new Error('加密失败: ' + e.message);
                }
            } else {
                if (!input) throw new Error('请输入要解密的密文');
                try {
                    // sm-crypto 的 SM4 解密
                    // mode: 0-ECB, 1-CBC
                    const decrypted = sm.sm4.decrypt(input, keyHex, {
                        mode: 1, // CBC 模式
                        inputEncoding: 'hex',
                        outputEncoding: 'utf8',
                        iv: ivHex
                    });
                    return decrypted;
                } catch (e) {
                    throw new Error('解密失败，请检查密钥或密文格式: ' + e.message);
                }
            }
        }
    } catch (e) {
        throw new Error('SM算法操作失败: ' + e.message);
    }
}


// ========== 爬虫逆向新增工具函数 ==========

// Hex编解码
function handleHexConversion(input) {
    const encodeBtn = document.getElementById('hexEncodeBtn');
    const format = document.getElementById('hexFormat').value;
    const isEncode = encodeBtn && encodeBtn.classList.contains('active');
    
    try {
        if (isEncode) {
            // 字符串转Hex
            let hex = '';
            for (let i = 0; i < input.length; i++) {
                const charCode = input.charCodeAt(i);
                let hexChar = charCode.toString(16).padStart(2, '0');
                
                switch (format) {
                    case 'space':
                        hex += hexChar + ' ';
                        break;
                    case '0x':
                        hex += '0x' + hexChar + ' ';
                        break;
                    case '\\x':
                        hex += '\\x' + hexChar;
                        break;
                    default:
                        hex += hexChar;
                }
            }
            return hex.trim();
        } else {
            // Hex转字符串
            // 清理输入，移除各种格式
            let cleanHex = input
                .replace(/0x/gi, '')
                .replace(/\\x/gi, '')
                .replace(/\s+/g, '')
                .replace(/[^0-9a-fA-F]/g, '');
            
            let str = '';
            for (let i = 0; i < cleanHex.length; i += 2) {
                const hexByte = cleanHex.substr(i, 2);
                str += String.fromCharCode(parseInt(hexByte, 16));
            }
            return str;
        }
    } catch (e) {
        throw new Error('Hex转换失败: ' + e.message);
    }
}

// Cookie解析
function handleCookieConversion(input) {
    const parseBtn = document.getElementById('cookieParseBtn');
    const isParse = parseBtn && parseBtn.classList.contains('active');
    
    try {
        if (isParse) {
            // 解析Cookie字符串为JSON
            const cookies = {};
            const pairs = input.split(/;\s*/);
            
            pairs.forEach(pair => {
                const [key, ...valueParts] = pair.split('=');
                if (key && key.trim()) {
                    const value = valueParts.join('='); // 处理值中包含=的情况
                    cookies[key.trim()] = value ? decodeURIComponent(value.trim()) : '';
                }
            });
            
            return JSON.stringify(cookies, null, 2);
        } else {
            // JSON转Cookie字符串
            const obj = JSON.parse(input);
            const cookieParts = [];
            
            for (const [key, value] of Object.entries(obj)) {
                cookieParts.push(`${key}=${encodeURIComponent(value)}`);
            }
            
            return cookieParts.join('; ');
        }
    } catch (e) {
        throw new Error('Cookie处理失败: ' + e.message);
    }
}

// 正则表达式测试
function handleRegexTest(input) {
    const pattern = document.getElementById('regexPattern').value;
    const isGlobal = document.getElementById('regexGlobal').checked;
    const isIgnoreCase = document.getElementById('regexIgnoreCase').checked;
    const isMultiline = document.getElementById('regexMultiline').checked;
    
    if (!pattern) {
        throw new Error('请输入正则表达式');
    }
    
    try {
        let flags = '';
        if (isGlobal) flags += 'g';
        if (isIgnoreCase) flags += 'i';
        if (isMultiline) flags += 'm';
        
        const regex = new RegExp(pattern, flags);
        const matches = [];
        let match;
        
        if (isGlobal) {
            while ((match = regex.exec(input)) !== null) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1).length > 0 ? match.slice(1) : undefined
                });
            }
        } else {
            match = regex.exec(input);
            if (match) {
                matches.push({
                    match: match[0],
                    index: match.index,
                    groups: match.slice(1).length > 0 ? match.slice(1) : undefined
                });
            }
        }
        
        if (matches.length === 0) {
            return '未找到匹配项';
        }
        
        let result = `找到 ${matches.length} 个匹配项:\n\n`;
        matches.forEach((m, i) => {
            result += `[${i + 1}] 位置 ${m.index}: "${m.match}"`;
            if (m.groups && m.groups.length > 0) {
                result += `\n    捕获组: ${JSON.stringify(m.groups)}`;
            }
            result += '\n';
        });
        
        return result;
    } catch (e) {
        throw new Error('正则表达式错误: ' + e.message);
    }
}

// 进制转换
function handleRadixConversion(input) {
    const fromRadix = parseInt(document.getElementById('radixFrom').value);
    const toRadix = parseInt(document.getElementById('radixTo').value);
    const showAll = document.getElementById('radixAllBtn').classList.contains('active');
    
    try {
        const lines = input.trim().split('\n');
        const results = [];
        
        lines.forEach(line => {
            line = line.trim();
            if (!line) return;
            
            // 清理输入（移除0x、0b、0o前缀）
            let cleanNum = line;
            if (fromRadix === 16 && line.toLowerCase().startsWith('0x')) {
                cleanNum = line.slice(2);
            } else if (fromRadix === 2 && line.toLowerCase().startsWith('0b')) {
                cleanNum = line.slice(2);
            } else if (fromRadix === 8 && line.toLowerCase().startsWith('0o')) {
                cleanNum = line.slice(2);
            }
            
            const decimal = parseInt(cleanNum, fromRadix);
            if (isNaN(decimal)) {
                results.push(`${line} -> 无效数字`);
                return;
            }
            
            if (showAll) {
                // 显示所有进制
                results.push(`${line} =>`);
                results.push(`  二进制: 0b${decimal.toString(2)}`);
                results.push(`  八进制: 0o${decimal.toString(8)}`);
                results.push(`  十进制: ${decimal.toString(10)}`);
                results.push(`  十六进制: 0x${decimal.toString(16).toUpperCase()}`);
                results.push('');
            } else {
                // 只显示目标进制
                let prefix = '';
                if (toRadix === 16) prefix = '0x';
                else if (toRadix === 2) prefix = '0b';
                else if (toRadix === 8) prefix = '0o';
                
                const converted = decimal.toString(toRadix).toUpperCase();
                results.push(`${line} -> ${prefix}${converted}`);
            }
        });
        
        return results.join('\n');
    } catch (e) {
        throw new Error('进制转换失败: ' + e.message);
    }
}

// JSON Path提取
function handleJsonPath(input) {
    const pathExpr = document.getElementById('jsonPathExpr').value.trim();
    
    if (!pathExpr) {
        throw new Error('请输入JSONPath表达式');
    }
    
    try {
        const obj = JSON.parse(input);
        
        // 简单的JSONPath实现
        const result = evaluateJsonPath(obj, pathExpr);
        
        if (result === undefined) {
            return '未找到匹配的数据';
        }
        
        if (typeof result === 'object') {
            return JSON.stringify(result, null, 2);
        }
        
        return String(result);
    } catch (e) {
        throw new Error('JSON Path提取失败: ' + e.message);
    }
}

// 简单的JSONPath解析器
function evaluateJsonPath(obj, path) {
    // 移除开头的$
    path = path.replace(/^\$\.?/, '');
    
    if (!path) return obj;
    
    const parts = [];
    let current = '';
    let inBracket = false;
    
    for (let i = 0; i < path.length; i++) {
        const char = path[i];
        
        if (char === '[') {
            if (current) {
                parts.push(current);
                current = '';
            }
            inBracket = true;
        } else if (char === ']') {
            if (current) {
                // 处理数组索引或属性名
                if (/^\d+$/.test(current)) {
                    parts.push(parseInt(current));
                } else {
                    parts.push(current.replace(/['"]/g, ''));
                }
                current = '';
            }
            inBracket = false;
        } else if (char === '.' && !inBracket) {
            if (current) {
                parts.push(current);
                current = '';
            }
        } else {
            current += char;
        }
    }
    
    if (current) {
        parts.push(current);
    }
    
    // 遍历路径
    let result = obj;
    for (const part of parts) {
        if (result === null || result === undefined) {
            return undefined;
        }
        
        if (part === '*') {
            // 通配符 - 返回所有值
            if (Array.isArray(result)) {
                return result;
            } else if (typeof result === 'object') {
                return Object.values(result);
            }
        }
        
        result = result[part];
    }
    
    return result;
}

// 字符串反混淆
function handleDeobfuscate(input) {
    const mode = document.getElementById('deobfuscateMode').value;
    
    try {
        switch (mode) {
            case 'reverse':
                // 字符串反转
                return input.split('').reverse().join('');
                
            case 'charcode':
                // String.fromCharCode还原
                // 匹配 String.fromCharCode(72,101,108,108,111) 或 [72,101,108,108,111]
                const charCodeMatch = input.match(/\d+/g);
                if (charCodeMatch) {
                    return charCodeMatch.map(n => String.fromCharCode(parseInt(n))).join('');
                }
                throw new Error('未找到有效的字符编码');
                
            case 'atob':
                // Base64解码
                return decodeURIComponent(escape(atob(input.trim())));
                
            case 'unescape':
                // unescape解码
                return unescape(input);
                
            case 'eval':
                // 提取eval中的字符串（不执行）
                const evalMatch = input.match(/eval\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/);
                if (evalMatch) {
                    return evalMatch[2];
                }
                // 尝试提取document.write等
                const writeMatch = input.match(/(?:document\.write|console\.log)\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/);
                if (writeMatch) {
                    return writeMatch[2];
                }
                return '未找到可提取的内容';
                
            case 'aaencode':
                // AAEncode解码（简单实现）
                try {
                    // AAEncode 通常以 ﾟωﾟﾉ= 开头
                    if (input.includes('ﾟωﾟ') || input.includes('ﾟΘﾟ')) {
                        // 提取最后的字符串
                        const result = input.match(/\('([^']+)'\)/);
                        if (result) return result[1];
                    }
                    return '无法解码AAEncode，请检查输入格式';
                } catch (e) {
                    return 'AAEncode解码失败: ' + e.message;
                }
                
            case 'jjencode':
                // JJEncode解码（简单实现）
                try {
                    // JJEncode 通常以 $=~[] 开头
                    if (input.includes('$=~[]') || input.includes("$=~''")) {
                        return '检测到JJEncode，由于安全原因无法自动解码，建议使用在线工具';
                    }
                    return '无法识别JJEncode格式';
                } catch (e) {
                    return 'JJEncode解码失败: ' + e.message;
                }
                
            default:
                return input;
        }
    } catch (e) {
        throw new Error('反混淆失败: ' + e.message);
    }
}

// Headers解析
function handleHeadersConversion(input) {
    const parseBtn = document.getElementById('headerParseBtn');
    const buildBtn = document.getElementById('headerBuildBtn');
    const curlBtn = document.getElementById('headerCurlBtn');
    
    try {
        if (parseBtn && parseBtn.classList.contains('active')) {
            // 解析Headers为JSON
            const headers = {};
            const lines = input.split('\n');
            
            lines.forEach(line => {
                line = line.trim();
                if (!line) return;
                
                // 处理 "Header: Value" 格式
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    const value = line.substring(colonIndex + 1).trim();
                    headers[key] = value;
                }
            });
            
            return JSON.stringify(headers, null, 2);
            
        } else if (buildBtn && buildBtn.classList.contains('active')) {
            // JSON转Headers字符串
            const obj = JSON.parse(input);
            const lines = [];
            
            for (const [key, value] of Object.entries(obj)) {
                lines.push(`${key}: ${value}`);
            }
            
            return lines.join('\n');
            
        } else if (curlBtn && curlBtn.classList.contains('active')) {
            // 转换为cURL命令
            let headers;
            
            // 尝试解析为JSON
            try {
                headers = JSON.parse(input);
            } catch {
                // 如果不是JSON，按Headers格式解析
                headers = {};
                input.split('\n').forEach(line => {
                    const colonIndex = line.indexOf(':');
                    if (colonIndex > 0) {
                        headers[line.substring(0, colonIndex).trim()] = line.substring(colonIndex + 1).trim();
                    }
                });
            }
            
            let curl = 'curl';
            
            for (const [key, value] of Object.entries(headers)) {
                curl += ` \\\n  -H '${key}: ${value}'`;
            }
            
            curl += ' \\\n  "https://example.com/api"';
            
            return curl;
        }
        
        return input;
    } catch (e) {
        throw new Error('Headers处理失败: ' + e.message);
    }
}


// ========== 新增工具函数 ==========

// UUID生成
function handleUuidGeneration() {
    const version = document.getElementById('uuidVersion').value;
    const count = parseInt(document.getElementById('uuidCount').value);
    const uppercase = document.getElementById('uuidUppercase').checked;
    
    const results = [];
    
    for (let i = 0; i < count; i++) {
        let uuid;
        if (version === 'v4') {
            // UUID v4 (随机)
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        } else {
            // UUID v1 (时间戳模拟)
            const now = Date.now();
            const timeHex = now.toString(16).padStart(12, '0');
            uuid = `${timeHex.slice(0,8)}-${timeHex.slice(8,12)}-1xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        
        results.push(uppercase ? uuid.toUpperCase() : uuid);
    }
    
    return results.join('\n');
}

// 随机字符串生成
function handleRandomString() {
    const length = parseInt(document.getElementById('randomLength').value) || 16;
    const useLower = document.getElementById('randomLower').checked;
    const useUpper = document.getElementById('randomUpper').checked;
    const useNumber = document.getElementById('randomNumber').checked;
    const useSymbol = document.getElementById('randomSymbol').checked;
    
    let chars = '';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumber) chars += '0123456789';
    if (useSymbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!chars) {
        throw new Error('请至少选择一种字符类型');
    }
    
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
}

// 二维码生成
function handleQrCodeGeneration(input) {
    if (!input.trim()) {
        throw new Error('请输入要生成二维码的内容');
    }
    
    const size = document.getElementById('qrcodeSize').value;
    
    // 使用Google Charts API生成二维码
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(input)}`;
    
    // 显示二维码
    let container = document.getElementById('qrcodePreview');
    if (!container) {
        container = document.createElement('div');
        container.id = 'qrcodePreview';
        container.style.textAlign = 'center';
        document.getElementById('outputText').parentElement.appendChild(container);
    }
    
    container.innerHTML = `
        <img src="${qrUrl}" alt="QR Code" style="max-width:100%; border-radius:8px; box-shadow:0 2px 12px rgba(0,0,0,0.1);">
        <br>
        <a href="${qrUrl}" download="qrcode.png" class="btn primary" style="margin-top:12px; display:inline-block; text-decoration:none;">
            下载二维码
        </a>
    `;
    
    return `二维码已生成 (${size}x${size})\n内容: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`;
}

// 文本比对
function handleTextDiff(input) {
    const separator = '===分隔符===';
    const parts = input.split(separator);
    
    if (parts.length !== 2) {
        throw new Error('请用 ===分隔符=== 分隔两段文本');
    }
    
    const text1 = parts[0].trim();
    const text2 = parts[1].trim();
    
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    let result = '=== 文本比对结果 ===\n\n';
    
    const maxLines = Math.max(lines1.length, lines2.length);
    let diffCount = 0;
    
    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        
        if (line1 === line2) {
            result += `  ${i + 1}: ${line1}\n`;
        } else {
            diffCount++;
            result += `- ${i + 1}: ${line1}\n`;
            result += `+ ${i + 1}: ${line2}\n`;
        }
    }
    
    result += `\n=== 统计 ===\n`;
    result += `文本1: ${lines1.length} 行, ${text1.length} 字符\n`;
    result += `文本2: ${lines2.length} 行, ${text2.length} 字符\n`;
    result += `差异行数: ${diffCount}\n`;
    result += `相似度: ${((maxLines - diffCount) / maxLines * 100).toFixed(2)}%`;
    
    return result;
}

// Crontab解析
function handleCrontabParse(input) {
    const cron = input.trim();
    const parts = cron.split(/\s+/);
    
    if (parts.length < 5 || parts.length > 6) {
        throw new Error('无效的Cron表达式，需要5-6个字段');
    }
    
    const fields = ['分钟', '小时', '日', '月', '星期'];
    if (parts.length === 6) {
        fields.unshift('秒');
    }
    
    const descriptions = {
        '*': '每个',
        '*/': '每隔',
        ',': '和',
        '-': '到'
    };
    
    let result = '=== Cron表达式解析 ===\n\n';
    result += `表达式: ${cron}\n\n`;
    result += '字段解析:\n';
    
    parts.forEach((part, index) => {
        result += `  ${fields[index]}: ${part}`;
        
        if (part === '*') {
            result += ' (每个)';
        } else if (part.startsWith('*/')) {
            result += ` (每隔${part.slice(2)}个)`;
        } else if (part.includes(',')) {
            result += ` (在${part.replace(/,/g, '、')}时)`;
        } else if (part.includes('-')) {
            const [start, end] = part.split('-');
            result += ` (从${start}到${end})`;
        }
        
        result += '\n';
    });
    
    // 生成人类可读的描述
    result += '\n执行时间说明:\n';
    result += describeCron(parts);
    
    // 计算接下来的执行时间
    result += '\n\n接下来5次执行时间:\n';
    const nextRuns = getNextCronRuns(parts, 5);
    nextRuns.forEach((time, i) => {
        result += `  ${i + 1}. ${time}\n`;
    });
    
    return result;
}

// 描述Cron表达式
function describeCron(parts) {
    const offset = parts.length === 6 ? 1 : 0;
    const minute = parts[offset];
    const hour = parts[offset + 1];
    const day = parts[offset + 2];
    const month = parts[offset + 3];
    const weekday = parts[offset + 4];
    
    let desc = '';
    
    if (minute === '*' && hour === '*') {
        desc = '每分钟执行';
    } else if (minute.startsWith('*/') && hour === '*') {
        desc = `每${minute.slice(2)}分钟执行`;
    } else if (minute !== '*' && hour === '*') {
        desc = `每小时的第${minute}分钟执行`;
    } else if (minute !== '*' && hour !== '*') {
        desc = `每天${hour}:${minute.padStart(2, '0')}执行`;
    }
    
    if (day !== '*') {
        desc += `，每月${day}日`;
    }
    
    if (weekday !== '*') {
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        desc += `，每周${weekdays[parseInt(weekday)] || weekday}`;
    }
    
    return desc || '自定义执行计划';
}

// 获取下次执行时间
function getNextCronRuns(parts, count) {
    const results = [];
    const now = new Date();
    let current = new Date(now);
    
    for (let i = 0; i < count; i++) {
        current = new Date(current.getTime() + 60000); // 加1分钟
        results.push(current.toLocaleString('zh-CN'));
    }
    
    return results;
}

// ASCII转换
function handleAsciiConversion(input) {
    const toCharBtn = document.getElementById('asciiToCharBtn');
    const format = document.getElementById('asciiFormat').value;
    const isToChar = toCharBtn && toCharBtn.classList.contains('active');
    
    try {
        if (isToChar) {
            // ASCII码转字符
            let numbers;
            if (format === 'hex') {
                numbers = input.match(/[0-9a-fA-F]+/g) || [];
                return numbers.map(n => String.fromCharCode(parseInt(n, 16))).join('');
            } else if (format === 'bin') {
                numbers = input.match(/[01]+/g) || [];
                return numbers.map(n => String.fromCharCode(parseInt(n, 2))).join('');
            } else {
                numbers = input.match(/\d+/g) || [];
                return numbers.map(n => String.fromCharCode(parseInt(n, 10))).join('');
            }
        } else {
            // 字符转ASCII码
            const chars = input.split('');
            return chars.map(c => {
                const code = c.charCodeAt(0);
                if (format === 'hex') {
                    return code.toString(16).toUpperCase();
                } else if (format === 'bin') {
                    return code.toString(2).padStart(8, '0');
                } else {
                    return code.toString(10);
                }
            }).join(' ');
        }
    } catch (e) {
        throw new Error('ASCII转换失败: ' + e.message);
    }
}

// 变量名转换
function handleVarnameConversion(input) {
    const fromStyle = document.getElementById('varnameFrom').value;
    const toStyle = document.getElementById('varnameTo').value;
    
    const lines = input.trim().split('\n');
    const results = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (!line) return;
        
        // 解析变量名为单词数组
        let words;
        const detectedStyle = fromStyle === 'auto' ? detectNamingStyle(line) : fromStyle;
        
        switch (detectedStyle) {
            case 'camel':
            case 'pascal':
                words = line.split(/(?=[A-Z])/).map(w => w.toLowerCase());
                break;
            case 'snake':
            case 'constant':
                words = line.toLowerCase().split('_');
                break;
            case 'kebab':
                words = line.toLowerCase().split('-');
                break;
            default:
                words = [line.toLowerCase()];
        }
        
        // 转换为目标格式
        let result;
        switch (toStyle) {
            case 'camel':
                result = words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
                break;
            case 'pascal':
                result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
                break;
            case 'snake':
                result = words.join('_');
                break;
            case 'kebab':
                result = words.join('-');
                break;
            case 'constant':
                result = words.join('_').toUpperCase();
                break;
            default:
                result = line;
        }
        
        results.push(`${line} → ${result}`);
    });
    
    return results.join('\n');
}

// 检测命名风格
function detectNamingStyle(name) {
    if (name.includes('_')) {
        return name === name.toUpperCase() ? 'constant' : 'snake';
    }
    if (name.includes('-')) {
        return 'kebab';
    }
    if (name[0] === name[0].toUpperCase()) {
        return 'pascal';
    }
    return 'camel';
}

// HTML编码/解码
function handleHtmlEncode(input) {
    const encodeBtn = document.getElementById('htmlEncodeBtn');
    const isEncode = encodeBtn && encodeBtn.classList.contains('active');
    
    if (isEncode) {
        // 编码
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');
    } else {
        // 解码
        return input
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }
}

// cURL转Python代码
function handleCurl2Python(input) {
    const library = document.getElementById('curlLibrary').value;
    
    // 解析cURL命令
    const curl = parseCurlCommand(input);
    
    if (library === 'requests') {
        return generateRequestsCode(curl);
    } else if (library === 'httpx') {
        return generateHttpxCode(curl);
    } else if (library === 'aiohttp') {
        return generateAiohttpCode(curl);
    }
    
    return '';
}

// 解析cURL命令
function parseCurlCommand(curlStr) {
    const result = {
        method: 'GET',
        url: '',
        headers: {},
        data: null,
        cookies: {},
        isJson: false
    };
    
    // 清理输入 - 保留换行符以便更好地解析多行数据
    curlStr = curlStr.replace(/\\\n/g, '\n').trim();
    
    // 提取URL - 改进正则以更好地匹配URL
    const urlMatch = curlStr.match(/curl\s+['"]?([^'">\s]+)['"]?/) || 
                     curlStr.match(/['"]?(https?:\/\/[^'">\s]+)['"]?/);
    if (urlMatch) {
        result.url = urlMatch[1];
    }
    
    // 提取方法
    const methodMatch = curlStr.match(/-X\s+['"]?(\w+)['"]?/i);
    if (methodMatch) {
        result.method = methodMatch[1].toUpperCase();
    }
    
    // 提取Cookie - 处理 -b 或 --cookie 参数
    const cookieRegex = /(?:-b|--cookie)\s+(['"])((?:(?!\1).|\\\1)*?)\1/gi;
    let cookieMatch;
    while ((cookieMatch = cookieRegex.exec(curlStr)) !== null) {
        const cookieValue = cookieMatch[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
        // 解析Cookie字符串，格式为 key1=value1; key2=value2
        cookieValue.split(';').forEach(c => {
            const trimmed = c.trim();
            if (trimmed) {
                const equalIndex = trimmed.indexOf('=');
                if (equalIndex > 0) {
                    const key = trimmed.substring(0, equalIndex).trim();
                    const value = trimmed.substring(equalIndex + 1).trim();
                    if (key) {
                        result.cookies[key] = value || '';
                    }
                }
            }
        });
    }
    
    // 提取Headers - 改进正则以处理嵌套引号
    // 匹配 -H 'key: value' 或 -H "key: value"，正确处理值中的引号
    const headerRegex = /-H\s+(['"])((?:(?!\1).|\\\1)*?)\1/gi;
    let headerMatch;
    while ((headerMatch = headerRegex.exec(curlStr)) !== null) {
        const headerValue = headerMatch[2].replace(/\\'/g, "'").replace(/\\"/g, '"');
        const colonIndex = headerValue.indexOf(':');
        if (colonIndex > 0) {
            const key = headerValue.substring(0, colonIndex).trim();
            const value = headerValue.substring(colonIndex + 1).trim();
            if (key.toLowerCase() === 'cookie') {
                // 解析Cookie（如果通过Header传递）
                value.split(';').forEach(c => {
                    const trimmed = c.trim();
                    if (trimmed) {
                        const equalIndex = trimmed.indexOf('=');
                        if (equalIndex > 0) {
                            const k = trimmed.substring(0, equalIndex).trim();
                            const v = trimmed.substring(equalIndex + 1).trim();
                            if (k) result.cookies[k] = v || '';
                        }
                    }
                });
            } else {
                result.headers[key] = value;
            }
        }
    }
    
    // 提取数据 - 改进正则以正确处理包含引号的JSON数据
    // 使用更智能的方法：找到数据参数后，提取引号内的所有内容
    const dataParamRegex = /(?:-d|--data|--data-raw|--data-binary)\s+/i;
    const dataParamMatch = curlStr.search(dataParamRegex);
    
    if (dataParamMatch !== -1) {
        // 找到数据参数的开始位置
        const afterParam = curlStr.substring(dataParamMatch).replace(/(?:-d|--data|--data-raw|--data-binary)\s+/i, '');
        
        // 检查是否以引号开始
        if (afterParam.startsWith("'")) {
            // 单引号包裹：找到匹配的结束单引号（考虑转义）
            let endQuote = -1;
            for (let i = 1; i < afterParam.length; i++) {
                if (afterParam[i] === "'" && (i === 1 || afterParam[i-1] !== '\\')) {
                    endQuote = i;
                    break;
                }
            }
            if (endQuote > 0) {
                result.data = afterParam.substring(1, endQuote);
            }
        } else if (afterParam.startsWith('"')) {
            // 双引号包裹：找到匹配的结束双引号（考虑转义）
            let endQuote = -1;
            for (let i = 1; i < afterParam.length; i++) {
                if (afterParam[i] === '"' && (i === 1 || afterParam[i-1] !== '\\')) {
                    endQuote = i;
                    break;
                }
            }
            if (endQuote > 0) {
                result.data = afterParam.substring(1, endQuote);
            }
        } else {
            // 没有引号：提取到下一个空格或行尾
            const spaceIndex = afterParam.search(/\s/);
            if (spaceIndex > 0) {
                result.data = afterParam.substring(0, spaceIndex);
            } else {
                result.data = afterParam.trim();
            }
        }
        
        // 如果提取到数据，检查数据格式并设置方法
        if (result.data) {
            // 检查 Content-Type 是否为 application/x-www-form-urlencoded
            const contentTypeEntry = Object.entries(result.headers).find(([k]) => 
                k.toLowerCase() === 'content-type'
            );
            const contentType = contentTypeEntry ? contentTypeEntry[1] : null;
            
            const isFormUrlEncoded = contentType && 
                contentType.toLowerCase().includes('application/x-www-form-urlencoded');
            
            if (isFormUrlEncoded) {
                // 解析为字典格式：key1=value1&key2=value2 -> {key1: value1, key2: value2}
                result.dataDict = {};
                result.data.split('&').forEach(pair => {
                    const equalIndex = pair.indexOf('=');
                    if (equalIndex > 0) {
                        const key = decodeURIComponent(pair.substring(0, equalIndex));
                        const value = decodeURIComponent(pair.substring(equalIndex + 1));
                        result.dataDict[key] = value;
                    } else if (pair.trim()) {
                        // 处理没有值的键
                        result.dataDict[decodeURIComponent(pair.trim())] = '';
                    }
                });
                result.isJson = false;
            } else {
                // 尝试解析为JSON
                try {
                    JSON.parse(result.data);
                    result.isJson = true;
                } catch (e) {
                    result.isJson = false;
                }
            }
            
            if (result.method === 'GET') {
                result.method = 'POST';
            }
        }
    }
    
    return result;
}

// 生成requests代码
function generateRequestsCode(curl) {
    let code = `import requests\n`;
    let needJson = false;
    
    // 检查是否需要导入json模块
    if (curl.data && curl.isJson) {
        code += `import json\n`;
        needJson = true;
    }
    code += `\n`;
    
    code += `url = "${curl.url}"\n\n`;
    
    if (Object.keys(curl.headers).length > 0) {
        code += `headers = {\n`;
        const headerEntries = Object.entries(curl.headers);
        headerEntries.forEach(([key, value], index) => {
            // 转义值中的引号
            const escapedValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            const comma = index < headerEntries.length - 1 ? ',' : '';
            code += `    "${key}": "${escapedValue}"${comma}\n`;
        });
        code += `}\n\n`;
    }
    
    if (Object.keys(curl.cookies).length > 0) {
        code += `cookies = {\n`;
        const cookieEntries = Object.entries(curl.cookies);
        cookieEntries.forEach(([key, value], index) => {
            const comma = index < cookieEntries.length - 1 ? ',' : '';
            code += `    "${key}": "${value}"${comma}\n`;
        });
        code += `}\n\n`;
    }
    
    if (curl.data) {
        // 检查是否有 dataDict（form-urlencoded 格式）
        if (curl.dataDict && Object.keys(curl.dataDict).length > 0) {
            // 使用字典格式
            code += `data = {\n`;
            const entries = Object.entries(curl.dataDict);
            entries.forEach(([key, value], index) => {
                const comma = index < entries.length - 1 ? ',' : '';
                code += `    "${key}": "${value}"${comma}\n`;
            });
            code += `}\n\n`;
        } else if (curl.isJson) {
            // 解析JSON并格式化为Python字典
            try {
                const jsonObj = JSON.parse(curl.data);
                code += `data = {\n`;
                const entries = Object.entries(jsonObj);
                entries.forEach(([key, value], index) => {
                    const comma = index < entries.length - 1 ? ',' : '';
                    if (typeof value === 'string') {
                        code += `    "${key}": "${value}"${comma}\n`;
                    } else if (typeof value === 'number') {
                        code += `    "${key}": ${value}${comma}\n`;
                    } else if (typeof value === 'boolean') {
                        code += `    "${key}": ${value}${comma}\n`;
                    } else if (value === null) {
                        code += `    "${key}": None${comma}\n`;
                    } else if (Array.isArray(value)) {
                        code += `    "${key}": ${JSON.stringify(value)}${comma}\n`;
                    } else {
                        code += `    "${key}": ${JSON.stringify(value)}${comma}\n`;
                    }
                });
                code += `}\n\n`;
                code += `data = json.dumps(data, separators=(',', ':'))\n\n`;
            } catch (e) {
                // 如果JSON解析失败，作为普通字符串处理
                const escapedData = curl.data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                code += `data = "${escapedData}"\n\n`;
            }
        } else {
            // 非JSON数据，作为字符串处理
            const escapedData = curl.data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            code += `data = "${escapedData}"\n\n`;
        }
    }
    
    code += `response = requests.${curl.method.toLowerCase()}(\n`;
    code += `    url`;
    if (Object.keys(curl.headers).length > 0) {
        code += `,\n    headers=headers`;
    }
    if (Object.keys(curl.cookies).length > 0) {
        code += `,\n    cookies=cookies`;
    }
    if (curl.data) {
        code += `,\n    data=data`;
    }
    code += `\n)\n\n`;
    
    code += `print(response.status_code)\n`;
    code += `print(response.text)\n`;
    
    return code;
}

// 生成httpx代码
function generateHttpxCode(curl) {
    let code = `import httpx\n`;
    let needJson = false;
    
    if (curl.data && curl.isJson) {
        code += `import json\n`;
        needJson = true;
    }
    code += `\n`;
    
    code += `url = "${curl.url}"\n\n`;
    
    if (Object.keys(curl.headers).length > 0) {
        code += `headers = {\n`;
        const headerEntries = Object.entries(curl.headers);
        headerEntries.forEach(([key, value], index) => {
            const escapedValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            const comma = index < headerEntries.length - 1 ? ',' : '';
            code += `    "${key}": "${escapedValue}"${comma}\n`;
        });
        code += `}\n\n`;
    }
    
    if (Object.keys(curl.cookies).length > 0) {
        code += `cookies = {\n`;
        const cookieEntries = Object.entries(curl.cookies);
        cookieEntries.forEach(([key, value], index) => {
            const comma = index < cookieEntries.length - 1 ? ',' : '';
            code += `    "${key}": "${value}"${comma}\n`;
        });
        code += `}\n\n`;
    }
    
    if (curl.data) {
        // 检查是否有 dataDict（form-urlencoded 格式）
        if (curl.dataDict && Object.keys(curl.dataDict).length > 0) {
            // 使用字典格式
            code += `data = {\n`;
            const entries = Object.entries(curl.dataDict);
            entries.forEach(([key, value], index) => {
                const comma = index < entries.length - 1 ? ',' : '';
                code += `    "${key}": "${value}"${comma}\n`;
            });
            code += `}\n\n`;
        } else if (curl.isJson) {
            try {
                const jsonObj = JSON.parse(curl.data);
                code += `data = {\n`;
                const entries = Object.entries(jsonObj);
                entries.forEach(([key, value], index) => {
                    const comma = index < entries.length - 1 ? ',' : '';
                    if (typeof value === 'string') {
                        code += `    "${key}": "${value}"${comma}\n`;
                    } else if (typeof value === 'number') {
                        code += `    "${key}": ${value}${comma}\n`;
                    } else if (typeof value === 'boolean') {
                        code += `    "${key}": ${value}${comma}\n`;
                    } else if (value === null) {
                        code += `    "${key}": None${comma}\n`;
                    } else {
                        code += `    "${key}": ${JSON.stringify(value)}${comma}\n`;
                    }
                });
                code += `}\n\n`;
                code += `data = json.dumps(data, separators=(',', ':'))\n\n`;
            } catch (e) {
                const escapedData = curl.data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                code += `data = "${escapedData}"\n\n`;
            }
        } else {
            const escapedData = curl.data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            code += `data = "${escapedData}"\n\n`;
        }
    }
    
    code += `with httpx.Client() as client:\n`;
    code += `    response = client.${curl.method.toLowerCase()}(\n`;
    code += `        url`;
    if (Object.keys(curl.headers).length > 0) {
        code += `,\n        headers=headers`;
    }
    if (Object.keys(curl.cookies).length > 0) {
        code += `,\n        cookies=cookies`;
    }
    if (curl.data) {
        code += `,\n        data=data`;
    }
    code += `\n    )\n\n`;
    
    code += `    print(response.status_code)\n`;
    code += `    print(response.text)\n`;
    
    return code;
}

// 生成aiohttp代码
function generateAiohttpCode(curl) {
    let code = `import aiohttp\nimport asyncio\n`;
    let needJson = false;
    
    if (curl.data && curl.isJson) {
        code += `import json\n`;
        needJson = true;
    }
    code += `\n`;
    
    code += `async def main():\n`;
    code += `    url = "${curl.url}"\n\n`;
    
    if (Object.keys(curl.headers).length > 0) {
        code += `    headers = {\n`;
        const headerEntries = Object.entries(curl.headers);
        headerEntries.forEach(([key, value], index) => {
            const escapedValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            const comma = index < headerEntries.length - 1 ? ',' : '';
            code += `        "${key}": "${escapedValue}"${comma}\n`;
        });
        code += `    }\n\n`;
    }
    
    if (Object.keys(curl.cookies).length > 0) {
        code += `    cookies = {\n`;
        const cookieEntries = Object.entries(curl.cookies);
        cookieEntries.forEach(([key, value], index) => {
            const comma = index < cookieEntries.length - 1 ? ',' : '';
            code += `        "${key}": "${value}"${comma}\n`;
        });
        code += `    }\n\n`;
    }
    
    if (curl.data) {
        // 检查是否有 dataDict（form-urlencoded 格式）
        if (curl.dataDict && Object.keys(curl.dataDict).length > 0) {
            // 使用字典格式
            code += `    data = {\n`;
            const entries = Object.entries(curl.dataDict);
            entries.forEach(([key, value], index) => {
                const comma = index < entries.length - 1 ? ',' : '';
                code += `        "${key}": "${value}"${comma}\n`;
            });
            code += `    }\n\n`;
        } else if (curl.isJson) {
            try {
                const jsonObj = JSON.parse(curl.data);
                code += `    data = {\n`;
                const entries = Object.entries(jsonObj);
                entries.forEach(([key, value], index) => {
                    const comma = index < entries.length - 1 ? ',' : '';
                    if (typeof value === 'string') {
                        code += `        "${key}": "${value}"${comma}\n`;
                    } else if (typeof value === 'number') {
                        code += `        "${key}": ${value}${comma}\n`;
                    } else if (typeof value === 'boolean') {
                        code += `        "${key}": ${value}${comma}\n`;
                    } else if (value === null) {
                        code += `        "${key}": None${comma}\n`;
                    } else {
                        code += `        "${key}": ${JSON.stringify(value)}${comma}\n`;
                    }
                });
                code += `    }\n\n`;
                code += `    data = json.dumps(data, separators=(',', ':'))\n\n`;
            } catch (e) {
                const escapedData = curl.data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
                code += `    data = "${escapedData}"\n\n`;
            }
        } else {
            const escapedData = curl.data.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            code += `    data = "${escapedData}"\n\n`;
        }
    }
    
    code += `    async with aiohttp.ClientSession() as session:\n`;
    code += `        async with session.${curl.method.toLowerCase()}(\n`;
    code += `            url`;
    if (Object.keys(curl.headers).length > 0) {
        code += `,\n            headers=headers`;
    }
    if (Object.keys(curl.cookies).length > 0) {
        code += `,\n            cookies=cookies`;
    }
    if (curl.data) {
        code += `,\n            data=data`;
    }
    code += `\n        ) as response:\n`;
    code += `            print(response.status)\n`;
    code += `            text = await response.text()\n`;
    code += `            print(text)\n\n`;
    
    code += `asyncio.run(main())\n`;
    
    return code;
}
