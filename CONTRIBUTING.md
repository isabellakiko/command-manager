# 贡献指南 (Contributing Guide)

感谢你对命令管理工具项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 开发新功能

## 🚀 快速开始

### 环境准备

1. **克隆仓库**
   ```bash
   git clone https://github.com/isabellakiko/command-manager.git
   cd command-manager
   ```

2. **启动开发服务器**
   ```bash
   # 方法1: 使用Python
   python -m http.server 8000
   
   # 方法2: 使用Node.js
   npx serve .
   
   # 方法3: 使用VS Code Live Server插件
   ```

3. **在浏览器中打开**
   访问 `http://localhost:8000`

## 🐛 报告问题

在报告问题之前，请：

1. **搜索现有问题**: 检查 [Issues](https://github.com/isabellakiko/command-manager/issues) 页面，确保问题尚未被报告
2. **使用最新版本**: 确保你使用的是最新版本的代码
3. **提供详细信息**: 包括复现步骤、预期行为、实际行为、浏览器版本等

### Bug报告模板

```markdown
## Bug描述
简洁清晰地描述遇到的问题

## 复现步骤
1. 打开应用
2. 点击...
3. 输入...
4. 观察到错误

## 预期行为
描述你期望发生的行为

## 实际行为
描述实际发生的行为

## 环境信息
- 操作系统: [如 macOS 12.0]
- 浏览器: [如 Chrome 98.0]
- 设备类型: [如 桌面端/移动端]

## 截图
如果适用，请添加截图来说明问题

## 附加信息
任何其他相关信息
```

## 💡 功能建议

我们欢迎新功能建议！请：

1. **检查现有建议**: 确保功能尚未被建议
2. **详细描述**: 说明功能的用途和价值
3. **考虑实现方式**: 如果可能，提供实现思路

### 功能建议模板

```markdown
## 功能描述
清晰描述建议的功能

## 使用场景
描述该功能在什么情况下会被使用

## 解决的问题
说明该功能解决了什么痛点

## 实现建议
如果有想法，请描述可能的实现方式

## 替代方案
是否考虑过其他实现方式
```

## 🔧 代码贡献

### 开发流程

1. **Fork 仓库**
   点击仓库页面右上角的 "Fork" 按钮

2. **克隆你的Fork**
   ```bash
   git clone https://github.com/your-username/command-manager.git
   cd command-manager
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-fix-name
   ```

4. **进行开发**
   - 遵循项目的代码风格
   - 添加必要的注释
   - 确保功能正常工作

5. **测试你的更改**
   - 在不同浏览器中测试
   - 测试响应式布局
   - 验证所有功能正常

6. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

7. **推送到你的Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建Pull Request**
   在GitHub上创建从你的分支到主仓库的Pull Request

### 代码风格指南

#### HTML
- 使用语义化标签
- 保持良好的缩进（2个空格）
- 添加必要的ARIA属性提升可访问性

```html
<div class="command-card" role="article">
    <h3 class="command-title">命令标题</h3>
    <p class="command-description">命令描述</p>
</div>
```

#### CSS
- 使用CSS变量系统
- 遵循BEM命名规范
- 保持样式模块化

```css
.command-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
}

.command-card__title {
    color: var(--text-primary);
}

.command-card--highlighted {
    border: 2px solid var(--primary-color);
}
```

#### JavaScript
- 使用ES6+语法
- 保持函数单一职责
- 添加必要的错误处理
- 使用有意义的变量名

```javascript
class CommandManager {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }
    
    // 清晰的方法命名和注释
    addCommand(commandData) {
        try {
            // 功能实现
        } catch (error) {
            this.handleError(error);
        }
    }
}
```

### 提交消息规范

使用语义化的提交消息：

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建或辅助工具的变动

示例：
```bash
git commit -m "feat: 添加命令搜索功能"
git commit -m "fix: 修复移动端复制按钮样式问题"
git commit -m "docs: 更新README安装说明"
```

## 📝 文档贡献

文档同样重要！你可以：

- 修正拼写错误和语法问题
- 改进现有文档的清晰度
- 添加使用示例
- 翻译文档到其他语言

## 🎯 开发重点

### 当前优先级

1. **核心功能完善**
   - 命令管理的基础功能
   - 数据导入导出优化
   - 用户体验改进

2. **新功能开发**
   - 命令搜索和过滤
   - 命令分类系统
   - 批量操作功能

3. **性能和兼容性**
   - 移动端体验优化
   - 浏览器兼容性改进
   - 加载性能优化

### 技术债务

- 代码模块化重构
- 测试覆盖率提升
- 错误处理完善
- 国际化支持

## 🤝 社区准则

### 行为准则

- 保持友善和专业
- 尊重不同观点
- 建设性地提供反馈
- 帮助新贡献者

### 沟通方式

- **Issues**: 用于Bug报告和功能建议
- **Pull Requests**: 用于代码讨论
- **Email**: kaylonchan@gmail.com（紧急问题）

## 🏷️ 版本发布

### 版本号规则

遵循语义化版本（Semantic Versioning）：

- `MAJOR`: 不兼容的API修改
- `MINOR`: 向后兼容的功能性新增
- `PATCH`: 向后兼容的问题修正

### 发布流程

1. 更新版本号和CHANGELOG
2. 创建Release分支
3. 最终测试
4. 合并到main分支
5. 创建Git标签
6. 发布GitHub Release

## 📞 获取帮助

如果你有任何问题：

1. **查看文档**: README.md和相关文档
2. **搜索Issues**: 查看是否有类似问题
3. **创建Issue**: 详细描述你的问题
4. **联系维护者**: kaylonchan@gmail.com

## 🙏 致谢

感谢每一位贡献者的付出！你的贡献让这个项目变得更好。

---

再次感谢你的贡献！期待与你一起改进命令管理工具。