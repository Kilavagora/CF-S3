# Cloudflare S3 Worker Proxy

S3 paired with CDN allows to save bandwidth costs. But allowing public to
access cached content from private buckets is not desirable.

As a workaround, the worker forwards the requests to S3 origin with
[Range: bytes=0-0](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range)
header. If S3 signature verification passes, it will return
[status 206](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206), in which case
Cloudflare will serve the file from cache (Or it will retrieve from the origin and cache it).

This approach will not work if the Range header is part of the signature.

When HEAD request is issued, for certain extensions Cloudflare makes GET request to origin instead.
But this [breaks s3v4 signature](https://community.cloudflare.com/t/how-cloudflare-handle-head-request/238093),
since request method is part of the signature. This worker also tries to remedy this by
rewriting pathname for requests and replacing `.` with `%2e`. This bypasses Cloudflare
extension handling logic, path is threated as a dynamic page and request to origin goes through
properly.
