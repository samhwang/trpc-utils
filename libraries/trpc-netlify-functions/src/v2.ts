import { Context, Config } from '@netlify/functions';
import { AnyRouter, inferRouterContext } from '@trpc/server';
import { HTTPRequest, resolveHTTPResponse } from '@trpc/server/http';
import { BaseNetlifyTRPCProps } from './base';

export interface CreateNetlifyContextOptions {
  request: Request;
  context: Context;
}

type CreateNetlifyHandlerContext<TRouter extends AnyRouter> = (
  opts: CreateNetlifyContextOptions
) => Promise<inferRouterContext<TRouter>> | inferRouterContext<TRouter>;

interface NetlifyTRPCProps<TRouter extends AnyRouter> extends BaseNetlifyTRPCProps<TRouter, Request> {
  /**
   * An async function that returns the tRPC context.
   * @see https://trpc.io/docs/context
   */
  createContext?: CreateNetlifyHandlerContext<TRouter>;
}

function nativeRequestToHTTPRequest(request: Request): HTTPRequest {
  throw new Error('Not Implemented');
}

function getTRPCPath(request: Request, configPath: Config['path'] = '/api/trpc'): string {
  throw new Error('Not Implemented');
}

export function netlifyTRPCHandlerV2<TRouter extends AnyRouter>({ router, batching, createContext, responseMeta, onError }: NetlifyTRPCProps<TRouter>) {
  return async (request: Request, context: Context) => {
    const req = nativeRequestToHTTPRequest(request);
    const path = getTRPCPath(request, '/api/trpc');

    const httpResponse = await resolveHTTPResponse({
      router,
      batching,
      responseMeta,
      createContext: async () => createContext?.({ request, context }),
      path,
      req,
      error: null,
      onError(op) {
        onError?.({
          ...op,
          req: request,
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
