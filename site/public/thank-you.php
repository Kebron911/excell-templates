<?php
require_once __DIR__ . '/_inc/bootstrap.php';

$mid = $_GET['m'] ?? '';
$m = magnet($mid);

$page_title = 'Thank you — The STR Ledger';
$page_description = 'Check your inbox.';

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<section class="hero" style="border-bottom:0">
  <div class="wrap" style="max-width:680px;text-align:center">
    <p class="eyebrow">Sent</p>
    <h1 style="margin-top:16px">Check your inbox<span class="period-gold">.</span></h1>
    <hr class="gold-rule" style="margin:24px auto">
    <p class="lead" style="font-family:var(--font-display);font-style:italic;font-size:22px">
      <?php if ($m): ?>
        Your copy of <em><?= e($m['h1']) ?></em> is on its way to you. If it doesn't arrive in 5 minutes, check spam — and add <strong><?= e(cfg('support_email')) ?></strong> to your contacts so the next one lands in your inbox.
      <?php else: ?>
        Your guide is on its way. If it doesn't arrive in 5 minutes, check spam.
      <?php endif; ?>
    </p>
    <div style="margin-top:32px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a href="/" class="btn btn-secondary">Back to the catalog</a>
      <a href="/#templates" class="btn btn-primary">See the workbooks</a>
    </div>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
