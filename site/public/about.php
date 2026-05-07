<?php
require_once __DIR__ . '/_inc/bootstrap.php';
$page_title = 'About — The STR Ledger';
$page_description = 'Editorial finance for short-term rentals — built by hosts, for hosts.';
$active = 'about';
include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>
<article class="prose">
  <p class="eyebrow">About</p>
  <h1>Editorial finance for hosts who run a real business<span class="period-gold">.</span></h1>
  <hr class="gold-rule">

  <p class="lead">The STR Ledger sells the workbooks Daniel built for himself running short-term rentals &mdash; cleaned up, formula-checked, and brand-stamped so a host with three properties or thirty can drop them in and have a real business stack overnight.</p>

  <h2>The promise</h2>
  <p>Every workbook does one thing well, ships as a single Excel or Google Sheets file, and pays for itself the first time you use it. No subscriptions. No login portals. No SaaS. One file. One link. One price.</p>

  <h2>Who we&rsquo;re for</h2>
  <p>Semi-Pro Sarah &mdash; the host running 3&ndash;10 properties who treats the portfolio like a real business. Her CPA respects her files. Her cleaners actually fill in the checklist. Her Schedule E reconciles to the dollar.</p>

  <h2>The standard</h2>
  <p>Every workbook gets the Sarah test: <em>would she forward this to her CPA without embarrassment?</em> If the answer is no, we don&rsquo;t ship it.</p>

  <h2>Get in touch</h2>
  <p><a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a></p>
</article>
<?php include __DIR__ . '/_inc/footer.php'; ?>
