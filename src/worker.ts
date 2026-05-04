export default {
  async fetch() {
    return new Response('This UI is served from the Vite app during development.', {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  },
}
