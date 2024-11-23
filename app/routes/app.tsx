import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

import i18next from "./../i18next.server";
import { useTranslation } from "react-i18next";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// We are using the `common` namespace
export const handle = { i18n: "common " };

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const t = await i18next.getFixedT(request, "common");

  const value = t("global.greeting");
  console.log(value);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  const { t } = useTranslation();
  const { apiKey } = useLoaderData<typeof loader>();

  const saveButton = t("global.button.save");
  console.log(saveButton);

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
