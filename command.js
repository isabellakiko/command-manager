/**
 * 命令管理工具 - Apple Glass Morphism Edition
 * 
 * 🎯 核心功能特性：
 * - 文件夹分类系统
 * - 多行命令编辑支持  
 * - 搜索和筛选功能
 * - 网格/列表视图切换
 * - 拖拽排序和文件夹间移动
 * 
 * 🍎 Apple级视觉特性：
 * - 毛玻璃效果 (backdrop-filter)
 * - 鼠标跟随动态背景
 * - 苹果标准色彩系统
 * - 流畅的动画过渡
 * - 现代化交互反馈
 * 
 * 🔧 技术改进：
 * - 修复编辑保存bug
 * - 增强错误处理
 * - 优化用户体验
 * - 完善视觉反馈
 * 
 * @class CommandManager
 * @author 陈澄 (Stephen Chan)
 * @version 4.0.0 - Glass Morphism Edition
 * @since 1.0.0
 */
class CommandManager {
    constructor() {
        // 数据存储
        this.commands = [];
        this.folders = [
            { id: 'default', name: '全部命令', isDefault: true }
        ];
        this.currentFolder = 'default';
        this.viewMode = 'grid'; // 'grid' or 'list'
        
        // 存储键名
        this.storageKey = 'commandManager_commands_v3';
        this.foldersKey = 'commandManager_folders_v3';
        this.themeKey = 'commandManager_theme';
        this.settingsKey = 'commandManager_settings_v3';
        
        // 初始化
        this.initElements();
        this.loadData();
        this.bindEvents();
        this.initTheme();
        this.setupMouseFollowEffect();
        this.updateDisplay();
    }

