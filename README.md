# 句会了 - 用句子学英语

一款基于 **Next.js + React + TypeScript** 的英语句子学习工具。通过「听音填词」和「连词成句」两种核心玩法，帮助你在真实语境中掌握英语表达。

**在线体验** → https://github.com/Dreamaker203/EnglishLearningAPP

---

## 功能特性

### 核心学习模式

- **听音填词** — 句子所有单词留空，听语音后逐个打字输入，全部填完按 Enter 批改，错误单词自动锁定并反复朗读，3 次错误揭晓答案
- **连词成句** — 单词被打乱，按正确顺序点击组装句子
- **逐词朗读** — Web Speech API 逐词高亮跟读，可与练习模式同时开启

### 其他功能

- **自定义上传** — 支持粘贴英文句子或短文，格式 `英文 | 中文翻译`，批量导入
- **进度追踪** — localStorage 本地保存学习进度、正确率、连续打卡天数
- **内置课程** — 新概念英语 1-4 册、日常口语、商务英语、英语词根
- **全键盘操作** — Enter 批改 / 跳转错误 / 进入下一句，全程无需鼠标

---

## 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 16** | React 全栈框架，App Router |
| **React 19** | UI 组件库 |
| **TypeScript** | 类型安全 |
| **Tailwind CSS 4** | 原子化样式 |
| **Web Speech API** | 浏览器内置语音合成 |
| **localStorage** | 客户端数据持久化 |

---

## 快速开始

```bash
# 克隆项目
git clone https://github.com/Dreamaker203/EnglishLearningAPP.git
cd EnglishLearningAPP

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 即可使用。

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

---

## 项目结构

```
src/
├── app/
│   ├── layout.tsx              # 全局布局 + 导航栏
│   ├── page.tsx                # 首页：课程列表 + 学习统计
│   ├── globals.css             # 全局样式 + 动画
│   ├── learn/[courseId]/
│   │   └── page.tsx            # 学习页：练习界面
│   ├── courses/
│   │   └── page.tsx            # 课程浏览 + 筛选
│   └── upload/
│       └── page.tsx            # 自定义句子上传
├── components/
│   ├── Navbar.tsx              # 顶部导航
│   ├── CourseCard.tsx          # 课程卡片
│   ├── SentenceBreakdown.tsx   # 听音填词（核心）
│   ├── WordAssembly.tsx        # 连词成句（核心）
│   ├── WordReader.tsx          # 逐词朗读
│   ├── ProgressBar.tsx         # 进度条
│   └── ScoreBoard.tsx          # 学习统计
├── lib/
│   ├── types.ts                # TypeScript 类型定义
│   ├── sentence.ts             # 句子处理工具
│   ├── storage.ts              # localStorage 封装
│   └── tts.ts                  # Web Speech API 封装
└── data/
    └── courses.ts              # 内置课程数据
```

---

## 部署

### Vercel（推荐）

1. Push 代码到 GitHub
2. 登录 [vercel.com](https://vercel.com)
3. Import 仓库，自动检测 Next.js，一键部署

### 服务器部署

```bash
npm run build
npm start
```

默认运行在 3000 端口，可用 `PORT` 环境变量修改。

---

## 从菜鸟到大师：技术教程

本节从零开始讲解本项目用到的所有技术，适合没有前端经验的读者。

---

### 第一阶段：起步（了解基础）

#### 1. 什么是 Next.js？

Next.js 是 React 的**全栈框架**。普通的 React 只能在浏览器运行（客户端渲染），Next.js 可以在服务器预先渲染页面（SSR），好处是：

- 首屏加载更快（用户先看到内容，再加载 JS）
- SEO 友好（搜索引擎能读到页面内容）
- 内置路由、API、优化等开箱即用

**本项目中**：`src/app/` 目录就是 Next.js 的 App Router，每个文件夹对应一个 URL 路径。

```
src/app/page.tsx           → /
src/app/courses/page.tsx   → /courses
src/app/learn/[courseId]/page.tsx → /learn/任意ID
```

#### 2. 什么是 React？

React 是 Facebook 开发的 **UI 库**，核心思想是**组件化**：

```tsx
// 一个组件就是一个函数，返回 HTML
function Greeting({ name }: { name: string }) {
  return <h1>你好, {name}!</h1>;
}

