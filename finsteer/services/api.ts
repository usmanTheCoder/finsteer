import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { getServerAuthSession } from "~/server/auth";

const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const apiRouter = createTRPCRouter({
  auth: router => ({
    register: publicProcedure
      .input(userAuthSchema)
      .mutation(async ({ input }) => {
        const { email, password } = input;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          throw new TRPCError({ code: "CONFLICT", message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: { email, password: hashedPassword },
        });
        return { message: "User registered successfully", user };
      }),
    login: publicProcedure
      .input(userAuthSchema)
      .mutation(async ({ input }) => {
        const { email, password } = input;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
        }
        return { message: "Login successful", user };
      }),
    logout: privateProcedure.mutation(async ({ ctx }) => {
      ctx.session = null;
      return { message: "Logout successful" };
    }),
    getUser: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      return user;
    }),
  }),
  accounts: router => ({
    getAll: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const accounts = await prisma.account.findMany({
        where: { userId: session.user.id },
      });
      return accounts;
    }),
    create: privateProcedure
      .input(
        z.object({
          name: z.string().min(1),
          type: z.string(),
          balance: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const account = await prisma.account.create({
          data: { ...input, userId: session.user.id },
        });
        return account;
      }),
    update: privateProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          type: z.string().optional(),
          balance: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const account = await prisma.account.updateMany({
          where: { id: input.id, userId: session.user.id },
          data: input,
        });
        return account;
      }),
    delete: privateProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const account = await prisma.account.deleteMany({
          where: { id: input.id, userId: session.user.id },
        });
        return account;
      }),
  }),
  transactions: router => ({
    getAll: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        include: { account: true },
      });
      return transactions;
    }),
    create: privateProcedure
      .input(
        z.object({
          description: z.string().min(1),
          type: z.string(),
          amount: z.number(),
          accountId: z.string(),
          date: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const transaction = await prisma.transaction.create({
          data: { ...input, userId: session.user.id },
        });
        return transaction;
      }),
    update: privateProcedure
      .input(
        z.object({
          id: z.string(),
          description: z.string().optional(),
          type: z.string().optional(),
          amount: z.number().optional(),
          accountId: z.string().optional(),
          date: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const transaction = await prisma.transaction.updateMany({
          where: { id: input.id, userId: session.user.id },
          data: input,
        });
        return transaction;
      }),
    delete: privateProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const transaction = await prisma.transaction.deleteMany({
          where: { id: input.id, userId: session.user.id },
        });
        return transaction;
      }),
  }),
  reports: router => ({
    getExpensesByCategory: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const expensesByCategory = await prisma.$queryRaw`
        SELECT type, SUM(amount) AS total
        FROM "Transaction"
        WHERE "userId" = ${session.user.id} AND type = 'expense'
        GROUP BY type;
      `;
      return expensesByCategory;
    }),
    getIncomeByMonth: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const incomeByMonth = await prisma.$queryRaw`
        SELECT DATE_PART('month', date) AS month, SUM(amount) AS total
        FROM "Transaction"
        WHERE "userId" = ${session.user.id} AND type = 'income'
        GROUP BY month
        ORDER BY month;
      `;
      return incomeByMonth;
    }),
    getTopExpenseAccounts: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const topExpenseAccounts = await prisma.$queryRaw`
        SELECT a."name", SUM(t.amount) AS total
        FROM "Transaction" t
        JOIN "Account" a ON t."accountId" = a.id
        WHERE t."userId" = ${session.user.id} AND t.type = 'expense'
        GROUP BY a.id
        ORDER BY total DESC
        LIMIT 5;
      `;
      return topExpenseAccounts;
    }),
  }),
  settings: router => ({
    getSettings: privateProcedure.query(async ({ ctx }) => {
      const session = await getServerAuthSession(ctx);
      if (!session) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
      }
      const settings = await prisma.settings.findUnique({
        where: { userId: session.user.id },
      });
      return settings;
    }),
    updateSettings: privateProcedure
      .input(
        z.object({
          currency: z.string().optional(),
          dateFormat: z.string().optional(),
          theme: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const session = await getServerAuthSession(ctx);
        if (!session) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
        }
        const settings = await prisma.settings.upsert({
          where: { userId: session.user.id },
          create: { ...input, userId: session.user.id },
          update: input,
        });
        return settings;
      }),
  }),
});