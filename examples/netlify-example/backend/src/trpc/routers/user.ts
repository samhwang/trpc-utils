import { t } from '../builder';

export const userRouter = t.router({
  me: t.procedure.query((_req) => "hello, it's me"),
});
