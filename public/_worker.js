export default {
  async fetch(request, env) {
    // Fall back to asset server
    return env.ASSETS.fetch(
      new Request(request, {
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          "cf-worker": "absolutely-not-set-from-the-internet",
        },
      })
    );
  },
};
