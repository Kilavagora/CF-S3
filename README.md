# Cloudflare S3 Worker Proxy

S3 paired with CDN allows to save bandwidth costs. But allowing public to
access cached content from private buckets is not desirable.

As a workaround, the worker forwards the requests to S3 origin with
[Range: bytes=0-0](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range)
header. If S3 signature verification passes, it will return
[status 206](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206), in which case
Cloudflare will serve the file from cache (Or it will retrieve from the origin and cache it).

This approach will not work if the Range header is part of the signature.
