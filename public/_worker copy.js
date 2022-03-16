export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    if (pathname !== "/") {
      if (!pathname.endsWith("/")) {
        const assetUrlWithTrailingSlash = new URL(
          `${pathname}/${search}`,
          origin
        );

        return env.ASSETS.fetch(assetUrlWithTrailingSlash.toString(), request);

        if (
          assetEntry.status === 200 &&
          assetEntry.headers.get("content-type").includes("text/html")
        ) {
          return new Response(null, {
            // Temporary
            status: 302,
            headers: {
              Location: `${pathname}/${search}`,
            },
          });
        }
      }
    }

    // Fall back to asset server
    return env.ASSETS.fetch(request);
  },
};
