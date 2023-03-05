import { t } from './builder';
import { userRouter } from './routers/user';

export const appRouter = t.router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
