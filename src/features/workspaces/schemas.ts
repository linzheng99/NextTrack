import { z } from "zod";

export const carateWorkspacesSchema = z.object({
  name: z.string().min(1, {
    message: "请输入工作空间名称",
  }),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === '' ? undefined : value)
  ]).optional()
})

export const updateWorkspacesSchema = z.object({
  name: z.string().min(1, {
    message: "请输入工作空间名称",
  }),
  image: z.union([
    z.instanceof(File),
    z.string().transform((value) => value === '' ? undefined : value)
  ]).optional()
})
