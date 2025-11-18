# InsurAgent 设计系统规范

## 概述
本设计系统为 InsurAgent 保险助手应用提供统一的视觉和交互规范，确保用户体验的一致性和专业性。

## 1. 色彩体系

### 1.1 主色调
- **主色 (Primary)**: `hsl(191 78% 37%)` - 青蓝色，代表专业、信任
- **辅助色 (Secondary)**: `hsl(222.2 47% 11%)` - 深石板色
- **强调色 (Accent)**: `hsl(217 33% 17%)` - 石板深色

### 1.2 语义色彩
- **成功 (Success)**: `hsl(152 76% 36%)` - 翠绿色
- **警告 (Warning)**: `hsl(38 92% 50%)` - 琥珀色
- **错误 (Error)**: `hsl(0 84% 60%)` - 红色

### 1.3 中性色彩
- **背景 (Background)**: `hsl(0 0% 100%)`
- **前景 (Foreground)**: `hsl(222.2 84% 5%)`
- **边框 (Border)**: `hsl(214 32% 91%)`
- **静音 (Muted)**: `hsl(215 16% 92%)`

## 2. 排版系统

### 2.1 字体层级
- **H1**: `text-4xl font-bold` - 页面标题
- **H2**: `text-2xl font-semibold` - 区块标题
- **H3**: `text-lg font-semibold` - 卡片标题
- **正文**: `text-base` - 主要内容
- **辅助文本**: `text-sm text-muted-foreground` - 描述性文字

### 2.2 行高与间距
- **基础间距**: `0.75rem` (12px)
- **卡片内边距**: `1.5rem` (24px)
- **组件间距**: `0.375rem` (6px) 递增

## 3. 组件规范

### 3.1 按钮 (Button)

#### 变体类型
- **default**: 主要操作按钮，使用主色
- **secondary**: 次要操作按钮，使用辅助色
- **outline**: 边框按钮，用于次要操作
- **ghost**: 幽灵按钮，用于导航和轻量操作
- **destructive**: 危险操作按钮
- **success**: 成功状态按钮
- **warning**: 警告状态按钮

#### 尺寸规范
- **default**: `h-9 px-3 py-2`
- **sm**: `h-8 px-2`
- **lg**: `h-10 px-4`
- **icon**: `h-9 w-9`

### 3.2 卡片 (Card)

#### 样式规范
- **圆角**: `0.75rem`
- **阴影**: `shadow-soft` (柔和阴影)
- **边框**: `1px solid hsl(var(--border))`
- **背景**: `hsl(var(--card))`

#### 结构组件
- `CardHeader`: 标题区域，包含 `CardTitle` 和 `CardDescription`
- `CardContent`: 主要内容区域
- `CardFooter`: 底部操作区域

### 3.3 徽章 (Badge)

#### 变体类型
- **default**: 主要徽章
- **secondary**: 次要徽章
- **destructive**: 危险状态
- **outline**: 边框样式

### 3.4 空状态 (Empty)

#### 使用场景
- 数据为空时的占位显示
- 包含图标、标题、描述和操作按钮

## 4. 布局系统

### 4.1 容器布局
- **最大宽度**: `max-w-6xl` (1152px)
- **内边距**: `px-4 py-6`
- **响应式断点**: 遵循 Tailwind 标准

### 4.2 网格系统
- **基础网格**: `grid grid-cols-1 lg:grid-cols-4 gap-8`
- **卡片网格**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

## 5. 交互规范

### 5.1 悬停状态
- **按钮**: `hover:bg-primary/90` (透明度90%)
- **链接**: `hover:text-foreground/80` (透明度80%)

### 5.2 焦点状态
- **焦点环**: `focus-visible:ring-2 focus-visible:ring-ring`
- **禁用状态**: `disabled:pointer-events-none disabled:opacity-60`

### 5.3 过渡动画
- **页面过渡**: 200ms ease-in-out
- **颜色过渡**: 150ms ease-in-out

## 6. 响应式设计

### 6.1 断点系统
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### 6.2 移动端优化
- 触摸友好的按钮尺寸
- 适当的间距和字体大小
- 简化导航结构

## 7. 可访问性

### 7.1 色彩对比度
- 文本与背景对比度 ≥ 4.5:1
- 大文本对比度 ≥ 3:1

### 7.2 键盘导航
- 所有交互元素支持键盘访问
- 清晰的焦点指示器

### 7.3 屏幕阅读器
- 语义化的 HTML 结构
- 适当的 ARIA 标签

## 8. 设计原则

### 8.1 一致性
- 统一的视觉语言
- 可预测的交互模式

### 8.2 清晰性
- 明确的信息层级
- 简洁的界面设计

### 8.3 效率
- 减少用户认知负荷
- 优化任务流程

## 9. 实施指南

### 9.1 CSS 变量使用
所有颜色和尺寸应通过 CSS 变量定义，确保主题切换的一致性。

### 9.2 组件组合
优先使用现有的组件库，避免创建重复的样式定义。

### 9.3 代码规范
- 使用 TypeScript 确保类型安全
- 遵循 React 最佳实践
- 保持组件职责单一

---

*本设计系统将持续更新，以适应产品发展和用户需求变化。*