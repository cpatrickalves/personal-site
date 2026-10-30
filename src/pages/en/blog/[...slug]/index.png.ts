import type { GetStaticPaths } from "astro";
import { postOgImagePaths } from "@/views/staticPaths";

export { GET } from "@/views/postOgImage";

export const getStaticPaths = (() =>
  postOgImagePaths("en")) satisfies GetStaticPaths;
