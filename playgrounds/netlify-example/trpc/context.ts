import { inferAsyncReturnType } from '@trpc/server';
import { CreateNetlifyHandlerContextOptions } from 'trpc-netlify-functions';

export function createContext({ event: _event, context: _context }: CreateNetlifyHandlerContextOptions) {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
