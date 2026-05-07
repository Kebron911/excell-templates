<?php
require_once __DIR__ . '/_inc/bootstrap.php';
$page_title = 'Terms of service — The STR Ledger';
$page_description = 'Terms of service for thestrledger.com.';
include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>
<article class="prose">
  <p class="eyebrow">Legal</p>
  <h1>Terms of service<span class="period-gold">.</span></h1>
  <p style="color:var(--fg-3);font-family:var(--font-mono);font-size:12px;letter-spacing:0.18em;text-transform:uppercase">Last updated <?= date('F j, Y') ?></p>

  <h2>1. Who we are</h2>
  <p>thestrledger.com (&ldquo;The STR Ledger,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is operated by Daniel Harrison. By using the site or buying a digital product, you agree to these terms. If you don&rsquo;t agree, don&rsquo;t use the site.</p>

  <h2>2. What we sell</h2>
  <p>We sell digital products: Microsoft Excel and Google Sheets workbooks, PDF guides, and accompanying documents. All products are delivered as files. Once delivered, the files are yours to use under the license below.</p>

  <h2>3. License</h2>
  <p>You receive a non-exclusive, non-transferable, perpetual license to use each purchased workbook for your own short-term-rental business and personal use. Specifically:</p>
  <ul>
    <li>You may use a workbook across all properties you own or operate.</li>
    <li>You may share the file privately with your CPA, bookkeeper, or property manager working on your behalf.</li>
    <li>You may not resell, redistribute, sublicense, or publicly post the workbook or its contents.</li>
    <li>You may not use the workbook to train machine-learning models or scrape its formulas for commercial reuse.</li>
  </ul>
  <p>Each workbook ships with a separate license PDF that controls if it conflicts with this section.</p>

  <h2>4. Lifetime updates</h2>
  <p>&ldquo;Lifetime updates&rdquo; means we ship updates to a workbook (e.g., new IRS rate, fixed formula, new tab) free for as long as we keep that workbook in our active catalog. If we retire a workbook, prior buyers keep their copy and the last update we shipped.</p>

  <h2>5. Refunds</h2>
  <p>14-day, no-questions refund. See our <a href="/refunds">refund policy</a>.</p>

  <h2>6. Not professional advice</h2>
  <p>Workbooks include calculations, formulas, and guidance based on publicly available information (IRS Publications, AirCover documentation, etc.). They are <strong>not</strong> tax, legal, accounting, or investment advice. Always consult your CPA or attorney for your specific situation. We are not liable for tax positions you take, audits you face, or business decisions you make using our workbooks.</p>

  <h2>7. Disclaimers and liability cap</h2>
  <p>The workbooks are provided &ldquo;as is&rdquo; without warranty of any kind, express or implied. Our total liability for any claim related to the site or a workbook is capped at the amount you paid for the workbook in question, or $100, whichever is greater.</p>

  <h2>8. Acceptable use</h2>
  <p>Don&rsquo;t use the site to do anything illegal, abuse our servers, scrape at scale, or impersonate us. We may suspend or refuse service to anyone violating these terms.</p>

  <h2>9. Changes</h2>
  <p>We may update these terms occasionally. Material changes will be announced at the top of this page with a new &ldquo;Last updated&rdquo; date.</p>

  <h2>10. Governing law</h2>
  <p>These terms are governed by the laws of the United States and the state where the operator is domiciled. Disputes will be resolved in those courts.</p>

  <h2>11. Contact</h2>
  <p>Questions about these terms? Email <a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a>.</p>
</article>
<?php include __DIR__ . '/_inc/footer.php'; ?>
