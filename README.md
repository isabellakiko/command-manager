# 命令管理工具 (Command Manager)

> 🚀 一个简洁高效的Web端命令管理工具，专为开发者和系统管理员设计

[![GitHub license](https://img.shields.io/github/license/isabellakiko/command-manager)](https://github.com/isabellakiko/command-manager/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/isabellakiko/command-manager)](https://github.com/isabellakiko/command-manager/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/isabellakiko/command-manager)](https://github.com/isabellakiko/command-manager/issues)

## ✨ 特性

- 🏷️ **自定义命名**: 为每条命令添加自定义名称，快速识别用途
- 📋 **一键复制**: 支持现代剪贴板API，兼容多平台
- 💾 **本地存储**: 所有数据本地保存，确保隐私安全
- 🌙 **主题切换**: 支持深色/浅色模式，自动记忆偏好
- 📱 **响应式设计**: 完美适配桌面、平板、手机
- 📤 **导入导出**: JSON格式数据备份，支持跨设备同步
- 🔄 **重置功能**: 一键清空所有数据和设置
- ⌨️ **快捷键支持**: 提升操作效率
- 🎯 **零依赖**: 纯原生Web技术，无需额外框架

## 🎯 适用场景

### 开发者
- 管理常用的Git命令、npm脚本、测试命令
- 保存SSH连接字符串和服务器配置
- 存储部署和CI/CD相关命令
- 收藏调试和诊断工具命令

### 系统管理员
- 维护服务器管理命令库
- 收集网络诊断和监控脚本
- 管理数据备份和恢复命令
- 存储系统维护常用工具

## 🚀 快速开始

### 在线使用
直接访问 [Command Manager](https://isabellakiko.github.io/command-manager/) 即可开始使用。

### 本地部署
```bash
# 克隆仓库
git clone https://github.com/isabellakiko/command-manager.git

# 进入目录
cd command-manager

# 使用任意静态服务器运行
# 方法1: 使用Python
python -m http.server 8000

# 方法2: 使用Node.js
npx serve .

# 方法3: 使用VS Code Live Server插件
# 直接右键 index.html 选择 "Open with Live Server"
```

然后在浏览器中打开 `http://localhost:8000`

## 📖 使用指南

### 基本操作

1. **添加命令**
   - 在"命令名称"输入框中输入自定义名称（可选）
   - 在"命令内容"输入框中输入完整命令
   - 点击"添加命令"按钮或按回车键保存

2. **复制命令**
   - 点击命令卡片上的"复制"按钮
   - 命令将自动复制到剪贴板
   - 系统会显示复制成功提示

3. **管理命令**
   - 点击"删除"按钮移除单条命令
   - 使用"重置数据"清空所有命令和设置

4. **数据管理**
   - 点击"导出命令"下载JSON备份文件
   - 点击"导入命令"从JSON文件恢复数据

### 快捷键

- `Enter`: 在名称输入框中按回车跳转到命令输入框，在命令输入框中按回车添加命令
- `Ctrl+A`: 在命令输入框中全选内容
- `Esc`: 关闭帮助弹窗

### 主题切换

点击底部的月亮/太阳图标切换深色/浅色模式，系统会自动记忆你的偏好设置。

## 🛠️ 技术实现

### 技术栈
- **HTML5**: 语义化标记，提升可访问性
- **CSS3**: 
  - CSS变量系统，支持主题切换
  - Flexbox和Grid布局
  - 现代动画和过渡效果
  - 响应式媒体查询
- **JavaScript ES6+**:
  - 类语法，面向对象设计
  - 现代异步处理（async/await）
  - 本地存储API
  - 现代剪贴板API

### 核心特性

#### 剪贴板兼容性
```javascript
// 优先使用现代API
if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
} else {
    // 降级到传统方法
    fallbackCopyToClipboard(text);
}
```

#### 数据持久化
```javascript
// 使用localStorage保存数据
localStorage.setItem('commandManager_commands', JSON.stringify(commands));
```

#### 主题系统
```css
:root {
    --primary-color: #3498db;
    --bg-color: #f0f2f5;
}

body.dark-theme {
    --bg-color: #121212;
    --text-primary: #e0e0e0;
}
```

## 📁 项目结构

```
command-manager/
├── index.html          # 主页面文件
├── command.css         # 样式文件
├── command.js          # 核心逻辑
├── README.md           # 项目文档
├── LICENSE             # MIT许可证
└── screenshots/        # 项目截图
    ├── desktop.png
    ├── mobile.png
    └── dark-mode.png
```

## 🎨 界面预览

### 桌面端
![桌面端界面](screenshots/desktop.png)

### 移动端
![移动端界面](screenshots/mobile.png)

### 深色模式
![深色模式界面](screenshots/dark-mode.png)

## 🔒 隐私与安全

- ✅ **完全本地化**: 所有数据仅存储在浏览器本地
- ✅ **零网络传输**: 命令内容不会发送到任何服务器
- ✅ **用户控制**: 用户完全控制数据的导入导出
- ✅ **开源透明**: 代码完全开源，可审查安全性
- ⚠️ **敏感信息提醒**: 建议不要存储包含密码的命令

## 🌍 浏览器兼容性

| 浏览器 | 版本要求 | 现代剪贴板API | 完整功能支持 |
|--------|----------|---------------|--------------|
| Chrome | 67+ | ✅ | ✅ |
| Firefox | 67+ | ✅ | ✅ |
| Safari | 13.1+ | ✅ | ✅ |
| Edge | 79+ | ✅ | ✅ |
| 移动浏览器 | 现代版本 | ✅ | ✅ |

## 🤝 贡献指南

我们欢迎各种形式的贡献！

### 报告问题
在 [Issues](https://github.com/isabellakiko/command-manager/issues) 页面报告bug或提出新功能建议。

### 提交代码
1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发环境设置
```bash
# 克隆你的fork
git clone https://github.com/your-username/command-manager.git
cd command-manager

# 创建开发分支
git checkout -b feature/your-feature-name

# 启动开发服务器
python -m http.server 8000
```

## 📋 更新日志

### v2.0.0 (Latest)
- ✨ 新增自定义命名功能
- 🔄 添加重置数据功能
- 🎨 优化用户界面设计
- 📱 改进移动端体验
- 🐛 修复已知问题

### v1.0.0
- 🎉 初始版本发布
- 📋 基础命令管理功能
- 💾 本地存储支持
- 🌙 主题切换功能
- 📤 导入导出功能

## 🔮 未来计划

- [ ] PWA支持，支持离线使用和桌面安装
- [ ] 命令分类和标签系统
- [ ] 搜索和过滤功能
- [ ] 快捷键自定义
- [ ] 命令模板和参数化支持
- [ ] 团队协作和命令库共享
- [ ] 命令执行历史记录
- [ ] 批量操作功能

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源许可证。

## 👨‍💻 作者

**陈澄 (Stephen Chan)**
- GitHub: [@isabellakiko](https://github.com/isabellakiko)
- Email: kaylonchan@gmail.com
- 个人主页: [https://kaylonchan.com](https://kaylonchan.com)

## 🙏 致谢

感谢所有为这个项目贡献代码、报告问题、提出建议的开发者们！

如果这个项目对你有帮助，请考虑给它一个 ⭐️！

---

<div align="center">
  <p>用 ❤️ 制作 | Made with ❤️ by Stephen Chan</p>
</div>