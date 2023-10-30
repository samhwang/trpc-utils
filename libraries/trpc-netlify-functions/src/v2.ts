import { Config, Context } from '@netlify/functions';
import { AnyRouter } from '@trpc/server';
import { HTTPRequest, resolveHTTPResponse } from '@trpc/server/http';
import { BaseNetlifyTRPCProps } from './base';

export interface CreateNetlifyContextV2Options {
  request: Request;
  context: Context;
}

interface NetlifyTRPCProps<TRouter extends AnyRouter> extends BaseNetlifyTRPCProps<TRouter, Request, CreateNetlifyContextV2Options> {
  config?: Config;
}

function nativeRequestToHTTPRequest(request: Request): HTTPRequest {
  throw new Error('Not Implemented');
}

function getTRPCPath(request: Request, configPath: Config['path'] = '/api/trpc'): string {
  // throw new Error('Not Implemented');
  const requestUrl = request.url;
  if (!requestUrl.includes(configPath)) {
  }
}

export function netlifyTRPCHandlerV2<TRouter extends AnyRouter>({ router, batching, createContext, responseMeta, onError, config }: NetlifyTRPCProps<TRouter>) {
  return async (request: Request, context: Context): Promise<Response> => {
    const req = nativeRequestToHTTPRequest(request);
    const path = getTRPCPath(request, config.path);

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

    return new Response(body, {
      headers,
      status,
    });
  };
}
