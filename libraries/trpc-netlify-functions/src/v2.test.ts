import { faker } from '@faker-js/faker';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { CreateNetlifyContextV2Options, netlifyTRPCHandlerV2 } from './v2';
// import { } from './mock-netlify-v2'

function createContext({ request }: CreateNetlifyContextV2Options) {
  return {
    user: request.headers.get('X-USER'),
  };
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const router = t.router({
  hello: t.procedure
    .input(
      z
        .object({
          name: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input, ctx }) => ({
      text: `hello ${input?.name ?? ctx.user ?? 'world'}`,
    })),
  addOne: t.procedure.input(z.object({ counter: z.number().int().min(0) })).mutation(({ input }) => ({
    counter: input.counter + 1,
  })),
  'baby/shark': t.procedure.query(() => ({
    text: 'doo doo doo doo',
  })),
});

const handler = netlifyTRPCHandlerV2({
  router,
  createContext,
});

describe.todo('Netlify Adapter V2 tests', () => {
  it('should say hello if query string is provided', async () => {})

  it("should say hello to context user if query string isn't provided", async () => {})

  it('should process mutation', async () => {})

  it('should handle if there are multiple slashes in the URL', async () => {})
})
