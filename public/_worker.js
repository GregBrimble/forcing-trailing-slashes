export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.searchParams.has("ct")) {
      const response = await env.ASSETS.fetch(request);
      return new Response(response.headers.get("content-type"));
    }

    return env.ASSETS.fetch(request);
  },
};
