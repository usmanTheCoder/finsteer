import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createRouter } from '../createRouter';
import { prisma } from '../db/client';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
});

export const authRouter = createRouter()
  .mutation('register', {
    input: userSchema,
    async resolve({ input }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      return { user, token };
    },
  })
  .mutation('login', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User with this email does not exist',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password',
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      return { user, token };
    },
  });