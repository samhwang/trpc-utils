import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../netlify/trpc/router';

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: '/.netlify/functions/trpc' })],
});

export default client;
