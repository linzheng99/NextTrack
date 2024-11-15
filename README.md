## Stack

- [Next.js](https://nextjs.org/)
- [Appwrite](https://appwrite.io)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Hono](https://hono.dev/)
- [@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [nuqs](https://nuqs.47ng.com/)
- [@hello-pangea/dnd](https://www.npmjs.com/package/@hello-pangea/dnd)
- [react-big-calendar](https://www.npmjs.com/package/react-big-calendar)


## Appwrite

### Databases

- `workspaces`
  - Attributes
    - `name` - String
    - `userId` - String
    - `image` - String?
    - `inviteCode` - String

- `members`
  - Attributes
    - `userId` - String
    - `workspaceId` - String
    - `role` - Enum

- `projects`
  - Attributes
    - `name` - String
    - `image` - String?
    - `workspaceId` - String

- `tasks`
  - Attributes
    - `workspaceId` - String
    - `name` - String
    - `projectId` - String
    - `assigneeId` - String
    - `description` - String?
    - `dueDate` - Datetime
    - `status` - String
    - `position` - Integer

### Storage

- `images`

## .env.local
```
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_PUBLIC_APPWRITE_DATABASES_ID=
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=
NEXT_PUBLIC_APPWRITE_TASKS_ID=
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=

NEXT_APPWRITE_KEY=
```

## Getting Started

```bash
npm install --legacy-peer-deps

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## File Structure

- app (页面)
  - (auth)           - 认证相关页面布局
  - (dashboard)      - 主面板布局
  - (standalone)     - 独立页面布局
- components (组件)
  - (ui)             - shadcn/ui 组件
- features (功能点)
  - workspaces (工作空间)
    - api (CRUD API)
    - hooks (hooks)
    - components (组件)
    - server (与服务器端交互)
    - queries (查询)
    - schemas (请求的配置)
    - types (类型)
- lib (库)
- config.ts (环境变量配置)


## Routes

- /sign-in         - 登录页
- /sign-up         - 注册页

- /workspaces/create                           - 创建工作区
- /workspaces/[workspaceId]                    - 工作区主页
- /workspaces/[workspaceId]/settings          - 工作区设置
- /workspaces/[workspaceId]/members           - 成员管理

- /workspaces/[workspaceId]/projects          - 项目列表
- /workspaces/[workspaceId]/projects/[projectId]        - 项目详情
- /workspaces/[workspaceId]/projects/[projectId]/settings - 项目设置

- /workspaces/[workspaceId]/tasks             - 任务列表
- /workspaces/[workspaceId]/tasks/[taskId]    - 任务详情


# Study Project

## Original

- [Jira](https://www.atlassian.com/software/jira)
