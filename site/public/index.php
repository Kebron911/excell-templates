<?php
require_once __DIR__ . '/_inc/bootstrap.php';

$page_title = 'The STR Ledger — Run your rentals before they run you';
$page_description = 'Business-grade Excel financial and operating systems for Airbnb and VRBO hosts. Tax workbooks, P&L trackers, welcome books, turnover checklists. One-time price. Lifetime updates.';
$active = 'home';

include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>

<section class="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <p class="eyebrow">Editorial finance for short-term rentals</p>
        <h1>Run your rentals<br>before they run<span class="period-gold">.</span> <em>you</em><span class="period-gold">.</span></h1>
        <p class="lead">Business-grade Excel workbooks and operating systems for Airbnb and VRBO hosts who treat their portfolio like a real business. One-time price. Lifetime updates. No subscription.</p>
        <div class="hero-cta">
          <a href="/free/47-deductions" class="btn btn-gold btn-lg">Get the 47 deductions guide — free</a>
          <a href="#templates" class="btn btn-secondary btn-lg">See the catalog</a>
        </div>
      </div>
      <div class="hero-art">
        <div class="hero-art-inner">
          <div class="eyebrow">2026 ed. · Tax season</div>
          <div class="hero-art-title"><em>The</em> 2026 Schedule E<span class="period-gold">.</span></div>
          <hr class="gold-rule">
          <p class="lead" style="margin:0">Every line your CPA will ask for, in the order they ask for it. Pre-wired to 47 deductions and Form 4562.</p>
          <div style="margin-top:auto;font-family:var(--font-mono);font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--fg-3)">TAX-004 · v2.6</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="templates">
  <div class="wrap">
    <div class="section-head">
      <div>
        <p class="eyebrow">The Catalog</p>
        <h2><?= count($PRODUCTS) ?> workbooks<span class="period-gold">.</span> <em>Zero</em> subscriptions<span class="period-gold">.</span></h2>
      </div>
      <a href="mailto:<?= e(cfg('support_email')) ?>" class="btn btn-ghost">Question about a workbook? Ask us →</a>
    </div>
    <div class="cards">
<?php foreach ($PRODUCTS as $sku => $p): ?>
      <article class="card">
        <div class="sku-row">
          <span class="sku"><?= e($sku) ?></span>
          <span class="price"><span class="currency">$</span><?= e(ltrim($p['price'],'$')) ?></span>
        </div>
        <h3><?= e($p['name']) ?><span class="period-gold">.</span></h3>
        <p><?= e($p['card_blurb']) ?></p>
        <?php if (!empty($p['badge'])): ?><span class="badge"><?= e($p['badge']) ?></span><?php endif; ?>
        <div class="card-cta">
          <a href="/products/<?= e($sku) ?>">See inside →</a>
          <a href="<?= e(is_url_for($sku)) ?>" class="btn btn-primary">Buy now</a>
        </div>
      </article>
<?php endforeach; ?>
    </div>
  </div>
</section>

<section class="capture">
  <div class="wrap">
    <p class="eyebrow">Free guide</p>
    <h2>The 47 Airbnb deductions your CPA forgets to ask about<span class="period-gold">.</span></h2>
    <p class="lead">12 pages. Every line item, with IRS citations, in the order your Schedule E asks for them. Worth ~$4,200 to a 24%-bracket host.</p>
    <?php $magnet_id = '47-deductions'; include __DIR__ . '/_inc/lead-form.php'; ?>
  </div>
</section>

<?php include __DIR__ . '/_inc/footer.php'; ?>
