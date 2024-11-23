import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18next from "./i18next.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  // grab the locale and return it to the client
  const locale = await i18next.getLocale(request);
  return json({ locale });
}

export const handle = {
  // the namespace that this page will need
  i18n: "common",
};

export default function App() {
  console.log("loaded");
  // Get the locale from the loader
  const { locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
