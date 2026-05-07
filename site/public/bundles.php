<?php
require_once __DIR__ . '/_inc/bootstrap.php';

$page_title = 'Bundles — The STR Ledger';
$page_description = 'Bundled workbook stacks for first-year hosts, aspiring investors, year-2 operators, multi-property portfolios, and pro managers. Stack-based discounts up to 42% vs à la carte.';
$active = 'bundles';

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<section class="hero" style="border-bottom:0;padding-bottom:48px">
  <div class="wrap" style="max-width:880px;text-align:center">
    <p class="eyebrow">The Bundles</p>
    <h1 style="margin-top:16px">Stack the workbooks<span class="period-gold">.</span> <em>Save</em> the math<span class="period-gold">.</span></h1>
    <hr class="gold-rule" style="margin:24px auto">
    <p class="lead" style="font-family:var(--font-display);font-style:italic;font-size:22px;max-width:680px;margin:0 auto">
      Each bundle is a stack of workbooks built for one operator profile —
      first-year host, aspiring buyer, year-2 operator, multi-property portfolio,
      pro manager. Pick the bundle that matches where you are.
    </p>
  </div>
</section>

<section class="surface-parchment-alt" style="padding:48px 0 96px">
  <div class="wrap">
    <div class="cards" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr))">
<?php foreach ($BUNDLES as $sku => $b):
  $href = '/bundles/' . $b['slug'];
?>
      <article class="card">
        <div class="sku-row">
          <span class="sku"><?= e($sku) ?></span>
          <span class="price"><span class="currency">$</span><?= e(ltrim($b['price'],'$')) ?></span>
        </div>
        <h3><?= e($b['name']) ?><span class="period-gold">.</span></h3>
        <p><?= e($b['card_blurb']) ?></p>
        <?php if (!empty($b['save_amt']) && !empty($b['save_pct'])): ?>
          <span class="badge"><?= e($b['save_amt']) ?> off · <?= e($b['save_pct']) ?> vs <?= e($b['ala_carte']) ?> à la carte</span>
        <?php elseif (!empty($b['badge'])): ?>
          <span class="badge"><?= e($b['badge']) ?></span>
        <?php endif; ?>
        <div class="card-cta">
          <a href="<?= e($href) ?>">See what's inside →</a>
          <a href="<?= e(is_bundle_url_for($sku)) ?>" class="btn btn-primary">Buy now</a>
        </div>
      </article>
<?php endforeach; ?>
    </div>
  </div>
</section>

<section class="capture">
  <div class="wrap">
    <p class="eyebrow">Not sure which one</p>
    <h2 style="font-size:38px"><em>Tell me</em> where you are<span class="period-gold">.</span></h2>
    <p class="lead">Get the 47 deductions guide free — at the end we suggest the bundle that fits your stage.</p>
    <?php $magnet_id = '47-deductions'; include __DIR__ . '/_inc/lead-form.php'; ?>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
