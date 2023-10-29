import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { type ReactNode } from 'react';
import type { AppRouter } from '../../netlify/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/.netlify/functions/trpc',
    }),
  ],
});

const queryClient = new QueryClient();

type TRPCProviderProps = {
  children: ReactNode | undefined;
};

export function TRPCProvider({ children }: TRPCProviderProps) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
