import { inferAsyncReturnType } from '@trpc/server';
import { CreateNetlifyContextV1Options } from 'trpc-netlify-functions';

export function createContext({ event: _event, context: _context }: CreateNetlifyContextV1Options) {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
