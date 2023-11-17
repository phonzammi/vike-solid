// https://vike.dev/onRenderHtml
export { onRenderHtml };

import {
  generateHydrationScript,
  renderToStream,
  renderToString,
} from "solid-js/web";
import { dangerouslySkipEscape, escapeInject, stampPipe, version } from "vike/server";
import { getTitle } from "./getTitle";
import { getPageElement } from "./getPageElement";
import type { OnRenderHtmlAsync } from "vike/types";
import { PageContextProvider } from "./PageContextProvider";

checkVikeVersion()

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  const title = getTitle(pageContext);
  const titleTag = !title ? "" : escapeInject`<title>${title}</title>`;

  const { description } = pageContext.config;
  const descriptionTag = !description
    ? ""
    : escapeInject`<meta name="description" content="${description}" />`;

  const Head = pageContext.config.Head || (() => <></>);
  const headHtml = renderToString(() => (
    <PageContextProvider pageContext={pageContext}>
      <Head />
    </PageContextProvider>
  ));

  const favicon = pageContext.config.favicon;
  const faviconTag = !favicon ? '' : escapeInject`<link rel="icon" href="${favicon}" />`;

  const { pipe } = renderToStream(() =>
    !pageContext.Page ? (
      <></> // the ssr config flag is false
    ) : (
      getPageElement(pageContext)
    )
  );
  // const asString = renderToString(() => page);
  stampPipe(pipe, "node-stream");

  const lang = pageContext.config.lang || "en";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='${lang}'>
      <head>
        <meta charset="UTF-8" />
        ${titleTag}
        ${faviconTag}
        ${descriptionTag}
        ${dangerouslySkipEscape(headHtml)}
        ${dangerouslySkipEscape(generateHydrationScript())}
      </head>
      <body>
        <div id="page-view">${pipe}</div>
      </body>
      <!-- built with https://github.com/vikejs/vike-solid -->
    </html>`;

  return documentHtml;
};

function checkVikeVersion() {
  if (version) {
    const versionParts = version.split('.').map((s) => parseInt(s, 10)) as [number, number, number]
    if (versionParts[0] > 0) return
    if (versionParts[1] > 4) return
    if (versionParts[2] >= 147) return
  }
  throw new Error('Update Vike to its latest version (or vike@0.4.147 and any version above)')
}
