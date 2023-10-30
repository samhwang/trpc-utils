import { Config, Context } from '@netlify/functions';

export default async function (request: Request, context: Context) {
  console.log('REQUEST');
  console.log(request);
  return new Response('Hello World!');
}

export const config: Config = {
  path: '/api/v2-with-config',
};
