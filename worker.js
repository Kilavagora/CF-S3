async function handleRequest(request) {
  const url = new URL(request.url);

  let cf = {
    cacheTtl: -1,
    cacheEverything: false,
  };

  if (request.method === "GET") {
    const incomingHeaders = new Headers(request.headers);
    incomingHeaders.set("Range", "bytes=0-0");
    incomingHeaders.set("Cache-Control", "no-cache");

    const checkRequest = new Request(request.url, {
      method: request.method,
      headers: incomingHeaders,
    });

    const checkResponse = await fetch(checkRequest, {
      cf: cf,
    });

    if (checkResponse.status !== 206) {
      return checkResponse;
    }

    cf = {
      cacheTtl: 2419200,
      cacheEverything: true,
      cacheKey: `${url.protocol}//${url.hostname}${url.pathname}`,
    };
  }

  const href = request.method === "HEAD" ? `${url.protocol}//${url.hostname}${url.pathname.replace(/\./g, "%2e")}${url.search}` : request.url;

  const passThroughRequest = new Request(href, request);

  const response = await fetch(passThroughRequest, {
    method: request.method,
    cf: cf,
  });

  return response;
}

addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});
