<?php
require_once __DIR__ . '/_inc/bootstrap.php';
$page_title = 'Refund policy — The STR Ledger';
$page_description = '14-day, no-questions refund on every workbook.';
include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>
<article class="prose">
  <p class="eyebrow">Legal</p>
  <h1>Refund policy<span class="period-gold">.</span></h1>
  <p style="color:var(--fg-3);font-family:var(--font-mono);font-size:12px;letter-spacing:0.18em;text-transform:uppercase">Last updated <?= date('F j, Y') ?></p>

  <h2>The short version</h2>
  <p><strong>14 days, no questions.</strong> If a workbook doesn&rsquo;t work on your setup, doesn&rsquo;t solve the problem you bought it for, or just isn&rsquo;t what you wanted, email <a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a> within 14 days of purchase and we&rsquo;ll refund you in full.</p>

  <h2>What you need to include</h2>
  <ul>
    <li>The email address you bought with</li>
    <li>The order or transaction ID (Stripe receipt, Etsy order #, or Gumroad order #)</li>
    <li>One sentence on why &mdash; this helps us improve the workbook, but we won&rsquo;t use it to decline you</li>
  </ul>

  <h2>Timing</h2>
  <p>We respond to refund emails within one business day. The refund itself processes in 5&ndash;10 business days depending on your bank.</p>

  <h2>Bundles</h2>
  <p>Refunds on bundles refund the full bundle price; we don&rsquo;t pro-rate by individual workbook. If you want to keep some workbooks and refund others, email us and we&rsquo;ll work it out.</p>

  <h2>Etsy purchases</h2>
  <p>For Etsy buyers, Etsy&rsquo;s built-in refund process applies. Open a case in your Etsy order, and we&rsquo;ll honor the same 14-day, no-questions policy through that channel.</p>

  <h2>Free guides</h2>
  <p>Free guides are free; nothing to refund.</p>

  <h2>What happens to the file</h2>
  <p>Once refunded, you&rsquo;re asked (on the honor system) to delete the workbook file from your devices. We don&rsquo;t track downloads or revoke access; refunds are extended in good faith.</p>

  <h2>Questions</h2>
  <p><a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a>.</p>
</article>
<?php include __DIR__ . '/_inc/footer.php'; ?>
