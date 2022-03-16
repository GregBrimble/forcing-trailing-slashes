export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    if (pathname !== "/") {
      if (!pathname.endsWith("/")) {
        const assetUrlWithTrailingSlash = new URL(
          `${pathname}/${search}`,
          origin
        );

        let assetRequest = new Request(assetUrlWithTrailingSlash, request);
        assetRequest = new Request(assetRequest, {
          headers: {
            ...Object.fromEntries(request.headers.entries()),
            "cf-worker": "user-worker", // Deactivates SPA mode
          },
        });

        const assetResponse = await env.ASSETS.fetch(assetRequest);

        if (
          assetResponse.status === 200 &&
          assetResponse.headers.get("content-type").includes("text/html")
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
