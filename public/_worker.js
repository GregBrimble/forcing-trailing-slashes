export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    const indexResponse = await env.ASSETS.fetch(new URL("/", origin), request);

    if (pathname !== "/") {
      // Serve requests with trailing slashes

      if (pathname.endsWith("/")) {
        const assetUrlWithoutTrailingSlash = new URL(
          pathname.slice(0, -1),
          origin
        );

        const assetEntry = await env.ASSETS.fetch(
          assetUrlWithoutTrailingSlash.toString(),
          request
        );

        if (
          assetEntry.status === 200 &&
          assetEntry.headers.get("content-type").includes("text/html") &&
          indexResponse.headers.get("etag") !== assetEntry.headers.get("etag")
        ) {
          return assetEntry;
        }
      }
      // Redirect requests without trailing slashes
      else {
        const assetUrlWithTrailingSlash = new URL(
          `${pathname}/${search}`,
          origin
        );

        const assetEntry = await env.ASSETS.fetch(
          assetUrlWithTrailingSlash.toString(),
          request
        );

        if (
          assetEntry.status === 200 &&
          assetEntry.headers.get("content-type").includes("text/html") &&
          indexResponse.headers.get("etag") !== assetEntry.headers.get("etag")
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
