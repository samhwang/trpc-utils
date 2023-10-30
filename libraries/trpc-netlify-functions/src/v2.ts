import { Config, Context } from '@netlify/functions';
import { AnyRouter } from '@trpc/server';
import { HTTPRequest, resolveHTTPResponse } from '@trpc/server/http';
import { BaseNetlifyTRPCProps } from './base';

export interface CreateNetlifyContextV2Options {
  request: Request;
  context: Context;
}

type NetlifyTRPCProps<TRouter extends AnyRouter> = BaseNetlifyTRPCProps<TRouter, Request, CreateNetlifyContextV2Options>;

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
