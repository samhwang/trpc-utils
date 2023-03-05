import { HandlerContext, HandlerEvent } from '@netlify/functions';
import { inferAsyncReturnType } from '@trpc/server';

export function createContext(_event: HandlerEvent, _context: HandlerContext) {
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
