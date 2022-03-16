export default {
  async fetch(request, env) {
    // Fall back to asset server
    return env.ASSETS.fetch(request);
  },
};
