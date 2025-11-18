# 设计 Token 体系

## 概述

本文档定义了 InsurAgent 应用的设计 Token 体系，包括 CSS 变量、设计 Token 和实现指南。

## 1. CSS 变量定义

### 1.1 色彩变量

#### 主色调

```css
--primary: 191 78% 37%;
--primary-foreground: 0 0% 100%;
```

#### 辅助色调

```css
--secondary: 222.2 47% 11%;
--secondary-foreground: 0 0% 100%;
```

#### 语义色彩

```css
--success: 152 76% 36%;
--warning: 38 92% 50%;
--error: 0 84% 60%;
```

#### 背景与前景

```css
--background: 0 0% 100%;
--foreground: 222.2 84% 5%;
--card: 0 0% 100%;
--card-foreground: 222.2 84% 5%;
--muted: 215 16% 92%;
--muted-foreground: 215 16% 47%;
```

#### 边框与输入

```css
--border: 214 32% 91%;
--input: 214 32% 91%;
--ring: 191 78% 37%;
```

### 1.2 尺寸变量

#### 圆角

```css
--radius: 0.75rem;
```

#### 间距比例

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 0.75rem;   /* 12px */
--spacing-lg: 1rem;      /* 16px */
--spacing-xl: 1.5rem;    /* 24px */
--spacing-2xl: 2rem;     /* 32px */
```

### 1.3 阴影变量

```css
--shadow-soft: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-medium: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-large: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

## 2. 设计 Token 映射

### 2.1 色彩 Token

| Token | CSS 变量 | 使用场景 |
|----|----|----|
| `color.primary` | `hsl(var(--primary))` | 主要按钮、链接 |
| `color.primary.foreground` | `hsl(var(--primary-foreground))` | 主色上的文字 |
| `color.secondary` | `hsl(var(--secondary))` | 次要按钮、背景 |
| `color.success` | `hsl(var(--success))` | 成功状态 |
| `color.warning` | `hsl(var(--warning))` | 警告状态 |
| `color.error` | `hsl(var(--error))` | 错误状态 |
| `color.background` | `hsl(var(--background))` | 页面背景 |
| `color.foreground` | `hsl(var(--foreground))` | 主要文字 |
| `color.muted.foreground` | `hsl(var(--muted-foreground))` | 辅助文字 |

### 2.2 尺寸 Token

| Token | CSS 变量 | 使用场景 |
|----|----|----|
| `spacing.xs` | `var(--spacing-xs)` | 小间距 |
| `spacing.sm` | `var(--spacing-sm)` | 中等间距 |
| `spacing.md` | `var(--spacing-md)` | 基础间距 |
| `spacing.lg` | `var(--spacing-lg)` | 大间距 |
| `spacing.xl` | `var(--spacing-xl)` | 超大间距 |
| `border.radius` | `var(--radius)` | 组件圆角 |

### 2.3 阴影 Token

| Token | CSS 变量 | 使用场景 |
|----|----|----|
| `shadow.soft` | `var(--shadow-soft)` | 卡片、按钮 |
| `shadow.medium` | `var(--shadow-medium)` | 模态框、下拉菜单 |
| `shadow.large` | `var(--shadow-large)` | 大型组件 |

## 3. Tailwind 配置映射

### 3.1 色彩配置

```javascript
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--error))",
    foreground: "hsl(var(--primary-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
}
```

### 3.2 圆角配置

```javascript
borderRadius: {
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
}
```

## 4. 实现指南

### 4.1 使用 CSS 变量

#### 推荐做法

```css
.button-primary {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}
```

#### 避免做法

```css
.button-primary {
  background-color: #0ea5e9; /* 硬编码颜色 */
  color: #ffffff;
  border-radius: 12px;
}
```

### 4.2 使用 Tailwind 类

#### 推荐做法

```html
<button class="bg-primary text-primary-foreground rounded-lg">
  主要按钮
</button>
```

#### 避免做法

```html
<button class="bg-blue-600 text-white rounded-lg">
  主要按钮
</button>
```

### 4.3 响应式设计

#### 推荐做法

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- 内容 -->
</div>
```

#### 避免做法

```html
<div class="flex flex-col md:flex-row lg:flex-col">
  <!-- 内容 -->
</div>
```

## 5. 主题切换支持

### 5.1 深色主题变量

```css
.dark {
  --background: 222.2 84% 5%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 5%;
  --card-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
}
```

### 5.2 主题切换实现

```javascript
// 切换主题的函数
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}
```

## 6. 维护指南

### 6.1 新增 Token




1. 在 CSS 变量中定义新 Token
2. 更新设计 Token 映射表
3. 更新 Tailwind 配置（如需要）
4. 更新组件库使用

### 6.2 修改 Token




1. 更新 CSS 变量定义
2. 通知开发团队相关变更
3. 更新相关组件样式

### 6.3 废弃 Token




1. 标记为废弃状态
2. 提供替代方案
3. 在下一个主要版本中移除


*本 Token 体系将随着设计系统的发展持续完善*