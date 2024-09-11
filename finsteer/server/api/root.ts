import * as trpc from '@trpc/server';
import { z } from 'zod';
import { authRouter } from './auth';
import { accountsRouter } from './accounts';
import { transactionsRouter } from './transactions';
import { reportsRouter } from './reports';
import { settingsRouter } from './settings';

export const appRouter = trpc
  .router()
  .merge('auth.', authRouter)
  .merge('accounts.', accountsRouter)
  .merge('transactions.', transactionsRouter)
  .merge('reports.', reportsRouter)
  .merge('settings.', settingsRouter);

export type AppRouter = typeof appRouter;

export const createContext = async ({ req, res }: trpc.createContextOptions) => {
  const session = await getSession(req);
  return { req, res, session };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;