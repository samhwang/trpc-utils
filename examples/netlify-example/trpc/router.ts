import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

export const userRouter = t.router({
  me: t.procedure.query((_req) => "hello, it's me"),
});

export const appRouter = t.router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
