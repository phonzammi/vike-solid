export { usePageContext };
export { PageContextProvider };

import { createContext, useContext, type JSX } from "solid-js";
import { type Store } from "solid-js/store";
import type { PageContext } from "vike/types";
import { getGlobalObject } from "../utils/getGlobalObject.js";

const globalContext = getGlobalObject("PageContextProvider.ts", {
  solidContext: createContext<Store<PageContext>>(undefined as never),
});

function PageContextProvider(props: {
  pageContext: Store<PageContext>;
  children: JSX.Element;
}) {
  const { solidContext } = globalContext;
  return <solidContext.Provider value={props.pageContext}>{props.children}</solidContext.Provider>;
}

/**
 * Access `pageContext` from any Solid component.
 *
 * https://vike.dev/usePageContext
 */
function usePageContext(): PageContext {
  const { solidContext } = globalContext;
  const pageContext = useContext(solidContext);
  if (!pageContext) throw new Error("<PageContextProvider> is needed for being able to use usePageContext()");
  return pageContext;
}
