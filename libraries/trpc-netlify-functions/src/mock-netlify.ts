import { Context, HandlerContext, HandlerEvent } from '@netlify/functions';

interface MockHandlerEventOptions extends Partial<HandlerEvent> {
  body: string;
  path: string;
  httpMethod: string;
  headers: Record<string, string>;
  queryStringParameters: Record<string, string>;
  isBase64Encoded?: boolean;
}

export function getMockHandlerEvent({ body, path, httpMethod, headers, queryStringParameters, isBase64Encoded }: MockHandlerEventOptions): HandlerEvent {
  return {
    body,
    path,
    httpMethod,
    headers,
    queryStringParameters,
    isBase64Encoded: isBase64Encoded ?? false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    rawQuery: '',
    rawUrl: '',
  };
}

export function getMockHandlerContext(): HandlerContext {
  return {
    awsRequestId: 'asdfasdf1234',
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'fake',
    functionVersion: 'fake',
    invokedFunctionArn: 'fake',
    logGroupName: 'fake',
    logStreamName: 'fake',
    memoryLimitInMB: 'fake',
    done(_error?: Error, _result?: unknown): void {},
    fail(_error: Error | string): void {},
    getRemainingTimeInMillis(): number {
      return 10000;
    },
    succeed(_messageOrObject: unknown, _object?: unknown): void {},
  };
}

interface MockRequestOptions extends Partial<Request> {}

export function getMockRequest(options: MockRequestOptions): Request {
  throw new Error('Not implemented')
}

export function getMockContext(): Context {
  throw new Error('Not implemented')
}
