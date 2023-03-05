# tRPC Netlify Functions Adapter

An Adapter to run tRPC Server on Netlify Functions.

## How to use this adapter

### Install dependencies

```shell
npm install @netlify/functions @trpc/server @samhwang/trpc-netlify-functions
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

function createContext(event: HandlerEvent, context: HandlerContext) {
    return {}; // No Context
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

### Use this Netlify Functions Adapter.

Create a file called `trpc.ts` inside your Netlify Functions folder. Default is: `[PROJECT_DIRECTORY]/netlify/functions`
and add the adapter in like so.

```ts
// file: netlify/functions/trpc.ts
import { createContext } from '../../trpc/context';
import { appRouter } from '../../trpc/router';
import { netlifyTRPCHandler } from '@samhwang/trpc-netlify-functions';

export const handler = netlifyTRPCHandler({
  router: appRouter,
  createContext,
});
```

Build and deploy your code, and you can use your Netlify Functions URL to call your function.

| Endpoint   | HTTP URI                                                       |
|------------|----------------------------------------------------------------|
| `users.me` | `GET https://<your-site-url>/.netlify/functions/trpc/users.me` | 
