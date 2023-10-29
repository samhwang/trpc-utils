import {
  FetchInfiniteQueryOptions,
  FetchQueryOptions,
  QueryClient,
  ResetOptions,
  ResetQueryFilters,
} from '@tanstack/react-query';
import {
  CreateTRPCProxyClient,
  TRPCClient,
  TRPCRequestOptions,
} from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import { inferProcedureInput } from '@trpc/server';
import { createContext } from 'react';

export interface TRPCFetchQueryOptions<TInput, TError, TOutput>
  extends FetchQueryOptions<TInput, TError, TOutput>,
    TRPCRequestOptions {}

export interface TRPCFetchInfiniteQueryOptions<TInput, TError, TOutput>
  extends FetchInfiniteQueryOptions<TInput, TError, TOutput>,
    TRPCRequestOptions {}

/** @internal */
export type SSRState = 'mounted' | 'mounting' | 'prepass' | false;

export interface ProxyTRPCContextProps<TRouter extends AnyRouter, TSSRContext> {
  /**
   * The `TRPCClient`
   */
  client: TRPCClient<TRouter>;
  /**
   * The SSR context when server-side rendering
   * @default null
   */
  ssrContext?: TSSRContext | null;
  /**
   * State of SSR hydration.
   * - `false` if not using SSR.
   * - `prepass` when doing a prepass to fetch queries' data
   * - `mounting` before TRPCProvider has been rendered on the client
   * - `mounted` when the TRPCProvider has been rendered on the client
   * @default false
   */
  ssrState?: SSRState;
}

/**
 * @internal
 */
export type DecoratedProxyTRPCContextProps<
  TRouter extends AnyRouter,
  TSSRContext,
> = ProxyTRPCContextProps<TRouter, TSSRContext> & {
  client: CreateTRPCProxyClient<TRouter>;
};

export interface TRPCContextProps<TRouter extends AnyRouter, TSSRContext>
  extends ProxyTRPCContextProps<TRouter, TSSRContext> {
  /**
   * The react-query `QueryClient`
   */
  queryClient: QueryClient;
}

export const contextProps: (keyof ProxyTRPCContextProps<any, any>)[] = [
  'client',
  'ssrContext',
  'ssrState',
  'abortOnUnmount',
];

/** @internal */
type TRPCContextResetQueries<TRouter extends AnyRouter> =
  /**
   * @link https://tanstack.com/query/v4/docs/react/reference/QueryClient#queryclientresetqueries
   */
  ((filters?: ResetQueryFilters, options?: ResetOptions) => Promise<void>) &
    (<
      TPath extends string & keyof TRouter['_def']['queries'],
      TInput extends inferProcedureInput<TRouter['_def']['queries'][TPath]>,
    >(
      pathAndInput?: TPath | [TPath, TInput?],
      filters?: ResetQueryFilters,
      options?: ResetOptions,
    ) => Promise<void>);


export const TRPCContext = createContext(null as unknown);
