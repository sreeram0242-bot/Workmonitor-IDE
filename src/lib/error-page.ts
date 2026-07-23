export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Something went wrong</title>
<style>
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family: -apple-system, system-ui, sans-serif; background:#0F1B3D; color:#fff; }
  .card { text-align:center; padding:2rem; max-width:420px; }
  h1 { font-size:1.5rem; margin:0 0 .5rem; }
  p { opacity:.75; margin:0 0 1.5rem; font-size:.95rem; }
  a { display:inline-block; padding:.6rem 1.2rem; background:#fff; color:#0F1B3D; border-radius:.5rem; text-decoration:none; font-weight:600; }
</style>
</head>
<body>
  <div class="card">
    <h1>Something went wrong</h1>
    <p>An unexpected error occurred. Please refresh or try again in a moment.</p>
    <a href="/">Reload</a>
  </div>
</body>
</html>`;
}
