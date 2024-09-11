import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { prisma } from '../db/client';

export const accountsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const accounts = await prisma.account.findMany({
      where: { userId: ctx.userId },
      include: { transactions: true },
    });
    return accounts;
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const account = await prisma.account.findFirst({
        where: { id: input.id, userId: ctx.userId },
        include: { transactions: true },
      });
      if (!account) throw new TRPCError({ code: 'NOT_FOUND', message: 'Account not found' });
      return account;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'OTHER']),
        balance: z.number().optional(),
        currency: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const account = await prisma.account.create({
        data: { ...input, userId: ctx.userId },
      });
      return account;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'OTHER']).optional(),
        balance: z.number().optional(),
        currency: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const account = await prisma.account.findFirst({
        where: { id: input.id, userId: ctx.userId },
      });
      if (!account) throw new TRPCError({ code: 'NOT_FOUND', message: 'Account not found' });

      const updatedAccount = await prisma.account.update({
        where: { id: input.id },
        data: input,
      });
      return updatedAccount;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const account = await prisma.account.findFirst({
        where: { id: input.id, userId: ctx.userId },
      });
      if (!account) throw new TRPCError({ code: 'NOT_FOUND', message: 'Account not found' });

      await prisma.account.delete({ where: { id: input.id } });
      return { success: true };
    }),
});