import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { prisma } from '../db/client';
import { TRPCError } from '@trpc/server';
import { formatCurrency } from '../../utils/currency';
import { getDayRange, getPreviousMonthRange } from '../../utils/date';

const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        accountId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { accountId, startDate, endDate } = input;
      const userId = ctx.session.user.id;

      const whereClause = {
        userId,
        ...(accountId && { accountId }),
        ...(startDate && endDate && {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      };

      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: { date: 'desc' },
        include: { account: true },
      });

      return transactions.map((tx) => ({
        ...tx,
        amount: formatCurrency(tx.amount),
      }));
    }),

  getMonthlyTotals: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const { startDate, endDate } = getPreviousMonthRange();

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
      include: { account: true },
    });

    const monthlyTotals: { [key: string]: number } = {};

    for (const tx of transactions) {
      const month = tx.date.toLocaleString('default', { month: 'long' });
      const amount = tx.type === 'credit' ? tx.amount : -tx.amount;

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }

      monthlyTotals[month] += amount;
    }

    return monthlyTotals;
  }),

  create: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        type: z.enum(['debit', 'credit']),
        amount: z.number().positive(),
        date: z.string().datetime(),
        description: z.string().max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accountId, type, amount, date, description } = input;
      const userId = ctx.session.user.id;

      const account = await prisma.account.findUnique({
        where: {
          id: accountId,
        },
      });

      if (!account || account.userId !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this account',
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          accountId,
          type,
          amount,
          date: new Date(date),
          description,
          userId,
        },
      });

      return transaction;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        accountId: z.string(),
        type: z.enum(['debit', 'credit']),
        amount: z.number().positive(),
        date: z.string().datetime(),
        description: z.string().max(200),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, accountId, type, amount, date, description } = input;
      const userId = ctx.session.user.id;

      const transaction = await prisma.transaction.findUnique({
        where: {
          id,
        },
        include: { account: true },
      });

      if (!transaction || transaction.account.userId !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to update this transaction',
        });
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id },
        data: {
          accountId,
          type,
          amount,
          date: new Date(date),
          description,
        },
      });

      return updatedTransaction;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      const userId = ctx.session.user.id;

      const transaction = await prisma.transaction.findUnique({
        where: {
          id,
        },
        include: { account: true },
      });

      if (!transaction || transaction.account.userId !== userId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to delete this transaction',
        });
      }

      await prisma.transaction.delete({
        where: {
          id,
        },
      });

      return { success: true };
    }),
});

export default transactionsRouter;