import kebabcase from "lodash.kebabcase";
import slugify from "slugify";

const hasNonLatin = (str: string): boolean => /[^\x00-\x7F]/.test(str);

/**
 * Slugify a string using a hybrid approach:
 * - Latin strings: slugify (e.g. "E2E Testing" → "e2e-testing")
 * - Strings with non-Latin chars: lodash.kebabcase (preserves non-Latin chars)
 * `strict` also drops punctuation from Latin strings (e.g. "C++ (tips)" → "c-tips").
 */
export const slugifyStr = (
  str: string,
  { strict = false }: { strict?: boolean } = {}
): string => {
  if (hasNonLatin(str)) {
    return kebabcase(str);
  }
  return slugify(str, { lower: true, strict });
};

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
