import { faker } from '@faker-js/faker';
import { HandlerResponse } from '@netlify/functions';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { getMockHandlerContext, getMockHandlerEvent } from './mock-netlify';
import { CreateNetlifyContextV1Options, netlifyTRPCHandlerV1 } from './v1';

function createContext({ event }: CreateNetlifyContextV1Options) {
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
  'throw/error': t.procedure.query(() => {
    throw new Error('Got into error path');
  }),
});

const handler = netlifyTRPCHandlerV1({
  router,
  createContext,
});

const mockHandlerContext = getMockHandlerContext();

describe('Netlify Adapter V1 tests', () => {
  it('should say hello if query string is provided', async () => {
    const name = faker.person.firstName();
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/hello',
        queryStringParameters: { input: JSON.stringify({ name }) },
      }),
      mockHandlerContext
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body as string)).toEqual({ result: { data: { text: `hello ${name}` } } });
  });

  it("should say hello to context user if query string isn't provided", async () => {
    const name = faker.person.firstName();
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json', 'X-USER': name },
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/hello',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body as string)).toEqual({ result: { data: { text: `hello ${name}` } } });
  });

  it('should process mutation', async () => {
    const num = Number.parseInt(faker.string.numeric(2), 10);
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({
          counter: num,
        }),
        headers: { 'Content-Type': 'application/json' },
        httpMethod: 'POST',
        path: '/.netlify/functions/trpc/addOne',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body as string)).toEqual({ result: { data: { counter: num + 1 } } });
  });

  it('should handle if there are multiple slashes in the URL', async () => {
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/baby/shark',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers, body } = result as HandlerResponse;
    expect(statusCode).toEqual(200);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(body as string)).toEqual({ result: { data: { text: 'doo doo doo doo' } } });
  });

  it('should throw error on empty path', async () => {
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers } = result as HandlerResponse;
    expect(statusCode).toEqual(404);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should throw error on path not found', async () => {
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/throw/error',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers } = result as HandlerResponse;
    expect(statusCode).toEqual(500);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should throw error when procedure throws error', async () => {
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/error/path',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers } = result as HandlerResponse;
    expect(statusCode).toEqual(404);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
  });

  it('should call the on error callback', async () => {
    const onError = vi.fn();
    const handler = netlifyTRPCHandlerV1({
      router,
      createContext,
      onError,
    });
    const result = await handler(
      getMockHandlerEvent({
        body: JSON.stringify({}),
        headers: {},
        httpMethod: 'GET',
        path: '/.netlify/functions/trpc/error/path',
        queryStringParameters: {},
      }),
      mockHandlerContext
    );
    const { statusCode, headers } = result as HandlerResponse;
    expect(statusCode).toEqual(404);
    expect(headers).toEqual({ 'Content-Type': 'application/json' });
    expect(onError).toHaveBeenCalled();
  });
});
