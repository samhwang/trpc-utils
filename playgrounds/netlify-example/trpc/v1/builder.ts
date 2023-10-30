import { initTRPC } from '@trpc/server';
import { Context } from './context';

export const t = initTRPC.context<Context>().create();
export const { router } = t;
export const publicProcedure = t.procedure;
