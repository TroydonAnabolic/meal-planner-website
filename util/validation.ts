import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Path of error
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const confirmPasswordSchema = z
  .object({
    code: z.string().min(1, "Verification code is required."),
    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"], // Path of error
  });

export const changePasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"], // Path of error
  });
