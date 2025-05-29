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