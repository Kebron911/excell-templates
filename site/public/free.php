<?php
require_once __DIR__ . '/_inc/bootstrap.php';

$id = $_GET['id'] ?? '';
$m = magnet($id);
if (!$m) { http_response_code(404); include __DIR__ . '/404.php'; exit; }

$page_title = $m['h1'] . ' — The STR Ledger';
$page_description = $m['sub'];

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<section class="hero" style="border-bottom:0">
  <div class="wrap" style="max-width:760px;text-align:center">
    <p class="eyebrow"><?= e($m['eyebrow']) ?></p>
    <h1 style="margin-top:16px"><?= e($m['h1']) ?></h1>
    <hr class="gold-rule" style="margin:24px auto">
    <p class="lead" style="font-family:var(--font-display);font-style:italic;font-size:22px;max-width:620px;margin:0 auto"><?= e($m['sub']) ?></p>
  </div>
</section>

<section class="surface-parchment-alt tight">
  <div class="wrap" style="max-width:760px">
    <p class="eyebrow">What's in it</p>
    <h2 style="font-size:36px;margin-top:12px;text-align:center"><em>Inside</em> this guide<span class="period-gold">.</span></h2>
    <hr class="gold-rule" style="margin:16px auto">
    <ul class="bullets" style="max-width:580px;margin:24px auto">
      <?php foreach ($m['bullets'] as $b): ?>
        <li><div><?= e($b) ?></div></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>

<section class="capture">
  <div class="wrap">
    <p class="eyebrow">Send it to me</p>
    <h2 style="font-size:38px"><?= e($m['cta']) ?><span class="period-gold">.</span></h2>
    <p class="lead">One email. Unsubscribe anytime. We never share your address.</p>
    <?php $magnet_id = $id; include __DIR__ . '/_inc/lead-form.php'; ?>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
