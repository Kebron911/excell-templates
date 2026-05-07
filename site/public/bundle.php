<?php
require_once __DIR__ . '/_inc/bootstrap.php';

// Resolve bundle by slug or sku
$req = $_GET['id'] ?? '';
$b = null;
if (preg_match('/^BUNDLE-\d{2}$/', $req)) {
    $b = bundle($req);
} else {
    foreach ($BUNDLES as $sku => $row) {
        if ($row['slug'] === $req) { $b = $row; break; }
    }
}
if (!$b) { http_response_code(404); include __DIR__ . '/404.php'; exit; }

$page_title = $b['name'] . ' — The STR Ledger';
$page_description = $b['sub'];
$active = 'bundles';

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<div class="wrap">
  <nav class="crumbs">
    <a href="/">Home</a> · <a href="/bundles">Bundles</a> · <span class="here"><?= e($b['name']) ?></span>
  </nav>
</div>

<section class="product-hero">
  <div class="wrap">
    <div class="product-hero-grid">
      <div class="product-mock">
        <div class="product-mock-inner">
          <p class="eyebrow">Bundle · <?= e($b['sku']) ?></p>
          <h2><em>The</em><br><?= e(preg_replace('/^The\s+/','',$b['name'])) ?><span class="period-gold">.</span></h2>
          <hr class="gold-rule">
          <p class="lead"><?= e($b['sub']) ?></p>
          <div class="product-mock-foot">
            <?php if (!empty($b['save_amt'])): ?><?= e($b['save_amt']) ?> off · <?= e($b['save_pct']) ?> vs <?= e($b['ala_carte']) ?> à la carte<?php else: ?><?= e($b['badge'] ?? '') ?><?php endif; ?>
          </div>
        </div>
      </div>
      <div class="product-info">
        <p class="eyebrow">Bundle · <?= e($b['sku']) ?></p>
        <h1><?= e($b['h1']) ?></h1>
        <p class="lead"><?= e($b['sub']) ?></p>
        <p class="price-line"><span class="num"><?= e($b['price']) ?></span> &nbsp;<em>one-time</em>. <em>Lifetime updates</em>.<?php if (!empty($b['save_amt'])): ?>
          &nbsp;<em>Save</em> <span style="color:var(--brand-gold)"><?= e($b['save_amt']) ?></span><?php endif; ?></p>
        <div class="product-cta">
          <a href="<?= e(is_bundle_url_for($b['sku'])) ?>" class="btn btn-gold btn-lg"><?= e($b['cta'] ?: 'Get the bundle — ' . $b['price']) ?></a>
          <a href="<?= e(cfg('etsy_shop_url')) ?>" class="btn btn-secondary btn-lg">Buy on Etsy</a>
        </div>
        <p class="product-meta"><strong>What you get:</strong> <?= count($b['inside']) ?> Excel workbooks + how-to PDFs + license PDF.<br>
        <strong>Format:</strong> .xlsx — Excel 2016+, Excel 365, Google Sheets.<br>
        <strong>Refund:</strong> 14 days, no questions. Email <a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a>.</p>
      </div>
    </div>
  </div>
</section>

<?php if (!empty($b['pitch'])): ?>
<section class="surface-parchment-alt">
  <div class="wrap" style="max-width:780px">
    <p class="eyebrow">The 30-second pitch</p>
    <h2 style="font-size:36px;margin-top:12px">Why <em>this</em> bundle<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <?php foreach ($b['pitch'] as $para): ?>
      <p class="lead" style="margin-bottom:20px"><?= e($para) ?></p>
    <?php endforeach; ?>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($b['inside'])): ?>
<section>
  <div class="wrap" style="max-width:980px">
    <p class="eyebrow">What's inside</p>
    <h2 style="font-size:36px;margin-top:12px"><?= count($b['inside']) ?> workbooks<span class="period-gold">.</span> One bundle<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <ul class="bullets">
      <?php foreach ($b['inside'] as $i): ?>
        <li>
          <div>
            <strong><?= e($i['sku']) ?> · <?= e($i['name']) ?></strong>
            <?php if (!empty($i['desc'])): ?>— <?= e($i['desc']) ?><?php endif; ?>
            <?php if (!empty($i['price'])): ?> <span style="color:var(--fg-3);font-family:var(--font-mono);font-size:12px;letter-spacing:0.18em"> · à la carte <?= e($i['price']) ?></span><?php endif; ?>
          </div>
        </li>
      <?php endforeach; ?>
    </ul>
    <?php if (!empty($b['save_amt'])): ?>
      <p class="lead" style="margin-top:24px;text-align:right;font-family:var(--font-display);font-style:italic">À la carte total <?= e($b['ala_carte']) ?> · bundle <?= e($b['price']) ?> · <em>save <?= e($b['save_amt']) ?></em><span class="period-gold">.</span></p>
    <?php endif; ?>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($b['why'])): ?>
<section class="surface-parchment-alt">
  <div class="wrap" style="max-width:880px">
    <p class="eyebrow">Why this bundle</p>
    <h2 style="font-size:36px;margin-top:12px">The decisions <em>this</em> bundle owns<span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <ul class="bullets">
      <?php foreach ($b['why'] as $w): ?>
        <li><div><?= e($w) ?></div></li>
      <?php endforeach; ?>
    </ul>
  </div>
</section>
<?php endif; ?>

<?php if (!empty($b['for']) || !empty($b['not'])): ?>
<section>
  <div class="wrap" style="max-width:980px">
    <p class="eyebrow">Who this is for · who it's not for</p>
    <h2 style="font-size:36px;margin-top:12px"><em>For</em> the operator who's at <?= e($b['short']) ?><span class="period-gold">.</span></h2>
    <hr class="gold-rule">
    <div class="split">
      <div class="split-col">
        <h4>For</h4>
        <ul><?php foreach ($b['for'] as $x): ?><li><?= e($x) ?></li><?php endforeach; ?></ul>
      </div>
      <div class="split-col not">
        <h4>Not for</h4>
        <ul><?php foreach ($b['not'] as $x): ?><li><?= e($x) ?></li><?php endforeach; ?></ul>
      </div>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="capture">
  <div class="wrap">
    <p class="eyebrow">Ready</p>
    <h2><?= e($b['name']) ?><span class="period-gold">.</span></h2>
    <p class="lead"><?= e($b['sub']) ?></p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:32px">
      <a href="<?= e(is_bundle_url_for($b['sku'])) ?>" class="btn btn-gold btn-lg"><?= e($b['cta'] ?: 'Get the bundle — ' . $b['price']) ?></a>
      <a href="<?= e(cfg('etsy_shop_url')) ?>" class="btn btn-secondary btn-lg" style="color:var(--brand-parchment);border-color:var(--brand-parchment)">Buy on Etsy</a>
    </div>
    <p class="form-note">14-day refund, no questions. Digital product. Not tax advice.</p>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
