import { z } from "zod";

export const carateWorkspacesSchema = z.object({
  name: z.string().min(1, {
    message: "请输入工作区",
  }),
})
