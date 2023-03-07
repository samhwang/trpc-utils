import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.create();

export const userRouter = t.router({
  me: t.procedure.query((_req) => "hello, it's me"),
  hello: t.procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => `hello ${input.name}`),
  changeName: t.procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ input }) => ({ name: `Mutated ${input.name}` })),
});

export const appRouter = t.router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
