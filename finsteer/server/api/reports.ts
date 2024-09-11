import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "@/server/db/client";
import { TRPCError } from "@trpc/server";
import { getMonthlyTransactionsReport, getTransactionCategoriesReport } from "@/utils/reporting";

export const reportsRouter = createRouter()
  .query("getMonthlyTransactionsReport", {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ input }) {
      const { startDate, endDate } = input;

      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          account: true,
        },
      });

      return getMonthlyTransactionsReport(transactions, startDate, endDate);
    },
  })
  .query("getTransactionCategoriesReport", {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ input }) {
      const { startDate, endDate } = input;

      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          category: true,
        },
      });

      return getTransactionCategoriesReport(transactions);
    },
  })
  .mutation("exportTransactionsToCSV", {
    input: z.object({
      startDate: z.date(),
      endDate: z.date(),
    }),
    async resolve({ input }) {
      const { startDate, endDate } = input;

      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          account: true,
          category: true,
        },
      });

      if (!transactions || transactions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No transactions found for the given date range.",
        });
      }

      const csvData = transactions.map((transaction) => {
        return `${transaction.date},${transaction.account.name},${transaction.category.name},${transaction.amount},${transaction.description}`;
      });

      const csvContent = csvData.join("\n");
      const csv = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      return {
        csv,
        filename: `transactions_${startDate.toISOString()}_to_${endDate.toISOString()}.csv`,
      };
    },
  });