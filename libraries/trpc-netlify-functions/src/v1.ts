import { URLSearchParams } from 'url';
import { Handler, HandlerContext, HandlerEvent } from '@netlify/functions';
import { AnyRouter } from '@trpc/server';
import { HTTPRequest, resolveHTTPResponse } from '@trpc/server/http';
import { BaseNetlifyTRPCProps } from './base';

export interface CreateNetlifyContextV1Options {
  event: HandlerEvent;
  context: HandlerContext;
}

type NetlifyTRPCHandlerProps<TRouter extends AnyRouter> = BaseNetlifyTRPCProps<TRouter, HandlerEvent, CreateNetlifyContextV1Options>

function netlifyEventToHTTPRequest(event: HandlerEvent): HTTPRequest {
  const query = Object.entries(event.queryStringParameters ?? {}).reduce((queryParams, [key, value]) => {
    if (typeof value === 'undefined') {
      return queryParams;
    }

    queryParams.append(key, value);
    return queryParams;
  }, new URLSearchParams());

  const body: string | null | undefined = event.body && event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;

  return {
    method: event.httpMethod,
    query,
    body,
    headers: event.headers,
  };
}

function getTRPCPath(path: HandlerEvent['path']): string {
  const NETLIFY_ROOT = '/.netlify/functions/';
  const queryKey = path.substring(NETLIFY_ROOT.length);
  return queryKey.substring(queryKey.indexOf('/') + 1);
}

export function netlifyTRPCHandlerV1<TRouter extends AnyRouter>({
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
      createContext: async () => createContext?.({ event, context }),
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
