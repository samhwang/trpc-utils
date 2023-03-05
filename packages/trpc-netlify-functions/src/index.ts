import { AnyRouter, inferRouterContext, inferRouterError, TRPCError, ProcedureType } from '@trpc/server';
import { resolveHTTPResponse, ResponseMeta } from '@trpc/server/http';
import { TRPCResponse } from '@trpc/server/rpc';
import { HandlerEvent, HandlerContext, Handler } from '@netlify/functions';
import { URLSearchParams } from 'url';

interface NetlifyTRPCHandlerProps<TRouter extends AnyRouter> {
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
   * An async function that returns the tRPC context.
   * @see https://trpc.io/docs/context
   */
  createContext?: (
    event: HandlerEvent,
    context: HandlerContext
  ) => Promise<inferRouterContext<TRouter>> | inferRouterContext<TRouter>;

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
    req: HandlerEvent;
    input: unknown;
  }) => void;
}

function netlifyEventToHTTPRequest(event: HandlerEvent) {
  const query = Object.entries(event.queryStringParameters ?? {}).reduce((queryParams, [key, value]) => {
    if (typeof value === 'undefined') {
      return queryParams;
    }

    queryParams.append(key, value);
    return queryParams;
  }, new URLSearchParams());

  const body: string | null | undefined =
    event.body && event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;

  return {
    method: event.httpMethod,
    query,
    body,
    headers: event.headers,
  };
}

function getTRPCPath(path: HandlerEvent['path'] = '/.netlify/functions/trpc') {
  return path.substring(path.lastIndexOf('/') + 1);
}

export function netlifyTRPCHandler<TRouter extends AnyRouter>({
  router,
  batching,
  createContext,
  responseMeta,
  onError,
}: NetlifyTRPCHandlerProps<TRouter>): Handler {
  return async (event, context) => {
    const req = netlifyEventToHTTPRequest(event);
    const path = getTRPCPath(event.path);

    const httpResponse = await resolveHTTPResponse({
      router,
      batching,
      responseMeta,
      createContext: async () => createContext?.(event, context),
      path,
      req,
      error: null,
      onError(op) {
        onError?.({
          ...op,
          req: event,
        });
      },
    });

    const { status, headers, body } = httpResponse as {
      status: number;
      headers: Record<string, string>;
      body: string;
    };

    return {
      statusCode: status,
      headers,
      body,
    };
  };
}
