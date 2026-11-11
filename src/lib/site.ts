/**
 * Set to true when the docs launch. Until then every page asks search engines
 * not to index it (a robots meta tag) and robots.txt disallows crawling, so
 * unreviewed pages never show up in search results.
 */
export const LAUNCHED = false;

/**
 * Where vibeLABS accounts live. The header asks it who is signed in (`/api/session`) and links
 * there to sign in and out. The develop preview until the main site launches; then
 * https://vibelabsmc.org.
 */
export const ACCOUNT_ORIGIN = "https://develop.vibelabsmc.org";