// 使用组件
<Greeting name="小明" />
```

**本项目中**：`src/components/` 下每个 `.tsx` 文件都是一个组件。

#### 3. 什么是 TypeScript？

TypeScript = JavaScript + 类型系统。给变量、函数参数加上类型，编译时就能发现错误：

```typescript
// JavaScript（没有类型，运行时才发现错误）
function add(a, b) {
  return a + b;
}
add("hello", 1); // 不报错，但结果是 "hello1"

// TypeScript（编译时就报错）
function add(a: number, b: number): number {
  return a + b;
}
add("hello", 1); // 编译错误！
```

**本项目中**：`src/lib/types.ts` 定义了所有数据结构：

```typescript
interface Sentence {
  id: string;
  english: string;   // 英文句子
  chinese: string;   // 中文翻译
  words: string[];   // 拆分后的单词数组
}
```

#### 4. 什么是 Tailwind CSS？

Tailwind 是**原子化 CSS 框架**，不用写 `.css` 文件，直接在 HTML 上写样式类名：

```html
<!-- 传统 CSS -->
<button class="submit-btn">提交</button>
<!-- 需要另外写 .submit-btn { padding: 8px 16px; ... } -->

<!-- Tailwind CSS -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg">提交</button>
<!-- 每个类名对应一个 CSS 属性，所见即所得 -->
```

常用类名速查：

| 类名 | 含义 |
|------|------|
| `px-4` | 左右内边距 16px |
| `py-2` | 上下内边距 8px |
| `bg-blue-600` | 背景色蓝色 |
| `text-white` | 文字白色 |
| `rounded-lg` | 大圆角 |
| `flex` | 弹性布局 |
| `gap-2` | 子元素间距 8px |
| `text-2xl` | 大字号 |
| `font-bold` | 粗体 |

---

### 第二阶段：进阶（理解核心概念）

#### 5. React 的状态管理 — useState

`useState` 是 React 最核心的 Hook，用于管理**会变化的数据**：

```tsx
const [count, setCount] = useState(0);

// 读取状态
console.log(count); // 0

// 更新状态（触发重新渲染）
setCount(count + 1); // 变成 1
```

**本项目中的实际例子**（`SentenceBreakdown.tsx`）：

```tsx
// 管理练习阶段：preview → playing → checking → done
const [phase, setPhase] = useState<"preview" | "playing" | "checking" | "done">("preview");

// 管理用户输入
const [inputs, setInputs] = useState<string[]>([]);

// 管理正确/错误状态
const [correctSet, setCorrectSet] = useState<Set<number>>(new Set());
```

当用户打字、按 Enter 时，调用 `setXxx` 更新状态，React 自动重新渲染界面。

#### 6. 副作用管理 — useEffect

`useEffect` 用于处理**副作用**：数据获取、订阅、手动 DOM 操作等。

```tsx
// 组件挂载时执行一次
useEffect(() => {
  const data = localStorage.getItem("progress");
  setProgress(data ? JSON.parse(data) : []);
}, []); // 空数组 = 只在挂载时执行

// 当 sentence.id 变化时重置状态
useEffect(() => {
  setPhase("preview");
  setInputs([]);
}, [sentence.id]); // 依赖数组
```

**本项目中的实际例子**：

```tsx
// 切换句子时，重置所有练习状态
useEffect(() => {
  setPhase("preview");
  setInputs([]);
  setCorrectSet(new Set());
  setRevealedSet(new Set());
  setWrongCounts(new Map());
  setFocusIndex(0);
  setTotalErrors(0);
}, [sentence.id]);
```

#### 7. 性能优化 — useCallback

`useCallback` 缓存函数引用，避免每次渲染都创建新函数：

```tsx
// 不用 useCallback：每次渲染都创建新函数
const handleClick = () => { /* ... */ };

