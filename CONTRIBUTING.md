# 贡献指南

感谢你对AI智能减重系统的关注！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告Bug

如果你发现了Bug，请：

1. 在[Issues](https://github.com/your-username/AI-Weight-Loss-System/issues)中搜索是否已有相关问题
2. 如果没有，创建新的Issue，包含：
   - Bug描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 环境信息（操作系统、浏览器、版本等）
   - 截图（如果适用）

### 提出新功能

如果你有新功能的想法：

1. 在Issues中创建Feature Request
2. 描述功能的用途和价值
3. 提供使用场景示例
4. 等待社区讨论和反馈

### 提交代码

1. **Fork项目**
   ```bash
   # 在GitHub上点击Fork按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/AI-Weight-Loss-System.git
   cd AI-Weight-Loss-System
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **进行修改**
   - 遵循代码规范
   - 添加必要的注释
   - 编写测试用例

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # 或
   git commit -m "fix: fix bug description"
   ```

6. **推送到GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建Pull Request**
   - 在GitHub上创建PR
   - 填写PR模板
   - 等待代码审查

## 📝 代码规范

### Python代码

- 遵循PEP 8规范
- 使用类型提示
- 添加文档字符串
- 函数名使用snake_case
- 类名使用PascalCase

```python
def calculate_bmi(weight: float, height: float) -> float:
    """
    计算BMI指数
    
    Args:
        weight: 体重（千克）
        height: 身高（米）
        
    Returns:
        BMI指数
    """
    return weight / (height ** 2)
```

### JavaScript代码

- 使用ES6+语法
- 使用const/let，避免var
- 函数名使用camelCase
- 添加JSDoc注释

```javascript
/**
 * 计算BMI指数
 * @param {number} weight - 体重（千克）
 * @param {number} height - 身高（米）
 * @returns {number} BMI指数
 */
function calculateBMI(weight, height) {
  return weight / (height ** 2);
}
```

### 提交信息规范

使用[Conventional Commits](https://www.conventionalcommits.org/)规范：

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：
```
feat: add food recognition feature
fix: resolve login issue
docs: update README
```

## 🧪 测试

在提交PR前，请确保：

- [ ] 所有测试通过
- [ ] 添加了新功能的测试
- [ ] 代码覆盖率不降低
- [ ] 手动测试通过

运行测试：
```bash
# Python测试
pytest

# JavaScript测试
npm test
```

## 📖 文档

如果你的更改涉及：

- 新功能：更新README和相关文档
- API变更：更新API文档
- 配置变更：更新配置说明

## ⚖️ 许可证

提交代码即表示你同意将代码以MIT许可证开源。

## 🙏 感谢

感谢你的贡献！每一个PR都让这个项目变得更好。
