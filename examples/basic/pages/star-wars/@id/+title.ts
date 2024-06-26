export { title };

import type { Data } from "./+data.js";
import type { PageContext } from "vike/types";

function title(pageContext: PageContext<Data>) {
  const movie = pageContext.data;
  return movie.title;
}
