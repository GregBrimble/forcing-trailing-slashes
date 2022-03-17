export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    if (pathname.endsWith("/")) {
      // Serve /foo.html at /foo/
      // Serve /bar/index.html at /bar/
      return env.ASSETS.fetch(request, { redirect: "follow" });
    } else {
      const assetPathname = pathname.replace(/index(.html)?$/, "");
      const assetURL = new URL(`${assetPathname}${search}`, origin);
      const assetRequest = new Request(assetURL, {
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          "cf-worker": "deprecated-pages=disable-spa-mode",
        },
      });

      const assetResponse = await env.ASSETS.fetch(assetRequest, {
        redirect: "follow",
      });

      if (
        assetResponse.status === 200 &&
        assetResponse.headers.get("content-type").includes("text/html")
      ) {
        // If an HTML asset can eventually be served at the URL with a trailing slash, redirect to the URL with a trailing slash.
        return new Response(null, {
          status: 302,
          headers: {
            Location: `${assetPathname}/${search}`,
          },
        });
      } else {
        // Serve /bin at /bin as normal
        // Serve /non-existent with normal 404 behavior (404 /404.html if available or 200 /index.html if not)
        return env.ASSETS.fetch(request);
      }
    }
  },
};
