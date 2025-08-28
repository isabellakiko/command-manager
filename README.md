# 命令管理工具 v3.0 - Command Manager

一个现代化的Web端命令管理工具，专为开发者和系统管理员设计。

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ 核心特性

### 🆕 v3.0 新特性
- **📁 文件夹分类系统** - 支持创建、重命名、删除文件夹，命令分类管理
- **📝 多行命令支持** - 使用textarea替代input，完美支持多行复杂命令
- **🔍 实时搜索功能** - 快速搜索命令名称和内容
- **🎨 现代化UI设计** - 全新的界面设计，提升用户体验
- **📱 完全响应式** - 桌面端、平板、手机完美适配
- **🌙 深色主题支持** - 亮色/暗色主题无缝切换

### 🔧 功能亮点
- **拖拽排序** - 支持命令卡片拖拽重新排序
- **文件夹间移动** - 拖拽命令到文件夹进行分类
- **智能编辑** - 完善的多行编辑体验，支持Tab缩进
- **使用统计** - 自动记录命令使用次数和时间
- **数据导入导出** - JSON格式数据备份和恢复
- **键盘快捷键** - 丰富的快捷键操作，提升效率

## 🚀 快速开始

### 在线使用
直接在浏览器中打开 `index.html` 即可使用，无需任何配置。

### 本地部署
```bash
# 克隆仓库
git clone https://github.com/你的用户名/command-manager.git

# 进入目录
cd command-manager

# 使用任意HTTP服务器启动
python -m http.server 8080
# 或
npx serve .
```

访问 `http://localhost:8080` 即可使用。

## 📖 使用说明

### 基本操作
1. **添加命令**：在顶部输入框中输入命令名称和内容，选择目标文件夹
2. **搜索命令**：使用顶部搜索框或按 `Ctrl+K`
3. **编辑命令**：点击命令卡片的"编辑"按钮
4. **复制命令**：点击"复制"按钮，命令自动复制到剪贴板
5. **管理文件夹**：点击侧边栏的"➕"按钮创建文件夹

### 快捷键
- `Ctrl+K` - 快速搜索
- `Ctrl+N` - 新建命令
- `Ctrl+Shift+N` - 新建文件夹
- `Ctrl+Enter` - 添加/保存命令
- `Escape` - 取消编辑/关闭弹窗

### 高级功能
- **拖拽操作**：拖拽命令卡片重新排序或移动到其他文件夹
- **批量管理**：导入/导出JSON文件进行批量管理
- **主题切换**：点击底部主题按钮切换亮色/暗色模式

## 🛠️ 技术栈

- **前端**：原生 HTML5 + CSS3 + JavaScript ES6+
- **存储**：localStorage 本地存储
- **架构**：ES6 Class + 模块化设计
- **样式**：CSS变量 + Flexbox/Grid布局
- **兼容性**：现代浏览器 (Chrome, Firefox, Safari, Edge)

## 📦 项目结构

```
command-manager/
├── index.html          # 主页面文件
├── command.css         # 样式文件
├── command.js          # 核心逻辑
└── README.md          # 项目说明
```

## 🎯 版本历史

### v3.0.0 (2025-08-05)
- ✅ 全新UI设计，现代化界面
- ✅ 文件夹分类系统
- ✅ 多行命令编辑支持
- ✅ 实时搜索功能
- ✅ 拖拽排序和文件夹移动
- ✅ 完全响应式设计
- ✅ 深色主题支持

### v2.0.0
- 基础命令管理功能
- 本地存储和导入导出
- 主题切换系统

### v1.0.0
- 初始版本发布

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

**陈澄 (Stephen Chan)**
- GitHub: [@你的GitHub用户名](https://github.com/你的GitHub用户名)
- Email: your-email@example.com

---

如果这个工具对你有帮助，请给个 ⭐️ Star 支持一下！