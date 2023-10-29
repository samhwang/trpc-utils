import { netlifyTRPCHandlerV1 } from 'trpc-netlify-functions';
import { createContext } from '../trpc/context';
import { appRouter } from '../trpc/router';

export const handler = netlifyTRPCHandlerV1({
  router: appRouter,
  createContext,
});
