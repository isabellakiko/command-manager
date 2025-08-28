# 浏览器缓存解决方案

## 问题描述
Chrome浏览器的强缓存机制导致：
- `Command+R` (普通刷新) 还是加载旧版本
- `Command+Shift+R` (强制刷新) 才能看到新版本
- 但下次 `Command+R` 又回到旧版本

## 解决方案

### 1. 立即解决方案（开发者）
```bash
# 开发者工具强制清缓存
F12 → 右键刷新按钮 → "清空缓存并硬性重新加载"

# 或者使用无痕窗口
Command+Shift+N (Mac) / Ctrl+Shift+N (Windows)
```

### 2. 自动版本更新（推荐）
我们已经添加了版本控制机制：
- CSS: `command.css?v=20250806`
- JS: `command.js?v=20250806` 
- HTML meta标签阻止缓存

### 3. 快速更新版本号
```bash
# 在 command-manager 目录下运行
./update-version.sh

# 或者指定特定版本号
./update-version.sh 20250806
```

### 4. 手动更新版本号
编辑 `index.html`，修改版本参数：
```html
<link rel="stylesheet" href="command.css?v=新日期">
<script src="command.js?v=新日期"></script>
```

## 预防措施

### 开发环境配置
- 使用开发者工具时勾选"Disable cache"
- 或者使用无痕模式进行测试

### 生产环境建议
1. 每次更新后运行 `./update-version.sh`
2. 使用当前日期作为版本号（如：20250806）
3. 重要更新可以添加小版本号（如：20250806-1）

## 验证方法
1. 更新版本号后
2. 在浏览器中按 `Command+Shift+R` 强制刷新
3. 检查网络面板，确保资源显示为新版本
4. 之后普通 `Command+R` 应该也能看到新版本

## 技术原理
- 浏览器根据URL判断资源是否更新
- 添加版本参数(?v=版本号)会被视为不同的资源
- HTTP缓存控制头进一步确保不缓存HTML
- 这样每次版本号变化时，浏览器会重新下载资源