// 用 useCallback：函数引用不变，除非依赖变化
const handleClick = useCallback(() => { /* ... */ }, [dependency1, dependency2]);
```

**何时需要**：函数作为 props 传给子组件、作为 useEffect 的依赖时。

#### 8. 引用 DOM 元素 — useRef

`useRef` 可以获取 DOM 元素的引用，常用于**聚焦输入框**：

```tsx
const inputRefs = useRef<HTMLInputElement[]>([]);

// 绑定到 input
<input ref={(el) => { inputRefs.current[i] = el; }} />

// 程序化聚焦
inputRefs.current[0]?.focus(); // 聚焦第一个输入框
```

**本项目中的实际例子**：

```tsx
// 批改后自动聚焦第一个错误单词
const firstWrong = inputIndices.find(i => !correctSet.has(i));
inputRefs.current[firstWrong]?.focus();

// Enter 后跳转下一个错误
setTimeout(() => inputRefs.current[next]?.focus(), 100);
```

---

### 第三阶段：高级（掌握实战技巧）

#### 9. Web Speech API — 浏览器语音合成

不需要任何第三方库，浏览器内置就能朗读英文：

```typescript
function speakText(text: string, lang: string = "en-US", rate: number = 0.9) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;   // 语言
  utterance.rate = rate;   // 语速（0.1 ~ 10）
  window.speechSynthesis.speak(utterance);
}

// 使用
speakText("Hello, how are you?");
```

**本项目中**封装在 `src/lib/tts.ts`：

```typescript
// 逐词朗读，每读一个词触发回调（用于高亮）
export async function speakWordByWord(
  words: string[],
  onWordStart?: (index: number) => void,
) {
  for (let i = 0; i < words.length; i++) {
    onWordStart?.(i);           // 高亮当前单词
    await speakText(words[i]);  // 朗读
    await new Promise(r => setTimeout(r, 100)); // 间隔
  }
}
```

#### 10. localStorage — 浏览器本地存储

数据存在用户浏览器中，刷新不丢失：

```typescript
// 存
localStorage.setItem("progress", JSON.stringify(data));

// 取
const data = JSON.parse(localStorage.getItem("progress") || "[]");

// 删
localStorage.removeItem("progress");
```

**本项目中**封装在 `src/lib/storage.ts`，管理：
- 学习进度（每个句子的完成状态、正确率）
- 自定义课程
- 学习统计（总句子数、学习时长、连续打卡）

#### 11. Next.js App Router 路由

App Router 基于文件系统，文件夹 = URL 路径：

```
src/app/page.tsx                    → /
src/app/courses/page.tsx            → /courses
src/app/learn/[courseId]/page.tsx   → /learn/动态参数
src/app/upload/page.tsx             → /upload
```

**动态路由**用 `[参数名]` 文件夹表示：

```tsx
// src/app/learn/[courseId]/page.tsx
export default function LearnPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  // 访问 /learn/nce-1 时，courseId = "nce-1"
}
```

#### 12. 客户端组件 vs 服务端组件

Next.js App Router 默认所有组件是**服务端组件**（在服务器运行）。需要交互（useState、onClick 等）的组件必须声明为客户端组件：

```tsx
"use client";  // ← 这一行声明是客户端组件

import { useState } from "react";

export default function MyComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**本项目中**：所有需要交互的组件（练习、导航、统计）都是 `"use client"`。

#### 13. Set 和 Map 数据结构

本项目用了 ES6 的 Set 和 Map 来管理状态：

```typescript
// Set — 不重复的集合
const correctSet = new Set<number>();
correctSet.add(0);    // 添加
correctSet.add(1);
correctSet.has(0);    // true
correctSet.has(3);    // false

// Map — 键值对
const wrongCounts = new Map<number, number>();
wrongCounts.set(0, 2);  // 第0个单词错了2次
wrongCounts.get(0);     // 2
wrongCounts.get(1);     // undefined
```

