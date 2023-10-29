import { HandlerEvent } from '@netlify/functions';
import { AnyRouter, ProcedureType, TRPCError, inferRouterContext, inferRouterError } from '@trpc/server';
import { ResponseMeta } from '@trpc/server/http';
import { TRPCResponse } from '@trpc/server/rpc';

export interface BaseNetlifyTRPCProps<TRouter extends AnyRouter, TEvent extends Request | HandlerEvent> {
  /**
   * The tRPC router to use.
   * @see https://trpc.io/docs/router
   */
  router: TRouter;

  /**
   * Enable batching
   * @see https://trpc.io/docs/links/httpBatchLink#disabling-request-batching
   */
  batching?: {
    enabled: boolean;
  };

  /**
   * A function that returns the response meta.
   * @see https://trpc.io/docs/caching#using-responsemeta-to-cache-responses
   */
  responseMeta?: (opts: {
    data: TRPCResponse<unknown, inferRouterError<TRouter>>[];
    ctx?: inferRouterContext<TRouter>;
    paths?: string[];
    type: ProcedureType | 'unknown';
    errors: TRPCError[];
  }) => ResponseMeta;

  /**
   * A function that is called when an error occurs.
   * @see https://trpc.io/docs/error-handling#handling-errors
   */
  onError?: (opts: {
    error: TRPCError;
    type: ProcedureType | 'unknown';
    path?: string;
    req: TEvent;
    input: unknown;
  }) => void;
}
