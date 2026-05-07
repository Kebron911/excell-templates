<?php
require_once __DIR__ . '/_inc/bootstrap.php';

$sku = $_GET['sku'] ?? '';
$p = product($sku);
if (!$p) { http_response_code(404); include __DIR__ . '/404.php'; exit; }

$page_title = $p['name'] . ' — The STR Ledger';
$page_description = $p['sub'];
$active = 'templates';

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<div class="wrap">
  <nav class="crumbs">
    <a href="/">Home</a> · <a href="/#templates">Templates</a> · <a href="/#templates"><?= e($p['category']) ?></a> · <span class="here"><?= e($p['name']) ?></span>
  </nav>
</div>

<section class="product-hero">
  <div class="wrap">
    <div class="product-hero-grid">
      <div class="product-mock">
        <div class="product-mock-inner">
          <p class="eyebrow"><?= e($p['category']) ?> · <?= e($sku) ?></p>
          <h2><em>The</em><br><?= e(preg_replace('/^The\s+/','',$p['name'])) ?><span class="period-gold">.</span></h2>
          <hr class="gold-rule">
          <p class="lead"><?= e($p['mock_sub']) ?></p>
          <div class="product-mock-foot">2026 ed. · Excel · Google Sheets compatible</div>
        </div>
      </div>
      <div class="product-info">
        <p class="eyebrow"><?= e($p['category']) ?> · <?= e($sku) ?></p>
        <h1><?= e($p['h1']) ?></h1>
        <p class="lead"><?= e($p['sub']) ?></p>
        <p class="price-line"><span class="num"><?= e($p['price']) ?></span> &nbsp;<em>one-time</em>. <em>Lifetime updates</em>.</p>
        <div class="product-cta">
          <a href="<?= e(is_url_for($sku)) ?>" class="btn btn-gold btn-lg">Buy on thestrledger.com — <?= e($p['price']) ?></a>
          <a href="<?= e(cfg('etsy_shop_url')) ?>" class="btn btn-secondary btn-lg">Buy on Etsy</a>
        </div>
        <p class="product-meta"><strong>What you get:</strong> Excel workbook + how-to PDF + license PDF.<br>
        <strong>Format:</strong> .xlsx — Excel 2016+, Excel 365, Google Sheets.<br>
        <strong>Refund:</strong> 14 days, no questions. Email <a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a>.</p>
      </div>
    </div>
  </div>
</section>

<?php if (!empty($p['pitch'])): ?>
<section class="surface-parchment-alt">
  <div class="wrap" style="max-width:780px">
    <p class="eyebrow">The 30-second pitch</p>
    <h2 style="font-size:36px;margin-top:12px">Why <em>this</em> workbook<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <?php foreach ($p['pitch'] as $para): ?>
      <p class="lead" style="margin-bottom:20px"><?= e($para) ?></p>
    <?php endforeach; ?>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($p['inside'])): ?>
<section>
  <div class="wrap" style="max-width:880px">
    <p class="eyebrow">What's inside the workbook</p>
    <h2 style="font-size:36px;margin-top:12px">Tabs that earn the price<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <ul class="bullets">
      <?php foreach ($p['inside'] as $i): ?>
        <li><div><strong><?= e($i['name']) ?></strong> — <?= e($i['desc']) ?></div></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($p['for']) || !empty($p['not'])): ?>
<section class="surface-parchment-alt">
  <div class="wrap" style="max-width:980px">
    <p class="eyebrow">Who this is for · who it's not for</p>
    <h2 style="font-size:36px;margin-top:12px"><em>For</em> hosts who run a real business<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <div class="split">
      <div class="split-col">
        <h4>For</h4>
        <ul><?php foreach ($p['for'] as $x): ?><li><?= e($x) ?></li><?php endforeach; ?></ul>
      </div>
      <div class="split-col not">
        <h4>Not for</h4>
        <ul><?php foreach ($p['not'] as $x): ?><li><?= e($x) ?></li><?php endforeach; ?></ul>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($p['faq'])): ?>
<section>
  <div class="wrap" style="max-width:780px">
    <p class="eyebrow">Frequently asked</p>
    <h2 style="font-size:36px;margin-top:12px"><em>Before</em> you buy<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <div class="faq">
      <?php foreach ($p['faq'] as $q): ?>
        <div class="faq-item">
          <p class="faq-q"><?= e($q['q']) ?></p>
          <p class="faq-a"><?= e($q['a']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="capture">
  <div class="wrap">
    <p class="eyebrow">Ready when you are</p>
    <h2><?= e($p['h1']) ?></h2>
    <p class="lead"><?= e($p['sub']) ?></p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:32px">
      <a href="<?= e(is_url_for($sku)) ?>" class="btn btn-gold btn-lg">Buy on thestrledger.com — <?= e($p['price']) ?></a>
      <a href="<?= e(cfg('etsy_shop_url')) ?>" class="btn btn-secondary btn-lg" style="color:var(--brand-parchment);border-color:var(--brand-parchment)">Buy on Etsy</a>
    </div>
    <p class="form-note">14-day refund, no questions. Digital product. Not tax advice.</p>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
