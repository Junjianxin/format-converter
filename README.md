# 🚀 全能格式转换工具

一款功能强大的在线开发工具集，专为**爬虫开发**、**JS逆向**、**数据分析**等场景设计。使用原生 HTML/CSS/JavaScript 实现，无需复杂框架，可直接在浏览器中运行。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

## 📸 预览

> 支持深色/浅色主题切换，响应式设计适配各种设备

## ✨ 功能特点

### 📝 编解码工具 (7个)

| 工具 | 说明 |
|------|------|
| **JSON格式化** | 美化或压缩JSON数据，支持语法校验 |
| **Base64编解码** | 文本/文件的Base64编码与解码 |
| **URL编解码** | URL字符串编码解码 (`%E4%BD%A0` ↔ `你`) |
| **Unicode转义** | Unicode转义字符转换 (`\u4f60\u597d` ↔ `你好`) |
| **Hex编解码** | 十六进制与字符串互转，支持多种格式 |
| **JWT解码** | 解析JWT Token的Header和Payload |
| **HTML编码** | HTML实体编码与解码 (`<` ↔ `&lt;`) |

### 🔐 加解密工具 (4个)

| 工具 | 说明 |
|------|------|
| **MD5加密** | MD5摘要计算，支持32位/16位大小写 |
| **SHA/HMAC哈希** | SHA-1/256/384/512散列，支持HMAC签名 |
| **AES/DES加密** | 对称加密，支持AES/DES/RC4，CBC/ECB模式 |
| **RSA非对称** | RSA公钥加密/私钥解密，支持密钥对生成 |
| **SM2/3/4** | SM2/3/4加解密 |

### 🎨 格式化工具 (4个)

| 工具 | 说明 |
|------|------|
| **HTML格式化** | HTML代码美化与压缩 |
| **XML格式化** | XML数据格式化与压缩 |
| **SQL格式化** | SQL语句格式化，支持MySQL/PostgreSQL |
| **JS压缩** | JavaScript代码压缩，去除注释和空白 |

### 🔄 转换工具 (6个)

| 工具 | 说明 |
|------|------|
| **时间戳转换** | 时间戳与日期互转，支持秒/毫秒 |
| **进制转换** | 2/8/10/16进制互转，支持批量 |
| **CSV转JSON** | CSV数据转JSON，支持自定义分隔符 |
| **ASCII转换** | ASCII码与字符互转，支持多种进制 |
| **变量名转换** | 驼峰/下划线/中划线等命名风格互转 |
| **cURL转Python** | cURL命令转requests/httpx/aiohttp代码 |

### 🕷️ 爬虫工具 (6个)

| 工具 | 说明 |
|------|------|
| **Cookie解析** | Cookie字符串与JSON互转 |
| **Headers解析** | HTTP Headers解析，支持生成cURL命令 |
| **正则测试** | 正则表达式测试，显示匹配位置和捕获组 |
| **JSON Path** | JSONPath表达式提取数据 |
| **代码反混淆** | 字符串反转、CharCode还原、eval提取等 |
| **HTML渲染** | HTML代码实时渲染预览，支持沙箱模式 |

### 🛠️ 生成工具 (4个)

| 工具 | 说明 |
|------|------|
| **UUID生成** | UUID v1/v4生成，支持批量和大小写 |
| **随机字符串** | 自定义长度和字符集的随机字符串 |
| **二维码生成** | 文本转二维码，支持多种尺寸和下载 |
| **Base64转图片** | Base64字符串预览为图片并下载 |

### 📋 其他工具 (2个)

| 工具 | 说明 |
|------|------|
| **文本比对** | 逐行比对两段文本，显示差异和相似度 |
| **Crontab解析** | Cron表达式解析，显示执行时间说明 |

## 🎯 特色功能

### 快捷键支持
- `Ctrl + Enter` - 执行转换
- `Ctrl + K` - 聚焦搜索框
- `Ctrl + Shift + C` - 复制结果
- `Ctrl + Shift + X` - 交换输入输出

### 界面特性
- 🌓 **深色/浅色主题** - 一键切换，保护眼睛
- 📱 **响应式设计** - 完美适配手机和桌面
- 🔍 **工具搜索** - 快速定位所需工具
- 📂 **分类导航** - 工具按功能分类，清晰易找
- 📜 **历史记录** - 自动保存转换历史，点击恢复
- 📁 **文件拖拽** - 支持拖拽文件上传
- 📊 **实时统计** - 显示字符数和行数
- ⇅ **输入输出交换** - 一键交换方便反向操作
- 📥 **结果下载** - 转换结果可下载为文件

## 📦 快速开始

### 在线使用

直接访问 GitHub Pages 部署的在线版本（如果已部署）

### 本地运行

```bash
# 克隆项目
git clone https://github.com/your-username/format-converter.git

# 进入目录
cd format-converter

# 直接打开 index.html 或使用本地服务器
# 方式1: 直接双击 index.html
# 方式2: 使用 VS Code Live Server 插件
# 方式3: 使用 Python 简易服务器
python -m http.server 8080
```

### 部署到服务器

本项目为纯前端项目，无需后端环境：

1. 将所有文件上传到静态文件服务器（Nginx、Apache等）
2. 或部署到 GitHub Pages、Netlify、Vercel 等平台
3. 在浏览器中访问即可使用

## 📁 项目结构

```
format-converter/
├── index.html          # 主HTML文件
├── css/
│   ├── style.css       # 主样式文件
│   └── themes.css      # 主题变量
├── js/
│   ├── main.js         # 主逻辑和事件处理
│   ├── tools.js        # 工具函数实现
│   ├── ui.js           # UI增强功能
│   └── MD5.js          # MD5算法实现
└── README.md           # 项目说明
```

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 60+ |
| Firefox | 55+ |
| Safari | 11+ |
| Edge | 79+ |

## 🔧 技术栈

- **前端**: 原生 HTML5 + CSS3 + JavaScript (ES6+)
- **加密库**: [CryptoJS](https://github.com/brix/crypto-js) - AES/DES/SHA等加密算法
- **RSA库**: [JSEncrypt](https://github.com/travist/jsencrypt) - RSA加解密
- **无框架依赖**: 不依赖Vue/React等框架，轻量快速

## 📝 更新日志

### v2.0.0 (2025-01)
- ✨ 新增10个实用工具：UUID生成、随机字符串、二维码、文本比对、Crontab解析、ASCII转换、变量名转换、HTML编码、cURL转Python、HTML渲染
- 🎨 全新UI设计：分类导航、渐变按钮、卡片式历史记录
- 🔍 新增工具搜索功能
- ⌨️ 新增快捷键支持
- ⇅ 新增输入输出交换功能
- 📥 新增结果下载功能

### v1.0.0
- 🎉 首次发布
- 基础格式化和编解码功能
- 加密解密工具
- 深色/浅色主题

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证开源。

## 🙏 致谢

- [CryptoJS](https://github.com/brix/crypto-js) - 加密算法库
- [JSEncrypt](https://github.com/travist/jsencrypt) - RSA加密库
- [QR Server API](https://goqr.me/api/) - 二维码生成API

---

如果这个项目对你有帮助，欢迎 ⭐ Star 支持一下！
