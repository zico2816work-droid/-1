# AI Login Closed-Loop Demo

这是一个以“AI 打通全链路”为核心目标的试验项目。  
在保留登录闭环业务价值的同时，重点验证“设计稿 → 前端代码 → 业务落地”的高效协作模式，突出极高提效与降低成本。

## 项目亮点

- AI 全链路试验：从设计输入到前端实现，验证可复用的 AI 工程流程。
- 提效与降本导向：减少重复搭建与手工对齐成本，缩短从设计到交付的周期。
- 完整登录闭环：支持测试账号生成、登录、会话保持、鉴权跳转、退出登录。
- 前后端协作清晰：前端原生页面 + Express API，结构简单但职责边界明确。
- 设计落地能力：登录页与后台首页按设计稿还原，适合展示 UI 实现能力。
- 可扩展性好：账号与会话使用本地 JSON 存储，后续可平滑替换为数据库。

## AI 全链路价值（本项目重点）

- 参与 B 端组件库的规范化建设与维护，沉淀统一的组件约束与实现标准。
- 探索基于标准化组件库训练 AI 模型，提升生成代码的一致性与可维护性。
- 结合 MCP 协议与 Skill 技术，实现设计稿到前端代码的无缝对接。
- 将“设计理解、结构拆分、组件映射、代码生成、闭环验证”串成可复用流程，支撑规模化提效。

## 项目功能

- 登录页
  - 账号/密码输入登录
  - 一键生成测试账号（由后端生成，前端不写死）
  - 错误提示与请求 loading 状态
- 登录态与路由保护
  - 未登录访问 `/dashboard` 自动跳转 `/login`
  - 登录成功后跳转 `dashboard` 并显示当前用户名
  - 刷新页面后保持登录态
- 退出机制
  - 点击退出登录后清除服务端会话与 Cookie
  - 自动返回登录页

## UX 设计目标与交互说明

- 低门槛体验：提供“生成测试账号”按钮，让评审或用户无需注册即可快速验证全流程。
- 状态可感知：登录与账号生成均提供 loading / 成功 / 失败反馈，避免“无响应”体验。
- 信息层级清晰：登录页聚焦单任务（完成登录），首页聚焦欢迎与功能入口（操作分区明确）。
- 安全与可预期：未登录强制回跳登录页，退出后立即失效会话，保证访问边界明确。
- 真实业务感：保留协议提示、顶部导航、侧边栏与模块卡片布局，贴近中后台产品形态。

## 技术栈

- 后端：Node.js + Express
- 前端：HTML + CSS + JavaScript（原生）
- 数据存储：本地 JSON
  - `data/users.json`
  - `data/sessions.json`
- 鉴权方式：Cookie + 服务端 Session（HttpOnly）

## API 设计

- `POST /api/create-user`  
  生成测试账号（`username: demo + 随机数字`，`password: 8位随机字符串`）

- `POST /api/login`  
  使用账号密码登录，成功后写入会话 Cookie

- `GET /api/me`  
  获取当前登录用户（未登录返回 `401`）

- `POST /api/logout`  
  退出登录并清理会话

## 目录结构

```txt
.
├── data
│   ├── sessions.json
│   └── users.json
├── public
│   ├── css
│   │   ├── dashboard.css
│   │   └── login.css
│   ├── js
│   │   ├── api.js
│   │   ├── dashboard.js
│   │   └── login.js
│   ├── dashboard.html
│   └── login.html
├── src
│   ├── authService.js
│   ├── config.js
│   ├── dataStore.js
│   ├── security.js
│   └── sessionService.js
├── package.json
└── server.js
```

## 本地运行方式

1. 安装 Node.js（建议 18+）
2. 安装依赖

```bash
npm install
```

3. 启动服务

```bash
npm run start
```

4. 打开浏览器访问

- 登录页：[http://localhost:3000/login](http://localhost:3000/login)
- 后台首页：[http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## 作品集展示建议

- 演示顺序建议：
  1. 点击“生成测试账号”
  2. 自动填充后登录
  3. 展示首页用户名与受保护路由
  4. 退出登录并验证跳转
- 可在作品集说明中重点强调：
  - AI 打通全链路带来的效率提升与成本下降
  - 组件库规范化 + MCP + Skill 的工程化组合价值
  - 鉴权闭环完整性
  - 从设计到实现的还原能力
  - 代码结构与可维护性
