import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { z } from 'zod';
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { HandlerResponse } from '@netlify/functions';
import { netlifyTRPCHandler, CreateNetlifyContextOptions } from './index';
import { mockHandlerContext, mockHandlerEvent } from './mocks/mock-netlify';

function createContext({ event }: CreateNetlifyContextOptions) {
  return {
    user: event.headers['X-USER'],
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

const handler = netlifyTRPCHandler({
  router,
  createContext,
});

describe('Netlify Adapter tests', () => {
  it('should say hello if query string is provided', async () => {
    const name = faker.person.firstName();
    const result = await handler(
      mockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/hello',
        queryStringParameters: { input: JSON.stringify({ name }) },
      }),
      mockHandlerContext()
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body!)).toEqual({ result: { data: { text: `hello ${name}` } } });
  });

  it("should say hello to context user if query string isn't provided", async () => {
    const name = faker.person.firstName();
    const result = await handler(
      mockHandlerEvent({
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json', 'X-USER': name },
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/hello',
        queryStringParameters: {},
      }),
      mockHandlerContext()
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body!)).toEqual({ result: { data: { text: `hello ${name}` } } });
  });

  it('should process mutation', async () => {
    const num = Number.parseInt(faker.random.numeric(2), 10);
    const result = await handler(
      mockHandlerEvent({
        body: JSON.stringify({
          counter: num,
        }),
        headers: { 'Content-Type': 'application/json' },
        httpMethod: 'POST',
        path: '/.netlify/functions/trpc/addOne',
        queryStringParameters: {},
      }),
      mockHandlerContext()
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body!)).toEqual({ result: { data: { counter: num + 1 } } });
  });

  it('should handle if there are multiple slashes in the URL', async () => {
    const result = await handler(
      mockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/baby/shark',
        queryStringParameters: {},
      }),
      mockHandlerContext()
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body!)).toEqual({ result: { data: { text: 'doo doo doo doo' } } });
  });
});
