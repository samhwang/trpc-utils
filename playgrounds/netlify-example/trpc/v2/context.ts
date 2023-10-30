import { inferAsyncReturnType } from '@trpc/server';
import { CreateNetlifyContextV2Options } from 'trpc-netlify-functions';

export function createContext({ request: _request, context: _context }: CreateNetlifyContextV2Options) {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
