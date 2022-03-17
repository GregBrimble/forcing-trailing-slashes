export default {
  async fetch(request, env) {
    let { pathname, origin, search } = new URL(request.url);

    if (pathname.endsWith("/")) {
      return env.ASSETS.fetch(request, { redirect: "follow" });
    } else {
      const assetUrlWithTrailingSlash = new URL(
        `${pathname}/${search}`,
        origin
      );

      let assetRequest = new Request(assetUrlWithTrailingSlash, request);
      assetRequest = new Request(assetRequest, {
        cf: {country: {"foobar"}
        },
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          "cf-worker": "pages-functions-stage", // Deactivates SPA mode
        },
      });

      const assetResponse = await env.ASSETS.fetch(assetRequest, {
        redirect: "follow",
      });

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
      } else {
        return assetResponse;
      }
    }
  },
};