为什么用 Set/Map 而不是数组/对象？因为：
- `Set.has()` 是 O(1)，数组 `includes()` 是 O(n)
- `Map.get()` 是 O(1)，对象访问也是 O(1) 但 Map 的键可以是数字

---

### 第四阶段：融会贯通（核心逻辑拆解）

#### 14. 听音填词的完整流程

这是本项目最核心的功能，拆解每一步：

```
用户进入页面
    ↓
useEffect 重置状态 → phase = "preview"
    ↓
显示完整句子 + 中文翻译 + "开始练习"按钮
    ↓
用户点击"开始"（或按 Enter）
    ↓
startGame(): 重置所有状态，播放语音，聚焦第一个输入框
    ↓
phase = "playing"，用户逐个输入单词
    ↓
每次输入 onChange 更新 inputs 数组
    ↓
最后一个单词输入完，用户按 Enter
    ↓
handleSubmit(): 遍历所有单词，比对输入与正确答案
    ↓
  ├─ 全部正确 → phase = "done"，显示成绩
    ↓
  └─ 有错误 → phase = "checking"，聚焦第一个错误单词并朗读
    ↓
用户修改错误单词，按 Enter
    ↓
handleRetry(): 比对当前单词
    ├─ 正确 → 跳转下一个错误单词
    └─ 错误 → 错误次数+1，朗读该单词
        ├─ < 3 次 → 继续修改
        └─ ≥ 3 次 → 揭晓答案，跳转下一个错误
    ↓
全部正确/揭晓 → phase = "done"，按 Enter 进入下一句
```

#### 15. 状态机设计

练习的四个阶段是一个**有限状态机**（FSM）：

```
preview ──(开始)──→ playing ──(Enter提交)──→ checking ──(全部完成)──→ done
   ↑                   ↑                        │
   │                   └──────(修改错误)──────────┘
   └──────────────────(重新练习)──────────────────┘
```

每个阶段的 UI 和交互逻辑不同：
- `preview`：显示原句，可以朗读
- `playing`：显示输入框，自由填写
- `checking`：只读已正确单词，高亮错误单词，可修改
- `done`：显示成绩，Enter 进入下一句

#### 16. 组件通信模式

父组件（learn page）通过 props 传数据和回调给子组件：

```tsx
// 父组件
<SentenceBreakdown
  sentence={sentence}           // 数据：当前句子
  onComplete={handleComplete}   // 回调：完成练习时
  onNext={goNext}              // 回调：进入下一句
/>

// 子组件
export default function SentenceBreakdown({
  sentence,    // 读取数据
  onComplete,  // 调用回调通知父组件
  onNext,
}: SentenceBreakdownProps) {
  // 完成时调用回调
  onComplete(true, 5.2);  // 告诉父组件：正确，用时5.2秒
}
```

---

### 学习路线图

```
Week 1: HTML + CSS 基础
  └─ 理解标签、选择器、盒模型、Flexbox

Week 2: JavaScript 基础
  └─ 变量、函数、数组、对象、Promise、async/await

Week 3: TypeScript 入门
  └─ 类型注解、interface、泛型、联合类型

Week 4: React 基础
  └─ 组件、JSX、useState、useEffect、props

Week 5: React 进阶
  └─ useCallback、useRef、自定义 Hook、状态管理

Week 6: Next.js 入门
  └─ App Router、SSR vs CSR、动态路由、布局

Week 7: Tailwind CSS
  └─ 原子化类名、响应式设计、暗色模式

Week 8: 实战项目
  └─ 跟着本项目从零实现，理解每一行代码

推荐资源：
- Next.js 官方教程: https://nextjs.org/learn
- React 官方文档: https://react.dev
- TypeScript 手册: https://www.typescriptlang.org/docs
- Tailwind CSS 文档: https://tailwindcss.com/docs
```

---

## License

MIT
