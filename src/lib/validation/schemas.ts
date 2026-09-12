import { z } from 'zod';

export const createQuestSchema = z.object({
  title: z.string().min(1, 'Quest title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional().default(''),
  category: z.enum(['coding', 'learning', 'fitness', 'health', 'mindfulness', 'creative', 'social', 'other']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  attribute: z.enum(['intellect', 'strength', 'vitality', 'discipline', 'creativity', 'social']),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date (use YYYY-MM-DD)').optional().nullable(),
  is_recurring: z.boolean().optional().default(false),
});

export const updateQuestSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(['coding', 'learning', 'fitness', 'health', 'mindfulness', 'creative', 'social', 'other']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  attribute: z.enum(['intellect', 'strength', 'vitality', 'discipline', 'creativity', 'social']).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date (use YYYY-MM-DD)').optional().nullable(),
  is_recurring: z.boolean().optional(),
});

export const purchaseItemSchema = z.object({
  item_id: z.string().uuid('Invalid item ID'),
});

export const equipItemSchema = z.object({
  equipped: z.boolean(),
});

export const updateProfileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').max(30, 'Username too long').optional(),
  avatar_url: z.string().url('Invalid URL').optional().nullable(),
});

export const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    username: z.string().min(2, 'Username must be at least 2 characters').max(30, 'Username too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Export inferred types
export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
export type PurchaseItemInput = z.infer<typeof purchaseItemSchema>;
export type EquipItemInput = z.infer<typeof equipItemSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
