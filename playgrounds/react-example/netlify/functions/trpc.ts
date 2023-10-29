import { netlifyTRPCHandler } from 'trpc-netlify-functions';
import { createContext } from '../trpc/context';
import { appRouter } from '../trpc/router';

export const handler = netlifyTRPCHandler({
  router: appRouter,
  createContext,
});
