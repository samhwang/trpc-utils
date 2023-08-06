import { z } from 'zod';
import { publicProcedure, router } from './builder';

export const userRouter = router({
  me: publicProcedure.query((_req) => "hello, it's me"),
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => `hello ${input}`),
  changeName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(({ input }) => ({ name: `Mutated ${input}` })),
});

export const appRouter = router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
