# Forcing Trailing Slashes

This example show how to force trailing slashes using a custom `_worker.js` file in your Cloudflare Pages project.

## Behaviour

For requests to URLS without a trailing slash that would ordinarily serve HTML, we redirect the request to the URL with a trailing slash.

For requests to URLs with a trailing slash, we flatten the default redirect (which would ordinarily strip the trailing slash) and serve the page as-is.

## Usage

Copy the `_worker.js` file into your project's build output directory.
