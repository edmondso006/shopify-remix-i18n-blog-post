import { PassThrough } from 'stream';
import { createReadableStreamFromReadable, type EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { createInstance } from 'i18next';
import i18next from './i18next.server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
// BUG: if you see an error about a `Top Level await` import form /cjs instead
// see: https://github.com/i18next/i18next-fs-backend/issues/57
// import Backend from 'i18next-fs-backend';
import Backend from 'i18next-fs-backend/cjs'
import i18n from './i18n'; // your i18n configuration file
import { resolve } from 'node:path';
import { addDocumentResponseHeaders } from './shopify.server';

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  addDocumentResponseHeaders(request, responseHeaders);

  const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady';

  const instance = createInstance();
  const lng = await i18next.getLocale(request);
  const ns = i18next.getRouteNamespaces(remixContext);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: { loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json') },
    });

  return new Promise((resolve, reject) => {
    let didError = false;

    let { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]: () => {
          let body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          didError = true;

          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
