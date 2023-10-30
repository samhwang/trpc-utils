import { netlifyTRPCHandlerV1 } from 'trpc-netlify-functions';
import { createContext } from '../../trpc/v1/context';
import { appRouter } from '../../trpc/v1/router';

export const handler = netlifyTRPCHandlerV1({
  router: appRouter,
  createContext,
});
