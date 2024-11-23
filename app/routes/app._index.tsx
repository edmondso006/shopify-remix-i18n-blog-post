import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  Button,
  ButtonGroup,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import i18next from "app/i18next.server";
import { useTranslation } from "react-i18next";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

// We are using the `common` namespace
export const handle = { i18n: "common " };

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const t = await i18next.getFixedT(request, "common");

  const value = t("global.greeting");
  console.log(value);
  return json({ value });
};

export default function Index() {
  const { t } = useTranslation();
  const saveButton = t("global.button.save");
  console.log({ saveButton });

  return (
    <Page>
      <TitleBar title="Remix app template"></TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    👋 {t("global.greeting")}, i18n Translation
                  </Text>

                  <ButtonGroup>
                    <Button variant="secondary" onClick={() => {}}>
                      {t("global.button.discard")}
                    </Button>
                    <Button variant="primary" onClick={() => {}}>
                      {t("global.button.save")}
                    </Button>
                  </ButtonGroup>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
