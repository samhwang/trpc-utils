import { netlifyTRPCHandler } from 'trpc-netlify-functions';
import type { Handler } from '@netlify/functions';
import { createContext } from '../trpc/context';
import { appRouter } from '../trpc/router';

export const handler: Handler = netlifyTRPCHandler({
  router: appRouter,
  createContext,
});
