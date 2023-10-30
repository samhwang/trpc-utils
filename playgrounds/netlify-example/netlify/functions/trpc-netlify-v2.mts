// import { Config } from '@netlify/functions';
import { netlifyTRPCHandlerV2 } from 'trpc-netlify-functions';
import { appRouter } from '../../trpc/v2/router';
import { createContext } from '../../trpc/v2/context';

// export const config: Config = {
//   path: '/api/v2-with-config/*',
// };

const handler = netlifyTRPCHandlerV2({
  router: appRouter,
  createContext,
  // config,
});

export default handler;
