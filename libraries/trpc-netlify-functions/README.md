# tRPC Netlify Functions Adapter

An Adapter to run tRPC Server on Netlify Functions.

## The Problem

When I'm not building with a framework (like NextJS), but into 2 separate pieces of a Client side, and a Backend running
purely with Netlify Serverless Functions, I often run into cases where tRPC's Lambda Adapter cannot be fully used within
the Netlify Handler, because the event object from Netlify and APIGateway Proxy event object isn't the same.

(An example of this is my [Netlify Fullstack Template](https://github.com/samhwang/fullstack-netlify-template))

## The solution

Inspired by [tRPC SvelteKit](https://github.com/icflorescu/trpc-sveltekit) and [tRPC Lambda Adapter](https://trpc.io/docs/aws-lambda),
I have created this adapter to intercept the Netlify event and convert that into a request to a pure Node server
underneath for tRPC to resolve.

## How to use this adapter

### Install dependencies

```shell
npm install @netlify/functions @trpc/server trpc-netlify-functions
```

### Create a tRPC Router and context

Implement your tRPC router and context. Some samples are given below. Assuming these are created in the `trpc` folder.

```ts
// file: trpc/router.ts
import { initTRPC } from '@trpc/server';

export const t = initTRPC.create();

export const userRouter = t.router({
  me: t.procedure.query((_req) => "hello, it's me"),
});

export const appRouter = t.router({
  users: userRouter,
});

export type AppRouter = typeof appRouter;
```

```ts
// file: trpc/context.ts
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNetlifyContextOptions } from 'trpc-netlify-functions';

export function createContext({ event, context }: CreateNetlifyContextOptions) {
  // Empty context
  return {};
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

### Use this Netlify Functions Adapter

#### With Netlify Functions v1 a.k.a the [Lambda Compatible Handler](https://docs.netlify.com/functions/lambda-compatibility/?fn-language=ts 'Netlify Functions - Lambda Compatibility')

Create a file called `trpc.ts` inside your Netlify Functions folder. Default is: `[PROJECT_DIRECTORY]/netlify/functions`
and add the adapter in like so.

```ts
// file: netlify/functions/trpc.ts
import { netlifyTRPCHandler } from 'trpc-netlify-functions';
import { createContext } from '../../trpc/context';
import { appRouter } from '../../trpc/router';

export const handler = netlifyTRPCHandler({
  router: appRouter,
  createContext,
});
```

Build and deploy your code, and you can use your Netlify Functions URL to call your function.

| Endpoint   | HTTP URI                                                       |
| ---------- | -------------------------------------------------------------- |
| `users.me` | `GET https://<your-site-url>/.netlify/functions/trpc/users.me` |
