import { Config, Context } from '@netlify/functions';

export default async function (request: Request, context: Context) {
  console.log({ request, context });
  return new Response('Hello World!');
}

export const config: Config = {
  path: '/api/v2-with-config',
};
