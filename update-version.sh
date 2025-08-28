#!/bin/bash
# 更新命令管理工具的版本号以破解浏览器缓存

# 获取当前日期作为版本号 (YYYYMMDD格式)
NEW_VERSION=$(date +%Y%m%d)

# 如果提供了参数，使用参数作为版本号
if [ ! -z "$1" ]; then
    NEW_VERSION="$1"
fi

echo "🔄 正在更新版本号到: $NEW_VERSION"

# 更新HTML文件中的版本参数
sed -i '' "s/command\.css?v=[^\"]*\"/command.css?v=$NEW_VERSION\"/g" index.html
sed -i '' "s/command\.js?v=[^\"]*\"/command.js?v=$NEW_VERSION\"/g" index.html

echo "✅ 版本号更新完成！"
echo "📝 请使用 Command+Shift+R 强制刷新浏览器"
echo "💡 或者在Chrome中按F12，右键刷新按钮选择「清空缓存并硬性重新加载」"

# 显示更新后的文件内容
echo ""
echo "📄 更新后的文件引用："
grep -E "(command\.(css|js))" index.html