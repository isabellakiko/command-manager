/**
 * 命令管理工具 - 主要逻辑类
 * 
 * 功能特性：
 * - 命令的增删改查操作
 * - 自定义命名功能
 * - 本地数据持久化存储
 * - 跨平台剪贴板复制支持
 * - 主题切换系统
 * - 数据导入导出功能
 * - 重置数据功能
 * 
 * @class CommandManager
 * @author 陈澄 (Stephen Chan)
 * @version 2.0.0
 * @since 1.0.0
 */
class CommandManager {
    /**
     * 构造函数 - 初始化命令管理器
     * 初始化顺序：DOM元素 -> 加载数据 -> 绑定事件 -> 初始化主题 -> 更新显示
     */
    constructor() {
        // 数据存储
        this.commands = [];  // 命令列表
        this.storageKey = 'commandManager_commands';  // 本地存储键名
        this.themeKey = 'commandManager_theme';  // 主题存储键名
        
        // 初始化流程
        this.initElements();
        this.loadData();
        this.bindEvents();
        this.initTheme();
        this.updateDisplay();
    }

    /**
     * 初始化DOM元素引用
     * 获取页面中所有需要操作的DOM元素，并存储在elements对象中
     * 这样做的好处：
     * 1. 一次获取，多次使用，提高性能
     * 2. 集中管理，便于维护
     * 3. 避免重复查找，减少DOM操作
     */
    initElements() {
        this.elements = {
            commandNameInput: document.getElementById('commandNameInput'),
            commandInput: document.getElementById('commandInput'),
            addCommandBtn: document.getElementById('addCommandBtn'),
            commandsList: document.getElementById('commandsList'),
            commandsCount: document.getElementById('commandsCount'),
            emptyState: document.getElementById('emptyState'),
            resetBtn: document.getElementById('resetBtn'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            themeBtn: document.getElementById('themeBtn'),
            helpBtn: document.getElementById('helpBtn'),
            helpModal: document.getElementById('helpModal'),
            closeHelpBtn: document.getElementById('closeHelpBtn'),
            notification: document.getElementById('notification'),
            fileInput: document.getElementById('fileInput')
        };
    }

    /**
     * 绑定所有事件监听器
     * 包括：
     * - 命令添加相关事件
     * - 快捷操作按钮事件
     * - 主题切换事件
     * - 帮助弹窗事件
     * - 文件导入事件
     * - 全局键盘事件
     */
    bindEvents() {
        // 添加命令
        this.elements.addCommandBtn.addEventListener('click', () => this.addCommand());
        this.elements.commandInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCommand();
            }
        });
        this.elements.commandNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.commandInput.focus();
            }
        });

        // 快捷操作
        this.elements.resetBtn.addEventListener('click', () => this.resetAllData());
        this.elements.exportBtn.addEventListener('click', () => this.exportCommands());
        this.elements.importBtn.addEventListener('click', () => this.importCommands());

        // 主题切换
        this.elements.themeBtn.addEventListener('click', () => this.toggleTheme());

        // 帮助弹窗
        this.elements.helpBtn.addEventListener('click', () => this.showHelp());
        this.elements.closeHelpBtn.addEventListener('click', () => this.hideHelp());
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) {
                this.hideHelp();
            }
        });

        // 文件导入
        this.elements.fileInput.addEventListener('change', (e) => this.handleFileImport(e));

        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // 编辑模式键盘事件（事件委托）
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.classList.contains('command-text-edit')) {
                    const commandCard = e.target.closest('.command-card');
                    if (commandCard) {
                        const commandId = commandCard.getAttribute('data-command-id');
                        this.saveEdit(commandId);
                    }
                }
            }
        });
    }

    /**
     * 添加新命令
     * 功能：
     * 1. 验证输入内容的合法性
     * 2. 检查命令是否已存在（防止重复）
     * 3. 创建命令对象并添加到列表开头
     * 4. 清空输入框、保存数据、更新显示
     */
    addCommand() {
        const commandText = this.elements.commandInput.value.trim();
        const commandName = this.elements.commandNameInput.value.trim();
        
        if (!commandText) {
            this.showNotification('请输入命令内容', 'error');
            return;
        }

        // 检查是否已存在相同命令
        if (this.commands.some(cmd => cmd.text === commandText)) {
            this.showNotification('该命令已存在', 'error');
            return;
        }

        const command = {
            id: Date.now().toString(),
            name: commandName || null,
            text: commandText,
            createTime: new Date().toLocaleString('zh-CN'),
            copyCount: 0
        };

        this.commands.unshift(command); // 添加到开头
        this.elements.commandInput.value = '';
        this.elements.commandNameInput.value = '';
        this.saveData();
        this.updateDisplay();
        this.showNotification(`命令${commandName ? ` "${commandName}" ` : ''}添加成功`);
    }

    /**
     * 删除指定命令
     * @param {string} commandId - 命令的唯一ID
     */
    deleteCommand(commandId) {
        const index = this.commands.findIndex(cmd => cmd.id === commandId);
        if (index !== -1) {
            this.commands.splice(index, 1);
            this.saveData();
            this.updateDisplay();
            this.showNotification('命令已删除');
        }
    }

    /**
     * 切换命令编辑模式
     * 点击编辑按钮时切换显示/编辑状态，按钮文字也相应变化
     * @param {string} commandId - 命令的唯一ID
     */
    toggleEditMode(commandId) {
        const commandCard = document.querySelector(`[data-command-id="${commandId}"]`);
        if (!commandCard) return;

        const editBtn = commandCard.querySelector('.edit-btn');
        const nameDisplay = commandCard.querySelector('.command-name-display');
        const nameEdit = commandCard.querySelector('.command-name-edit');
        const textDisplay = commandCard.querySelector('.command-text-display');
        const textEdit = commandCard.querySelector('.command-text-edit');

        const isEditing = textEdit.style.display !== 'none';

        if (isEditing) {
            // 保存编辑
            this.saveEdit(commandId);
        } else {
            // 进入编辑模式
            nameDisplay.style.display = 'none';
            nameEdit.style.display = 'block';
            textDisplay.style.display = 'none';
            textEdit.style.display = 'block';
            
            editBtn.innerHTML = '<span class="btn-icon">💾</span><span class="btn-text">保存</span>';
            editBtn.classList.add('btn-success');
            editBtn.classList.remove('btn-secondary');
            
            // 聚焦到命令文本输入框
            textEdit.focus();
            textEdit.select();
        }
    }

    /**
     * 保存编辑后的命令
     * @param {string} commandId - 命令的唯一ID
     */
    saveEdit(commandId) {
        const commandCard = document.querySelector(`[data-command-id="${commandId}"]`);
        if (!commandCard) return;

        const nameEdit = commandCard.querySelector('.command-name-edit');
        const textEdit = commandCard.querySelector('.command-text-edit');
        
        const newName = nameEdit.value.trim();
        const newText = textEdit.value.trim();

        if (!newText) {
            this.showNotification('命令内容不能为空', 'error');
            return;
        }

        // 检查是否与其他命令重复（排除自己）
        const existingCommand = this.commands.find(cmd => cmd.id !== commandId && cmd.text === newText);
        if (existingCommand) {
            this.showNotification('该命令已存在', 'error');
            return;
        }

        // 更新命令数据
        const command = this.commands.find(cmd => cmd.id === commandId);
        if (command) {
            command.name = newName || null;
            command.text = newText;
            
            this.saveData();
            this.updateDisplay();
            this.showNotification(`命令${newName ? ` "${newName}" ` : ''}已更新`);
        }
    }

    /**
     * 复制命令到剪贴板
     * 支持现代剪贴板API和传统方法的降级兼容
     * @param {string} commandId - 命令的唯一ID
     */
    async copyCommand(commandId) {
        const command = this.commands.find(cmd => cmd.id === commandId);
        if (!command) return;

        try {
            // 尝试使用现代剪贴板API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(command.text);
            } else {
                // 降级到传统方法
                this.fallbackCopyToClipboard(command.text);
            }

            // 更新复制次数
            command.copyCount++;
            this.saveData();
            this.updateDisplay();
            this.showNotification(`已复制: ${command.text.substring(0, 30)}${command.text.length > 30 ? '...' : ''}`);
            
            // 视觉反馈
            this.showCopyFeedback(commandId);
        } catch (err) {
            console.error('复制失败:', err);
            this.showNotification('复制失败，请手动选择复制', 'error');
        }
    }

    /**
     * 降级复制方法（兼容旧浏览器）
     * 当现代剪贴板API不可用时使用传统的document.execCommand方法
     * @param {string} text - 要复制的文本内容
     */
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            throw new Error('Fallback copy failed');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * 显示复制成功的视觉反馈
     * 短暂改变复制按钮的文本和样式，给用户明确的操作反馈
     * @param {string} commandId - 命令的唯一ID
     */
    showCopyFeedback(commandId) {
        const copyBtn = document.querySelector(`[data-command-id="${commandId}"] .copy-btn`);
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">已复制</span>';
            copyBtn.classList.add('copying');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copying');
            }, 1000);
        }
    }

    /**
     * 重置所有数据
     * 功能：
     * 1. 清空所有命令数据
     * 2. 清除本地存储中的所有相关数据
     * 3. 重置主题设置和欢迎标记
     * 注意：这是不可逆操作，需要用户确认
     */
    resetAllData() {
        if (this.commands.length === 0) {
            this.showNotification('没有数据需要重置', 'info');
            return;
        }

        if (confirm(`确定要重置所有数据吗？\n这将清空所有 ${this.commands.length} 条命令和相关设置，此操作不可撤销。`)) {
            this.commands = [];
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.themeKey);
            localStorage.removeItem('commandManager_hasShownWelcome');
            this.saveData();
            this.updateDisplay();
            this.showNotification('所有数据已重置');
        }
    }

    /**
     * 导出命令数据
     * 功能：
     * 1. 将所有命令数据序列化为JSON格式
     * 2. 创建下载链接并触发下载
     * 3. 文件名包含当前日期，便于区分版本
     */
    exportCommands() {
        if (this.commands.length === 0) {
            this.showNotification('没有命令可导出', 'info');
            return;
        }

        const exportData = {
            version: '1.0',
            exportTime: new Date().toISOString(),
            commands: this.commands
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `commands_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showNotification(`已导出 ${this.commands.length} 条命令`);
    }

    /**
     * 触发文件选择对话框导入命令
     * 这是一个入口方法，实际处理在handleFileImport中
     */
    importCommands() {
        this.elements.fileInput.click();
    }

    /**
     * 处理文件导入逐个
     * 功能：
     * 1. 读取用户选择的JSON文件
     * 2. 解析数据格式并验证合法性
     * 3. 合并命令数据，自动去重
     * 4. 更新本地存储和显示
     * @param {Event} event - 文件输入变化事件
     */
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!importData.commands || !Array.isArray(importData.commands)) {
                    throw new Error('无效的文件格式');
                }

                const importCount = importData.commands.length;
                let addedCount = 0;

                // 导入命令，避免重复
                importData.commands.forEach(cmd => {
                    if (cmd.text && !this.commands.some(existing => existing.text === cmd.text)) {
                        this.commands.push({
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                            name: cmd.name || null,
                            text: cmd.text,
                            createTime: cmd.createTime || new Date().toLocaleString('zh-CN'),
                            copyCount: cmd.copyCount || 0
                        });
                        addedCount++;
                    }
                });

                this.saveData();
                this.updateDisplay();
                this.showNotification(`成功导入 ${addedCount} 条命令（跳过 ${importCount - addedCount} 条重复命令）`);
            } catch (err) {
                console.error('导入失败:', err);
                this.showNotification('导入失败，请检查文件格式', 'error');
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // 清空文件输入
    }

    /**
     * 更新界面显示
     * 统一入口，同时更新命令数量和命令列表
     */
    updateDisplay() {
        this.updateCommandsCount();
        this.renderCommandsList();
    }

    /**
     * 更新命令数量显示
     * 在页面头部显示当前命令总数
     */
    updateCommandsCount() {
        this.elements.commandsCount.textContent = this.commands.length;
    }

    /**
     * 渲染命令列表
     * 功能：
     * 1. 判断是否有命令数据，无数据时显示空状态
     * 2. 遵循倒序显示原则（新命令在上）
     * 3. 生成HTML并设置到DOM中
     * 4. 支持自定义命名和统计信息显示
     */
    renderCommandsList() {
        if (this.commands.length === 0) {
            this.elements.emptyState.style.display = 'block';
            this.elements.commandsList.style.display = 'none';
            return;
        }

        this.elements.emptyState.style.display = 'none';
        this.elements.commandsList.style.display = 'flex';

        const html = this.commands.map((command, index) => `
            <div class="command-card" data-command-id="${command.id}">
                <div class="command-header">
                    <div class="command-index">#${this.commands.length - index}</div>
                    <div class="command-actions">
                        <button class="btn btn-primary btn-small copy-btn" onclick="commandManager.copyCommand('${command.id}')">
                            <span class="btn-icon">📋</span>
                            <span class="btn-text">复制</span>
                        </button>
                        <button class="btn btn-secondary btn-small edit-btn" onclick="commandManager.toggleEditMode('${command.id}')">
                            <span class="btn-icon">✏️</span>
                            <span class="btn-text">编辑</span>
                        </button>
                        <button class="btn btn-danger btn-small" onclick="commandManager.deleteCommand('${command.id}')">
                            <span class="btn-icon">🗑️</span>
                            <span class="btn-text">删除</span>
                        </button>
                    </div>
                </div>
                <div class="command-content">
                    <div class="command-name-section">
                        ${command.name ? `<div class="command-name-display"><span class="command-name-icon">🏷️</span>${this.escapeHtml(command.name)}</div>` : '<div class="command-name-display" style="display: none;"><span class="command-name-icon">🏷️</span></div>'}
                        <input type="text" class="command-name-edit" value="${(command.name || '').replace(/"/g, '&quot;')}" placeholder="命令名称（可选)" style="display: none;">
                    </div>
                    <div class="command-text-section">
                        <div class="command-text-display">${this.escapeHtml(command.text)}</div>
                        <input type="text" class="command-text-edit" value="${command.text.replace(/"/g, '&quot;')}" style="display: none;">
                    </div>
                </div>
                <div class="command-meta">
                    <span class="command-time">添加于 ${command.createTime}</span>
                    <span class="copy-count">复制 ${command.copyCount} 次</span>
                </div>
            </div>
        `).join('');

        this.elements.commandsList.innerHTML = html;
    }

    /**
     * HTML转义処理
     * 防止XSS攻击，确保用户输入的内容安全显示
     * @param {string} text - 需要转义的文本
     * @returns {string} 转义后的安全HTML内容
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 主题切换功能
     * 在深色和浅色主题之间切换，并保存用户偏好
     */
    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        this.elements.themeBtn.querySelector('.tool-icon').textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    }

    /**
     * 初始化主题设置
     * 优先级：用户保存的偏好 > 系统主题偏好 > 默认浅色
     */
    initTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        const isDark = savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
            document.body.classList.add('dark-theme');
            this.elements.themeBtn.querySelector('.tool-icon').textContent = '☀️';
        }
    }

    /**
     * 显示帮助弹窗
     * 为用户提供使用说明和操作指导
     */
    showHelp() {
        this.elements.helpModal.classList.add('show');
    }

    /**
     * 隐藏帮助弹窗
     * 支持多种关闭方式：点击关闭按钮、点击遮罩层、按ESC键
     */
    hideHelp() {
        this.elements.helpModal.classList.remove('show');
    }

    /**
     * 显示通知消息
     * 支持不同类型的通知：成功、错误、信息
     * @param {string} message - 通知内容
     * @param {string} type - 通知类型：success/error/info
     */
    showNotification(message, type = 'success') {
        const notification = this.elements.notification;
        const textElement = notification.querySelector('.notification-text');
        
        textElement.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    /**
     * 全局键盘快捷键处理
     * 支持的快捷键：
     * - Ctrl+A：在命令输入框中全选内容
     * - ESC：关闭帮助弹窗
     * @param {KeyboardEvent} event - 键盘事件对象
     */
    handleKeyboard(event) {
        // Ctrl+A 全选输入框内容
        if (event.ctrlKey && event.key === 'a' && document.activeElement === this.elements.commandInput) {
            event.preventDefault();
            this.elements.commandInput.select();
        }

        // ESC 关闭帮助弹窗
        if (event.key === 'Escape') {
            this.hideHelp();
        }
    }

    /**
     * 保存数据到本地存储
     * 使用localStorage持久化存储命令数据，包含错误处理
     */
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.commands));
        } catch (err) {
            console.error('保存数据失败:', err);
            this.showNotification('保存数据失败', 'error');
        }
    }

    /**
     * 从本地存储加载数据
     * 在初始化时恢复用户之前保存的命令数据，包含容错处理
     */
    loadData() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.commands = JSON.parse(saved);
            }
        } catch (err) {
            console.error('加载数据失败:', err);
            this.commands = [];
        }
    }
}

/**
 * 全局命令管理器实例
 * @type {CommandManager}
 */
let commandManager;

/**
 * 页面加载完成后初始化应用
 * 包括创建管理器实例和添加示例命令（仅首次使用）
 */
document.addEventListener('DOMContentLoaded', () => {
    commandManager = new CommandManager();
    
    // 添加一些示例命令（仅在首次使用时）
    if (commandManager.commands.length === 0 && !localStorage.getItem('commandManager_hasShownWelcome')) {
        const examples = [
            'ssh user@example.com',
            'git clone https://github.com/user/repo.git',
            'docker run -d -p 8080:80 nginx',
            'npm install && npm start',
            'curl -X GET https://api.example.com/data'
        ];
        
        const exampleNames = [
            '远程服务器SSH连接',
            'Git仓库克隆',
            'Docker容器运行',
            'Node.js项目启动',
            'API接口测试'
        ];
        
        examples.forEach((cmd, index) => {
            commandManager.commands.push({
                id: `example_${index}`,
                name: exampleNames[index],
                text: cmd,
                createTime: new Date().toLocaleString('zh-CN'),
                copyCount: 0
            });
        });
        
        commandManager.saveData();
        commandManager.updateDisplay();
        commandManager.showNotification('已添加示例命令，你可以删除或修改它们', 'info');
        localStorage.setItem('commandManager_hasShownWelcome', 'true');
    }
});

/**
 * 页面卸载前保存数据
 * 防止用户刷新页面或关闭浏览器时丢失未保存的数据
 */
window.addEventListener('beforeunload', () => {
    if (commandManager) {
        commandManager.saveData();
    }
});