    /**
     * 初始化DOM元素引用
     */
    initElements() {
        this.elements = {
            // 搜索
            searchInput: document.getElementById('searchInput'),
            
            // 文件夹相关
            folderList: document.getElementById('folderList'),
            newFolderBtn: document.getElementById('newFolderBtn'),
            folderSelect: document.getElementById('folderSelect'),
            currentFolderName: document.getElementById('currentFolderName'),
            
            // 输入
            commandNameInput: document.getElementById('commandNameInput'),
            commandInput: document.getElementById('commandInput'),
            addCommandBtn: document.getElementById('addCommandBtn'),
            
            // 显示
            commandsList: document.getElementById('commandsList'),
            emptyState: document.getElementById('emptyState'),
            
            // 视图控制
            viewBtns: document.querySelectorAll('.view-btn'),
            
            // 统计
            totalCommands: document.getElementById('totalCommands'),
            totalFolders: document.getElementById('totalFolders'),
            
            // 操作按钮
            resetBtn: document.getElementById('resetBtn'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            themeBtn: document.getElementById('themeBtn'),
            helpBtn: document.getElementById('helpBtn'),
            closeHelpBtn: document.getElementById('closeHelpBtn'),
            
            // 弹窗
            helpModal: document.getElementById('helpModal'),
            notification: document.getElementById('notification'),
            fileInput: document.getElementById('fileInput')
        };
    }

    /**
     * 绑定所有事件监听器
     */
    bindEvents() {
        // 搜索功能
        this.elements.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // 文件夹管理
        this.elements.newFolderBtn.addEventListener('click', () => this.showNewFolderDialog());
        this.elements.folderList.addEventListener('click', (e) => this.handleFolderClick(e));
        this.elements.folderSelect.addEventListener('change', (e) => {
            this.currentFolder = e.target.value;
        });

        // 添加命令
        this.elements.addCommandBtn.addEventListener('click', () => this.addCommand());
        this.elements.commandInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.addCommand();
            }
        });
        this.elements.commandNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.elements.commandInput.focus();
            }
        });

        // 视图切换
        this.elements.viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // 命令列表事件委托
        this.elements.commandsList.addEventListener('click', (e) => this.handleCommandAction(e));
        this.elements.commandsList.addEventListener('keydown', (e) => this.handleCommandKeydown(e));

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
            if (e.target === this.elements.helpModal) this.hideHelp();
        });

        // 文件导入
        this.elements.fileInput.addEventListener('change', (e) => {
            this.handleFileImport(e.target.files[0]);
        });

        // 全局键盘事件
        document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));

        // 拖拽事件
        this.setupDragAndDrop();
    }

    /**
     * 设置拖拽功能
     */
    setupDragAndDrop() {
        let draggedElement = null;
        let draggedCommandId = null;

        this.elements.commandsList.addEventListener('dragstart', (e) => {
            // 查找最近的命令卡片元素（支持从子元素触发拖拽）
            const commandCard = e.target.closest('.command-card');
            
            // 只有当找到命令卡片且不在编辑模式时才允许拖拽
            if (commandCard && !commandCard.classList.contains('editing')) {
                draggedElement = commandCard;
                draggedCommandId = commandCard.dataset.commandId;
                commandCard.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                
                // 设置拖拽数据
                e.dataTransfer.setData('text/plain', '');
                
                console.log('开始拖拽命令卡片:', draggedCommandId);
            } else {
                // 阻止不符合条件的拖拽
                e.preventDefault();
            }
        });

        this.elements.commandsList.addEventListener('dragend', (e) => {
            // 查找最近的命令卡片元素
            const commandCard = e.target.closest('.command-card');
            
            if (commandCard) {
                commandCard.classList.remove('dragging');
                draggedElement = null;
                draggedCommandId = null;
                
                console.log('结束拖拽命令卡片');
            }
        });

        this.elements.commandsList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        this.elements.commandsList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedCommandId) {
                const dropTarget = e.target.closest('.command-card');
                if (dropTarget && dropTarget !== draggedElement) {
                    this.reorderCommands(draggedCommandId, dropTarget.dataset.commandId);
                }
            }
        });

        // 文件夹拖拽
        this.elements.folderList.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedCommandId) {
                e.dataTransfer.dropEffect = 'move';
                const folderItem = e.target.closest('.folder-item');
                if (folderItem) {
                    folderItem.classList.add('drop-indicator');
                }
            }
        });

        this.elements.folderList.addEventListener('dragleave', (e) => {
            const folderItem = e.target.closest('.folder-item');
            if (folderItem) {
                folderItem.classList.remove('drop-indicator');
            }
        });

        this.elements.folderList.addEventListener('drop', (e) => {
            e.preventDefault();
            const folderItem = e.target.closest('.folder-item');
            if (folderItem && draggedCommandId) {
                const targetFolderId = folderItem.dataset.folderId;
                this.moveCommandToFolder(draggedCommandId, targetFolderId);
                folderItem.classList.remove('drop-indicator');
            }
        });
    }

    /**
     * 加载本地存储的数据
     */
    loadData() {
        try {
            // 加载命令
            const savedCommands = localStorage.getItem(this.storageKey);
            if (savedCommands) {
                this.commands = JSON.parse(savedCommands);
            }

            // 加载文件夹
            const savedFolders = localStorage.getItem(this.foldersKey);
            if (savedFolders) {
                this.folders = JSON.parse(savedFolders);
            }

            // 加载设置
            const savedSettings = localStorage.getItem(this.settingsKey);
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.currentFolder = settings.currentFolder || 'default';
                this.viewMode = settings.viewMode || 'grid';
            }

            // 确保数据完整性
            this.validateData();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('数据加载失败，已重置为默认设置', 'error');
            this.resetAllData();
        }
    }

    /**
     * 验证数据完整性
     */
    validateData() {
        // 确保每个命令都有必要的属性
        this.commands = this.commands.map(cmd => ({
            id: cmd.id || this.generateId(),
            name: cmd.name || '',
            command: cmd.command || '',
            folderId: cmd.folderId || 'default',
            createdAt: cmd.createdAt || new Date().toISOString(),
            updatedAt: cmd.updatedAt || cmd.createdAt || new Date().toISOString(),
            useCount: cmd.useCount || 0
        }));

        // 确保默认文件夹存在
        if (!this.folders.find(f => f.id === 'default')) {
            this.folders.unshift({ id: 'default', name: '全部命令', isDefault: true });
        }

        // 移除无效命令（文件夹不存在的）
        const folderIds = this.folders.map(f => f.id);
        this.commands = this.commands.filter(cmd => folderIds.includes(cmd.folderId));
    }

    /**
     * 保存数据到本地存储
     */
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.commands));
            localStorage.setItem(this.foldersKey, JSON.stringify(this.folders));
            localStorage.setItem(this.settingsKey, JSON.stringify({
                currentFolder: this.currentFolder,
                viewMode: this.viewMode
            }));
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('数据保存失败', 'error');
        }
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return 'cmd_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    }

    /**
     * 添加命令
     */
    addCommand() {
        const name = this.elements.commandNameInput.value.trim();
        const command = this.elements.commandInput.value.trim();

        if (!command) {
            this.showNotification('请输入命令内容', 'warning');
            this.elements.commandInput.focus();
            return;
        }

        const newCommand = {
            id: this.generateId(),
            name: name || this.generateCommandName(command),
            command: command,
            folderId: this.currentFolder,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            useCount: 0
        };

        this.commands.push(newCommand);
        this.saveData();
        this.updateDisplay();

        // 清空输入框
        this.elements.commandNameInput.value = '';
        this.elements.commandInput.value = '';
        this.elements.commandNameInput.focus();

        this.showNotification('命令添加成功', 'success');
    }

    /**
     * 根据命令内容生成默认名称
     */
    generateCommandName(command) {
        const firstLine = command.split('\n')[0].trim();
        if (firstLine.length > 30) {
            return firstLine.substring(0, 30) + '...';
        }
        return firstLine;
    }

    /**
     * 删除命令
     */
    deleteCommand(commandId) {
        if (confirm('确定要删除这条命令吗？')) {
            this.commands = this.commands.filter(cmd => cmd.id !== commandId);
            this.saveData();
            this.updateDisplay();
            this.showNotification('命令已删除', 'success');
        }
    }

    /**
     * 复制命令到剪贴板
     */
    async copyCommand(commandId) {
        const command = this.commands.find(cmd => cmd.id === commandId);
        if (!command) return;

        try {
            await navigator.clipboard.writeText(command.command);
            
            // 更新使用次数
            command.useCount++;
            command.updatedAt = new Date().toISOString();
            this.saveData();

            // 更新按钮状态 - 使用更稳定的方式获取按钮
            const card = document.querySelector(`[data-command-id="${commandId}"]`);
            if (card) {
                const copyBtn = card.querySelector('.btn-copy');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<span>✓</span><span>已复制</span>';
                    copyBtn.classList.add('copied');
                    copyBtn.disabled = true; // 防止重复点击
                    
                    setTimeout(() => {
                        if (copyBtn) { // 确保按钮还存在
                            copyBtn.innerHTML = originalText;
                            copyBtn.classList.remove('copied');
                            copyBtn.disabled = false;
                        }
                    }, 2000);
                }
            }

            this.showNotification('命令已复制到剪贴板', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.fallbackCopy(command.command, commandId);
        }
    }

    /**
     * 降级复制方案
     */
    fallbackCopy(text, commandId = null) {
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
            
            // 如果有commandId，更新使用次数和按钮状态
            if (commandId) {
                const command = this.commands.find(cmd => cmd.id === commandId);
                if (command) {
                    command.useCount++;
                    command.updatedAt = new Date().toISOString();
                    this.saveData();
                }

                const card = document.querySelector(`[data-command-id="${commandId}"]`);
                if (card) {
                    const copyBtn = card.querySelector('.btn-copy');
                    if (copyBtn) {
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<span>✓</span><span>已复制</span>';
                        copyBtn.classList.add('copied');
                        copyBtn.disabled = true;
                        
                        setTimeout(() => {
                            if (copyBtn) {
                                copyBtn.innerHTML = originalText;
                                copyBtn.classList.remove('copied');
                                copyBtn.disabled = false;
                            }
                        }, 2000);
                    }
                }
            }
            
            this.showNotification('命令已复制到剪贴板', 'success');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showNotification('复制失败，请手动复制', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    /**
     * 编辑命令
     */
    editCommand(commandId) {
        const command = this.commands.find(cmd => cmd.id === commandId);
        if (!command) return;

        const card = document.querySelector(`[data-command-id="${commandId}"]`);
        if (!card) return;

        // 编辑模式时，禁用拖拽
        const originalDraggable = card.getAttribute('draggable');
        card.setAttribute('draggable', 'false');
        card.classList.add('editing');

        // 获取元素
        const nameElement = card.querySelector('.command-name');
        const contentElement = card.querySelector('.command-content');
        const actionsElement = card.querySelector('.command-actions');

        // 获取原始内容区域的高度
        const originalContentHeight = contentElement.offsetHeight;
        
        // 创建编辑界面
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = command.name;
        nameInput.className = 'command-name-input';

        const contentTextarea = document.createElement('textarea');
        contentTextarea.value = command.command;
        contentTextarea.className = 'command-edit-textarea';
        contentTextarea.rows = Math.min(command.command.split('\n').length + 1, 10);
        // 设置固定高度避免跳跃，但保留最小高度
        contentTextarea.style.height = Math.max(originalContentHeight, 120) + 'px';
        contentTextarea.style.minHeight = '120px';
        contentTextarea.style.resize = 'vertical';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'command-btn btn-save';
        saveBtn.innerHTML = '<span>💾</span><span>保存</span>';

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'command-btn btn-cancel';
        cancelBtn.innerHTML = '<span>✖</span><span>取消</span>';

        // 保存原始内容
        const originalName = nameElement.innerHTML;
        const originalContent = contentElement.innerHTML;
        const originalActions = actionsElement.innerHTML;

        // 替换内容
        nameElement.innerHTML = '';
        nameElement.appendChild(nameInput);
        contentElement.innerHTML = '';
        contentElement.appendChild(contentTextarea);
        actionsElement.innerHTML = '';
        actionsElement.appendChild(saveBtn);
        actionsElement.appendChild(cancelBtn);

        // 聚焦到内容输入框
        contentTextarea.focus();
        contentTextarea.setSelectionRange(contentTextarea.value.length, contentTextarea.value.length);

        // 保存函数 - 修复版，确保保存状态正确显示
        const saveEdit = async () => {
            const newName = nameInput.value.trim();
            const newCommand = contentTextarea.value.trim();

            if (!newCommand) {
                this.showNotification('命令内容不能为空', 'warning');
                contentTextarea.focus();
                return;
            }

            try {
                // 1. 显示保存中状态
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<span>⏳</span><span>保存中...</span>';
                saveBtn.classList.add('loading');
                
                // 2. 添加保存动画效果
                card.style.transform = 'scale(0.98)';
                card.style.filter = 'brightness(1.1)';
                
                // 3. 更新数据
                const oldName = command.name;
                const oldCommand = command.command;
                
                command.name = newName || this.generateCommandName(newCommand);
                command.command = newCommand;
                command.updatedAt = new Date().toISOString();
                
                // 4. 保存到本地存储
                this.saveData();
                
                // 5. 显示保存成功状态（在更新界面前）
                saveBtn.innerHTML = '<span>✅</span><span>保存成功</span>';
                saveBtn.classList.remove('loading');
                saveBtn.classList.add('success');
                
                // 6. 延迟后恢复界面
                await new Promise(resolve => {
                    setTimeout(() => {
                        // 恢复卡片视觉状态
                        card.style.transform = '';
                        card.style.filter = '';
                        
                        // 先恢复界面状态
                        card.setAttribute('draggable', originalDraggable);
                        card.classList.remove('editing');
                        cleanup();
                        
                        // 更新卡片内容
                        this.updateCommandCard(commandId);
                        
                        // 显示成功通知
                        this.showNotification(`命令"${command.name}"已更新`, 'success');
                        
                        // 记录更新操作
                        console.log('Command updated:', {
                            id: commandId,
                            oldName,
                            newName: command.name,
                            oldCommand: oldCommand.substring(0, 50) + '...',
                            newCommand: command.command.substring(0, 50) + '...'
                        });
                        
                        resolve();
                    }, 800); // 增加延迟时间让用户看到保存成功状态
                });
                
            } catch (error) {
                console.error('Save error:', error);
                
                // 恢复保存按钮状态
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<span>💾</span><span>保存</span>';
                saveBtn.classList.remove('loading');
                
                // 显示错误通知
                this.showNotification('保存失败，请重试', 'error');
                
                // 恢复卡片状态
                card.style.transform = '';
                card.style.filter = '';
            }
        };

        // 取消函数
        const cancelEdit = () => {
            nameElement.innerHTML = originalName;
            contentElement.innerHTML = originalContent;
            actionsElement.innerHTML = originalActions;
            
            // 恢复拖拽功能
            card.setAttribute('draggable', originalDraggable);
            card.classList.remove('editing');
            
            // 清理事件监听器
            cleanup();
        };

        // 键盘事件处理函数
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                cancelEdit();
            } else if (e.key === 'Enter' && e.ctrlKey) {
                saveEdit();
            }
        };

        // 清理函数
        const cleanup = () => {
            saveBtn.removeEventListener('click', saveEdit);
            cancelBtn.removeEventListener('click', cancelEdit);
            contentTextarea.removeEventListener('keydown', handleKeydown);
        };

        // 绑定事件
        saveBtn.addEventListener('click', saveEdit);
        cancelBtn.addEventListener('click', cancelEdit);
        contentTextarea.addEventListener('keydown', handleKeydown);
    }

    /**
     * 更新单个命令卡片 - 增强版，提供更好的视觉反馈
     */
    updateCommandCard(commandId) {
        const command = this.commands.find(cmd => cmd.id === commandId);
        if (!command) {
            console.warn('Command not found:', commandId);
            return;
        }

        const card = document.querySelector(`[data-command-id="${commandId}"]`);
        if (!card) {
            console.warn('Card element not found:', commandId);
            return;
        }

        try {
            // 添加更新动画效果
            card.style.transform = 'scale(0.98)';
            card.style.opacity = '0.7';
            card.style.transition = 'all 0.2s ease';

            // 短暂延迟后更新内容，提供视觉反馈
            setTimeout(() => {
                // 重新生成卡片
                const newCard = this.createCommandCard(command);
                
                // 添加进入动画
                newCard.style.transform = 'scale(0.98)';
                newCard.style.opacity = '0.7';
                newCard.style.transition = 'all 0.2s ease';
                
                // 替换卡片
                card.parentNode.replaceChild(newCard, card);
                
                // 恢复正常状态
                requestAnimationFrame(() => {
                    newCard.style.transform = '';
                    newCard.style.opacity = '';
                });
                
                console.log('Command card updated successfully:', commandId);
            }, 100);
            
        } catch (error) {
            console.error('Error updating command card:', error);
            // 降级处理：直接重新渲染所有命令
            this.updateDisplay();
        }
    }

    /**
     * 文件夹管理
     */
    showNewFolderDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'folder-dialog';
        dialog.innerHTML = `
            <h3>新建文件夹</h3>
            <input type="text" placeholder="输入文件夹名称" class="folder-name-input" maxlength="20">
            <div class="folder-dialog-actions">
                <button class="btn btn-sm btn-primary">创建</button>
                <button class="btn btn-sm">取消</button>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        const input = dialog.querySelector('.folder-name-input');
        const createBtn = dialog.querySelector('.btn-primary');
        const cancelBtn = dialog.querySelector('.btn:not(.btn-primary)');

        input.focus();

        const create = () => {
            const name = input.value.trim();
            if (!name) {
                this.showNotification('请输入文件夹名称', 'warning');
                return;
            }

            if (this.folders.find(f => f.name === name)) {
                this.showNotification('文件夹名称已存在', 'warning');
                return;
            }

            const newFolder = {
                id: 'folder_' + Date.now(),
                name: name,
                isDefault: false
            };

            this.folders.push(newFolder);
            this.saveData();
            this.updateFolderDisplay();
            this.showNotification('文件夹创建成功', 'success');
            document.body.removeChild(overlay);
        };

        const cancel = () => {
            document.body.removeChild(overlay);
        };

        createBtn.addEventListener('click', create);
        cancelBtn.addEventListener('click', cancel);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') create();
            if (e.key === 'Escape') cancel();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cancel();
        });
    }

    /**
     * 删除文件夹
     */
    deleteFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder || folder.isDefault) return;

        const commandsInFolder = this.commands.filter(cmd => cmd.folderId === folderId);
        let message = `确定要删除文件夹"${folder.name}"吗？`;
        
        if (commandsInFolder.length > 0) {
            message += `\n\n文件夹中有 ${commandsInFolder.length} 条命令，删除后这些命令将移动到"全部命令"中。`;
        }

        if (confirm(message)) {
            // 移动命令到默认文件夹
            commandsInFolder.forEach(cmd => {
                cmd.folderId = 'default';
                cmd.updatedAt = new Date().toISOString();
            });

            // 删除文件夹
            this.folders = this.folders.filter(f => f.id !== folderId);

            // 如果当前文件夹被删除，切换到默认文件夹
            if (this.currentFolder === folderId) {
                this.currentFolder = 'default';
            }

            this.saveData();
            this.updateDisplay();
            this.showNotification('文件夹已删除', 'success');
        }
    }

    /**
     * 重命名文件夹
     */
    renameFolder(folderId) {
        const folder = this.folders.find(f => f.id === folderId);
        if (!folder || folder.isDefault) return;

        const newName = prompt('请输入新的文件夹名称:', folder.name);
        if (!newName || newName.trim() === '') return;

        const trimmedName = newName.trim();
        if (trimmedName === folder.name) return;

        if (this.folders.find(f => f.name === trimmedName && f.id !== folderId)) {
            this.showNotification('文件夹名称已存在', 'warning');
            return;
        }

        folder.name = trimmedName;
        this.saveData();
        this.updateFolderDisplay();
        this.showNotification('文件夹重命名成功', 'success');
    }

    /**
     * 移动命令到文件夹
     */
    moveCommandToFolder(commandId, targetFolderId) {
        const command = this.commands.find(cmd => cmd.id === commandId);
        if (!command || command.folderId === targetFolderId) return;

        command.folderId = targetFolderId;
        command.updatedAt = new Date().toISOString();
        
        this.saveData();
        this.updateDisplay();
        
        const targetFolder = this.folders.find(f => f.id === targetFolderId);
        this.showNotification(`命令已移动到"${targetFolder.name}"`, 'success');
    }

    /**
     * 重新排序命令
     */
    reorderCommands(draggedId, targetId) {
        const draggedIndex = this.commands.findIndex(cmd => cmd.id === draggedId);
        const targetIndex = this.commands.findIndex(cmd => cmd.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;

        // 移动数组元素
        const [draggedCommand] = this.commands.splice(draggedIndex, 1);
        this.commands.splice(targetIndex, 0, draggedCommand);

        this.saveData();
        this.updateDisplay();
    }

    /**
     * 处理文件夹点击事件
     */
    handleFolderClick(event) {
        const folderItem = event.target.closest('.folder-item');
        if (!folderItem) return;

        const folderId = folderItem.dataset.folderId;
        
        if (event.target.classList.contains('folder-btn')) {
            const action = event.target.dataset.action;
            switch (action) {
                case 'rename':
                    this.renameFolder(folderId);
                    break;
                case 'delete':
                    this.deleteFolder(folderId);
                    break;
            }
        } else {
            // 切换文件夹
            this.switchFolder(folderId);
        }
    }

    /**
     * 切换文件夹
     */
    switchFolder(folderId) {
        this.currentFolder = folderId;
        this.saveData();
        this.updateDisplay();
    }

    /**
     * 处理命令操作
     */
    handleCommandAction(event) {
        // 查找最近的带有 data-action 的按钮
        const actionButton = event.target.closest('[data-action]');
        if (!actionButton) return;

        // 查找对应的命令卡片
        const commandCard = actionButton.closest('.command-card');
        if (!commandCard) return;

        const commandId = commandCard.dataset.commandId;
        const action = actionButton.dataset.action;

        // 阻止事件冒泡，避免触发拖拽
        event.stopPropagation();

        switch (action) {
            case 'copy':
                this.copyCommand(commandId);
                break;
            case 'edit':
                this.editCommand(commandId);
                break;
            case 'delete':
                this.deleteCommand(commandId);
                break;
        }
    }

    /**
     * 处理命令键盘事件
     */
    handleCommandKeydown(event) {
        if (event.target.classList.contains('command-edit-textarea')) {
            if (event.key === 'Tab') {
                event.preventDefault();
                const start = event.target.selectionStart;
                const end = event.target.selectionEnd;
                event.target.value = event.target.value.substring(0, start) + '    ' + event.target.value.substring(end);
                event.target.selectionStart = event.target.selectionEnd = start + 4;
            }
        }
    }

    /**
     * 搜索功能
     */
    handleSearch(query) {
        const filteredCommands = this.getFilteredCommands(query);
        this.renderCommands(filteredCommands);
    }

    /**
     * 获取过滤后的命令
     */
    getFilteredCommands(searchQuery = '') {
        let filtered = this.commands;

        // 文件夹过滤
        if (this.currentFolder !== 'default') {
            filtered = filtered.filter(cmd => cmd.folderId === this.currentFolder);
        }

        // 搜索过滤
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(cmd => 
                cmd.name.toLowerCase().includes(query) ||
                cmd.command.toLowerCase().includes(query)
            );
        }

        return filtered;
    }

    /**
     * 切换视图模式
     */
    switchView(mode) {
        if (mode === this.viewMode) return;

        this.viewMode = mode;
        this.saveData();

        // 更新视图按钮状态
        this.elements.viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === mode);
        });

        // 更新容器类名
        this.elements.commandsList.className = `commands-container ${mode}-view`;
        
        // 重新渲染
        this.updateDisplay();
    }

    /**
     * 更新显示
     */
    updateDisplay() {
        this.updateFolderDisplay();
        this.updateStatsDisplay();
        this.updateCommandsDisplay();
        this.updateViewState();
    }

    /**
     * 更新文件夹显示
     */
    updateFolderDisplay() {
        // 更新文件夹列表
        this.elements.folderList.innerHTML = this.folders.map(folder => {
            const commandCount = folder.id === 'default' 
                ? this.commands.length 
                : this.commands.filter(cmd => cmd.folderId === folder.id).length;

            const isActive = folder.id === this.currentFolder;
            const actions = folder.isDefault ? '' : `
                <div class="folder-actions">
                    <button class="folder-btn" data-action="rename" title="重命名">✏</button>
                    <button class="folder-btn" data-action="delete" title="删除">🗑</button>
                </div>
            `;

            return `
                <div class="folder-item ${isActive ? 'active' : ''}" data-folder-id="${folder.id}">
                    <span class="folder-icon">${folder.isDefault ? '📁' : '📂'}</span>
                    <span class="folder-name">${folder.name}</span>
                    <span class="folder-count">${commandCount}</span>
                    ${actions}
                </div>
            `;
        }).join('');

        // 更新文件夹选择器
        this.elements.folderSelect.innerHTML = this.folders.map(folder => 
            `<option value="${folder.id}" ${folder.id === this.currentFolder ? 'selected' : ''}>${folder.name}</option>`
        ).join('');

        // 更新当前文件夹名称
        const currentFolder = this.folders.find(f => f.id === this.currentFolder);
        this.elements.currentFolderName.textContent = currentFolder ? currentFolder.name : '全部命令';
    }

    /**
     * 更新统计显示
     */
    updateStatsDisplay() {
        this.elements.totalCommands.textContent = this.commands.length;
        this.elements.totalFolders.textContent = this.folders.filter(f => !f.isDefault).length;
    }

    /**
     * 更新命令显示
     */
    updateCommandsDisplay() {
        const searchQuery = this.elements.searchInput.value;
        const filteredCommands = this.getFilteredCommands(searchQuery);
        this.renderCommands(filteredCommands);
    }

    /**
     * 渲染命令列表
     */
    renderCommands(commands) {
        if (commands.length === 0) {
            this.elements.emptyState.style.display = 'block';
            this.elements.commandsList.style.display = 'none';
            return;
        }

        this.elements.emptyState.style.display = 'none';
        this.elements.commandsList.style.display = 'grid';

        this.elements.commandsList.innerHTML = commands.map(command => 
            this.createCommandCard(command)
        ).join('');
    }

    /**
     * 创建命令卡片HTML
     */
    createCommandCard(command) {
        const folder = this.folders.find(f => f.id === command.folderId);
        const folderName = folder ? folder.name : '未知文件夹';
        const createdAt = new Date(command.createdAt).toLocaleDateString();
        const updatedAt = new Date(command.updatedAt).toLocaleDateString();
        const isRecentlyUpdated = command.createdAt !== command.updatedAt;

        // 创建一个临时元素来生成HTML
        const cardElement = document.createElement('div');
        cardElement.className = 'command-card';
        cardElement.setAttribute('data-command-id', command.id);
        cardElement.setAttribute('draggable', 'true');

        cardElement.innerHTML = `
            <div class="drag-handle">⋮⋮</div>
            <div class="command-header">
                <div>
                    <div class="command-name">${this.escapeHtml(command.name)}</div>
                    <div class="command-folder">
                        <span>📁</span>
                        <span>${this.escapeHtml(folderName)}</span>
                    </div>
                </div>
            </div>
            <div class="command-content">${this.escapeHtml(command.command)}</div>
            <div class="command-meta">
                <span title="创建时间">📅 ${createdAt}</span>
                <span title="使用次数">🔢 ${command.useCount}次</span>
                ${isRecentlyUpdated ? `<span title="最后修改">✏ ${updatedAt}</span>` : ''}
            </div>
            <div class="command-actions">
                <button class="command-btn btn-copy" data-action="copy" title="复制命令">
                    <span>📋</span>
                    <span>复制</span>
                </button>
                <button class="command-btn btn-edit" data-action="edit" title="编辑命令">
                    <span>✏</span>
                    <span>编辑</span>
                </button>
                <button class="command-btn btn-delete" data-action="delete" title="删除命令">
                    <span>🗑</span>
                </button>
            </div>
        `;

        return cardElement.outerHTML;
    }

    /**
     * 更新视图状态
     */
    updateViewState() {
        // 更新视图按钮状态
        this.elements.viewBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.viewMode);
        });

        // 更新容器类名
        this.elements.commandsList.className = `commands-container ${this.viewMode}-view`;
    }

    /**
     * 转义HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 主题切换
     */
    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
        this.elements.themeBtn.innerHTML = `<span class="tool-icon">${isDark ? '☀️' : '🌙'}</span>`;
        
        this.showNotification(`已切换到${isDark ? '暗色' : '亮色'}主题`, 'success');
    }

    /**
     * 初始化主题
     */
    initTheme() {
        const savedTheme = localStorage.getItem(this.themeKey);
        const isDark = savedTheme === 'dark' || 
                      (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
            document.body.classList.add('dark-theme');
        }
        
        this.elements.themeBtn.innerHTML = `<span class="tool-icon">${isDark ? '☀️' : '🌙'}</span>`;
    }

    /**
     * 设置鼠标跟随效果 - Apple Glass Morphism 动态背景
     */
    setupMouseFollowEffect() {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            // 更新CSS自定义属性
            document.documentElement.style.setProperty('--mouse-x', x + '%');
            document.documentElement.style.setProperty('--mouse-y', y + '%');
            document.documentElement.style.setProperty('--mouse-active', '1');
        });

        // 鼠标离开时逐渐淡出效果
        document.addEventListener('mouseleave', () => {
            document.documentElement.style.setProperty('--mouse-active', '0');
        });

        // 鼠标进入时激活效果
        document.addEventListener('mouseenter', () => {
            document.documentElement.style.setProperty('--mouse-active', '1');
        });

        // 为主要交互元素添加增强的毛玻璃效果
        this.enhanceGlassElements();
    }

    /**
     * 增强毛玻璃元素的交互效果
     */
    enhanceGlassElements() {
        // 为需要增强效果的元素添加glass-morphism类
        const elementsToEnhance = [
            '.header',
            '.sidebar', 
            '.input-section',
            '.commands-section',
            '.footer'
        ];

        elementsToEnhance.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.classList.add('glass-morphism');
                
                // 添加特殊悬停效果
                element.addEventListener('mouseenter', () => {
                    element.style.transform = 'translateY(-1px)';
                    element.style.backdropFilter = 'blur(25px) saturate(200%)';
                    element.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
                });
                
                element.addEventListener('mouseleave', () => {
                    element.style.transform = '';
                    element.style.backdropFilter = '';
                    element.style.boxShadow = '';
                });
            });
        });
    }

    /**
     * 导出命令
     */
    exportCommands() {
        const data = {
            version: '3.0.0',
            exportTime: new Date().toISOString(),
            folders: this.folders,
            commands: this.commands
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `command-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('数据导出成功', 'success');
    }

    /**
     * 导入命令
     */
    importCommands() {
        this.elements.fileInput.click();
    }

    /**
     * 处理文件导入
     */
    handleFileImport(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.folders || !data.commands) {
                    throw new Error('无效的数据格式');
                }

                // 合并数据
                const confirmMessage = `确定要导入数据吗？\n\n将导入：\n- ${data.folders.filter(f => !f.isDefault).length} 个文件夹\n- ${data.commands.length} 条命令\n\n现有数据不会被覆盖，新数据将与现有数据合并。`;
                
                if (confirm(confirmMessage)) {
                    this.mergeImportedData(data);
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('导入失败：' + error.message, 'error');
            }
        };

        reader.readAsText(file);
        this.elements.fileInput.value = '';
    }

    /**
     * 合并导入的数据
     */
    mergeImportedData(data) {
        let importedFolders = 0;
        let importedCommands = 0;
        let skippedCommands = 0;

        // 导入文件夹
        data.folders.forEach(folder => {
            if (folder.isDefault) return; // 跳过默认文件夹
            
            if (!this.folders.find(f => f.name === folder.name)) {
                this.folders.push({
                    ...folder,
                    id: 'folder_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
                });
                importedFolders++;
            }
        });

        // 创建ID映射
        const folderIdMap = {};
        data.folders.forEach(oldFolder => {
            const newFolder = this.folders.find(f => f.name === oldFolder.name);
            if (newFolder) {
                folderIdMap[oldFolder.id] = newFolder.id;
            }
        });

        // 导入命令 - 添加去重逻辑
        data.commands.forEach(command => {
            // 检查是否已存在相同的命令（按名称和命令内容）
            const isDuplicate = this.commands.some(existingCmd => 
                existingCmd.name.trim().toLowerCase() === command.name.trim().toLowerCase() &&
                existingCmd.command.trim() === command.command.trim()
            );
            
            if (!isDuplicate) {
                const newCommand = {
                    ...command,
                    id: this.generateId(),
                    folderId: folderIdMap[command.folderId] || 'default'
                };
                
                this.commands.push(newCommand);
                importedCommands++;
            } else {
                skippedCommands++;
            }
        });

        this.saveData();
        this.updateDisplay();
        
        let message = `导入成功：${importedFolders} 个文件夹，${importedCommands} 条命令`;
        if (skippedCommands > 0) {
            message += `，跳过 ${skippedCommands} 条重复命令`;
        }
        this.showNotification(message, 'success');
    }

    /**
     * 重置所有数据
     */
    resetAllData() {
        const confirmMessage = '确定要重置所有数据吗？\n\n这将删除所有命令和文件夹，且无法恢复！';
        
        if (confirm(confirmMessage)) {
            this.commands = [];
            this.folders = [{ id: 'default', name: '全部命令', isDefault: true }];
            this.currentFolder = 'default';
            this.viewMode = 'grid';
            
            this.saveData();
            this.updateDisplay();
            this.showNotification('数据已重置', 'success');
        }
    }

    /**
     * 全局键盘事件处理
     */
    handleGlobalKeydown(event) {
        // Ctrl+K 快速搜索
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            this.elements.searchInput.focus();
            this.elements.searchInput.select();
        }

        // Ctrl+N 新建命令
        if (event.ctrlKey && event.key === 'n') {
            event.preventDefault();
            this.elements.commandNameInput.focus();
        }

        // Ctrl+Shift+N 新建文件夹
        if (event.ctrlKey && event.shiftKey && event.key === 'N') {
            event.preventDefault();
            this.showNewFolderDialog();
        }

        // Escape 关闭弹窗
        if (event.key === 'Escape') {
            this.hideHelp();
        }
    }

    /**
     * 显示帮助
     */
    showHelp() {
        this.elements.helpModal.classList.add('show');
    }

    /**
     * 隐藏帮助
     */
    hideHelp() {
        this.elements.helpModal.classList.remove('show');
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        const notification = this.elements.notification;
        const text = notification.querySelector('.notification-text');
        
        text.textContent = message;
        notification.className = `notification show ${type}`;
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.commandManager = new CommandManager();
});