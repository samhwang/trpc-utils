import { InfiniteData } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/client';
import {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  AnySubscriptionProcedure,
  inferProcedureInput,
  ProcedureRouterRecord,
  ProtectedIntersection,
} from '@trpc/server';
import {
  createFlatProxy,
  inferTransformedProcedureOutput,
  inferTransformedSubscriptionOutput,
} from '@trpc/server/shared';
import { useMemo } from 'react';
import { QueryKey, QueryType } from './internals/getArrayQueryKey';
import { TRPCUseQueries } from './internals/useQueries';
import {
  createReactProxyDecoration,
  createReactQueryUtilsProxy,
  CreateReactUtilsProxy,
} from './shared';
import {
  createHooksInternal,
  CreateReactQueryHooks,
} from './shared/hooks/createRootHooks';
import {
  CreateClient,
  DefinedUseTRPCQueryOptions,
  DefinedUseTRPCQueryResult,
  TRPCProvider,
  UseDehydratedState,
  UseTRPCInfiniteQueryOptions,
  UseTRPCInfiniteQueryResult,
  UseTRPCInfiniteQuerySuccessResult,
  UseTRPCMutationOptions,
  UseTRPCMutationResult,
  UseTRPCQueryOptions,
  UseTRPCQueryResult,
  UseTRPCQuerySuccessResult,
  UseTRPCSubscriptionOptions,
} from './shared/hooks/types';
import { CreateTRPCReactOptions } from './shared/types';

/**
 * @internal
 */
export interface ProcedureUseQuery<
  TProcedure extends AnyProcedure,
  TPath extends string,
> {
  <
    TQueryFnData extends inferTransformedProcedureOutput<TProcedure> = inferTransformedProcedureOutput<TProcedure>,
    TData = TQueryFnData,
  >(
    input: inferProcedureInput<TProcedure>,
    opts: DefinedUseTRPCQueryOptions<
      TPath,
      inferProcedureInput<TProcedure>,
      TQueryFnData,
      TData,
      TRPCClientErrorLike<TProcedure>,
      inferTransformedProcedureOutput<TProcedure>
    >,
  ): DefinedUseTRPCQueryResult<TData, TRPCClientErrorLike<TProcedure>>;

  <
    TQueryFnData extends inferTransformedProcedureOutput<TProcedure> = inferTransformedProcedureOutput<TProcedure>,
    TData = TQueryFnData,
  >(
    input: inferProcedureInput<TProcedure>,
    opts?: UseTRPCQueryOptions<
      TPath,
      inferProcedureInput<TProcedure>,
      TQueryFnData,
      TData,
      TRPCClientErrorLike<TProcedure>,
      inferTransformedProcedureOutput<TProcedure>
    >,
  ): UseTRPCQueryResult<TData, TRPCClientErrorLike<TProcedure>>;
}

/**
 * @internal
 */
export type DecorateProcedure<
  TProcedure extends AnyProcedure,
  _TFlags,
  TPath extends string,
