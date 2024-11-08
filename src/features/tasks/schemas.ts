import { z } from "zod";

import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, {
    message: "请输入任务名称",
  }),
  status: z.nativeEnum(TaskStatus, {
    required_error: "请选择任务状态",
  }),
  workspaceId: z.string().trim().min(1, {
    message: "请选择工作区",
  }),
  projectId: z.string().trim().min(1, {
    message: "请选择项目",
  }),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, {
    message: "请选择执行人",
  }),
  description: z.string().optional(),
})
