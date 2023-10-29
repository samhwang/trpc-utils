import {
  inferRouterProxyClient,
  TRPCClient,
  TRPCUntypedClient,
} from '@trpc/client';
import {
  AnyRouter,
  ClientDataTransformerOptions,
  inferRouterContext,
} from '@trpc/server';
import { CreateTRPCReactQueryClientConfig } from '../shared';

interface CreateSSGHelpersInternal<TRouter extends AnyRouter> {
  router: TRouter;
  ctx: inferRouterContext<TRouter>;
  transformer?: ClientDataTransformerOptions;
}

interface CreateSSGHelpersExternal<TRouter extends AnyRouter> {
  client:
    | inferRouterProxyClient<TRouter>
    | TRPCUntypedClient<TRouter>;
}

export type CreateServerSideHelpersOptions<TRouter extends AnyRouter> =
  CreateTRPCReactQueryClientConfig &
    (CreateSSGHelpersExternal<TRouter> | CreateSSGHelpersInternal<TRouter>);