> = TProcedure extends AnyQueryProcedure
  ? (inferProcedureInput<TProcedure> extends { cursor?: any } | void
      ? {
          /**
           * @see https://trpc.io/docs/client/react/suspense#useinfinitesuspensequery
           */
          useInfiniteQuery: (
            input: Omit<inferProcedureInput<TProcedure>, 'cursor'>,
            opts?: UseTRPCInfiniteQueryOptions<
              TPath,
              inferProcedureInput<TProcedure>,
              inferTransformedProcedureOutput<TProcedure>,
              TRPCClientErrorLike<TProcedure>
            >,
          ) => UseTRPCInfiniteQueryResult<
            inferTransformedProcedureOutput<TProcedure>,
            TRPCClientErrorLike<TProcedure>
          >;
          /**
           * @see https://trpc.io/docs/client/react/suspense
           */
          useSuspenseInfiniteQuery: (
            input: Omit<inferProcedureInput<TProcedure>, 'cursor'>,
            opts?: Omit<
              UseTRPCInfiniteQueryOptions<
                TPath,
                inferProcedureInput<TProcedure>,
                inferTransformedProcedureOutput<TProcedure>,
                TRPCClientErrorLike<TProcedure>
              >,
              'enabled' | 'suspense'
            >,
          ) => [
            InfiniteData<inferTransformedProcedureOutput<TProcedure>>,
            UseTRPCInfiniteQuerySuccessResult<
              inferTransformedProcedureOutput<TProcedure>,
              TRPCClientErrorLike<TProcedure>
            >,
          ];
        }
      : object) & {

      /**
       * @see https://trpc.io/docs/client/react/useQuery
       */
      useQuery: ProcedureUseQuery<TProcedure, TPath>;
      /**
       * @see https://trpc.io/docs/client/react/suspense#usesuspensequery
       */
      useSuspenseQuery: <
        TQueryFnData extends inferTransformedProcedureOutput<TProcedure> = inferTransformedProcedureOutput<TProcedure>,
        TData = TQueryFnData,
      >(
        input: inferProcedureInput<TProcedure>,
        opts?: Omit<
          UseTRPCQueryOptions<
            TPath,
            inferProcedureInput<TProcedure>,
            TQueryFnData,
            TData,
            TRPCClientErrorLike<TProcedure>
          >,
          'enabled' | 'suspense'
        >,
      ) => [
        TData,
        UseTRPCQuerySuccessResult<TData, TRPCClientErrorLike<TProcedure>>,
      ];
    }
  : TProcedure extends AnyMutationProcedure
  ? {
      /**
       * @see https://trpc.io/docs/client/react/useMutation
       */
      useMutation: <TContext = unknown>(
        opts?: UseTRPCMutationOptions<
          inferProcedureInput<TProcedure>,
          TRPCClientErrorLike<TProcedure>,
          inferTransformedProcedureOutput<TProcedure>,
          TContext
        >,
      ) => UseTRPCMutationResult<
        inferTransformedProcedureOutput<TProcedure>,
        TRPCClientErrorLike<TProcedure>,
        inferProcedureInput<TProcedure>,
        TContext
      >;
    }
  : TProcedure extends AnySubscriptionProcedure
  ? {
      /**
       * @see https://trpc.io/docs/subscriptions
       */
      useSubscription: (
        input: inferProcedureInput<TProcedure>,
        opts?: UseTRPCSubscriptionOptions<
          inferTransformedSubscriptionOutput<TProcedure>,
          TRPCClientErrorLike<TProcedure>
        >,
      ) => void;
    }
  : never;

/**
 * @internal
 */
export type DecoratedProcedureRecord<
  TProcedures extends ProcedureRouterRecord,
  TFlags,
  TPath extends string = '',
> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<
        TProcedures[TKey]['_def']['record'],
        TFlags,
        `${TPath}${TKey & string}.`
      >
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey], TFlags, `${TPath}${TKey & string}`>
    : never;
};

/**
 * @internal
 */
export type CreateTRPCReactBase<TRouter extends AnyRouter, TSSRContext> = {
  /**
   * @see https://trpc.io/docs/client/react/useContext
   */
  useContext(): CreateReactUtilsProxy<TRouter, TSSRContext>;
  Provider: TRPCProvider<TRouter, TSSRContext>;
  createClient: CreateClient<TRouter>;
  useQueries: TRPCUseQueries<TRouter>;
  useDehydratedState: UseDehydratedState<TRouter>;
};

export type CreateTRPCReact<
  TRouter extends AnyRouter,
  TSSRContext,
  TFlags,
> = ProtectedIntersection<
  CreateTRPCReactBase<TRouter, TSSRContext>,
  DecoratedProcedureRecord<TRouter['_def']['record'], TFlags>
>;

/**
 * @internal
 */
export function createHooksInternalProxy<
  TRouter extends AnyRouter,
  TSSRContext = unknown,
  TFlags = null,
>(trpc: CreateReactQueryHooks<TRouter, TSSRContext>) {
  type CreateHooksInternalProxy = CreateTRPCReact<TRouter, TSSRContext, TFlags>;

  return createFlatProxy<CreateHooksInternalProxy>((key) => {
    if (key === 'useContext') {
      return () => {
        const context = trpc.useContext();
        // create a stable reference of the utils context
        return useMemo(() => {
          return (createReactQueryUtilsProxy as any)(context);
        }, [context]);
      };
    }

    if (trpc.hasOwnProperty(key)) {
      return (trpc as any)[key];
    }

    return createReactProxyDecoration(key, trpc);
  });
}

export function createTRPCReact<
  TRouter extends AnyRouter,
  TSSRContext = unknown,
  TFlags = null,
>(
  opts?: CreateTRPCReactOptions<TRouter>,
): CreateTRPCReact<TRouter, TSSRContext, TFlags> {
  const hooks = createHooksInternal<TRouter, TSSRContext>(opts);
  const proxy = createHooksInternalProxy<TRouter, TSSRContext, TFlags>(hooks);

  return proxy as any;
}
