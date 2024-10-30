import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "最少需要8位",
  }),
})

export const registerSchema = z.object({
  username: z.string().trim().min(1, { message: '请输入用户名' }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: "最少需要8位",
  }),
})
