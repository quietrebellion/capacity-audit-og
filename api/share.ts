export const config = { runtime: 'edge' };

export default function handler(req: Request) {
  const url = new URL(req.url);
  const r = url.searchParams.get('r') || '';
  const auditURL = `https://capacityaudit.rebellioncollective.com/?r=${encodeURIComponent(r)}`;
  const ogImageURL = `${url.origin}/api/og?r=${encodeURIComponent(r)}`;

  // Serve a minimal HTML page with the correct OG meta tags.
  // Crawlers (LinkedIn, X, iMessage) read these tags for the preview card.
  // Real users get redirected instantly via meta refresh + JS fallback.
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>My Capacity Audit — Rebellion Collective</title>
<meta property="og:title" content="My Capacity Audit Pattern">
<meta property="og:description" content="I just ran my Capacity Audit. This is the shape mine is in right now — curious what yours looks like.">
<meta property="og:image" content="${ogImageURL}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${auditURL}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="My Capacity Audit Pattern">
<meta name="twitter:description" content="I just ran my Capacity Audit. This is the shape mine is in right now.">
<meta name="twitter:image" content="${ogImageURL}">
<meta http-equiv="refresh" content="0;url=${auditURL}">
</head>
<body>
<script>window.location.replace("${auditURL}")</script>
<p>Redirecting to <a href="${auditURL}">your Capacity Audit results</a>...</p>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
