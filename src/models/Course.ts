import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Zod schema for course validation
export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price cannot be negative'),
  status: z.enum(['draft', 'active']),
  teacherId: z.string(),
});

export type Course = z.infer<typeof courseSchema> & {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}; 