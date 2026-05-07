<?php
require_once __DIR__ . '/_inc/bootstrap.php';
http_response_code(404);
$page_title = 'Page not found — The STR Ledger';
$page_description = 'That page does not exist.';

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<section class="hero" style="border-bottom:0">
  <div class="wrap" style="max-width:680px;text-align:center">
    <p class="eyebrow">404</p>
    <h1 style="margin-top:16px">That ledger entry doesn't exist<span class="period-gold">.</span></h1>
    <hr class="gold-rule" style="margin:24px auto">
    <p class="lead" style="font-family:var(--font-display);font-style:italic;font-size:22px">
      The page you're looking for was moved, renamed, or never existed. Try the catalog or the free guide.
    </p>
    <div style="margin-top:32px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="/" class="btn btn-primary">Back home</a>
      <a href="/#templates" class="btn btn-secondary">See the catalog</a>
      <a href="/free/47-deductions" class="btn btn-gold">Free 47-deductions guide</a>
    </div>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
