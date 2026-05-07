<?php
require_once __DIR__ . '/_inc/bootstrap.php';
$page_title = 'Privacy policy — The STR Ledger';
$page_description = 'Privacy policy for thestrledger.com.';
include __DIR__ . '/_inc/head.php';
include __DIR__ . '/_inc/header.php';
?>
<article class="prose">
  <p class="eyebrow">Legal</p>
  <h1>Privacy policy<span class="period-gold">.</span></h1>
  <p style="color:var(--fg-3);font-family:var(--font-mono);font-size:12px;letter-spacing:0.18em;text-transform:uppercase">Last updated <?= date('F j, Y') ?></p>

  <h2>1. What we collect</h2>
  <p>We try to collect as little as possible. The only data we hold is what you give us:</p>
  <ul>
    <li><strong>Email address</strong>, when you opt in to a free guide or buy a workbook.</li>
    <li><strong>Order details</strong>, when you purchase &mdash; name, billing email, item bought, total. We do not store credit-card numbers; payment processors handle that.</li>
    <li><strong>Server logs</strong>: IP address, timestamp, and page requested. Standard web logs, retained 30 days, used for security and abuse prevention only.</li>
    <li><strong>Analytics</strong>: aggregated, anonymous page-view data via Google Analytics or Plausible. No personal identification.</li>
  </ul>

  <h2>2. Why we collect it</h2>
  <p>Email: to send the guide you asked for, deliver the workbook you bought, ship updates, and (if you opt in) the occasional newsletter. Order details: to fulfill orders, handle refunds, comply with tax law. Server logs: to keep the site secure. Analytics: to understand which pages help and which don&rsquo;t.</p>

  <h2>3. Who we share with</h2>
  <p>Only the third parties strictly required to run the business:</p>
  <ul>
    <li><strong>Stripe</strong> &mdash; payment processing.</li>
    <li><strong>Influencersoft</strong> &mdash; checkout pages, email delivery, sales-funnel tracking.</li>
    <li><strong>Etsy and Gumroad</strong> &mdash; if you buy on those marketplaces.</li>
    <li><strong>Hostinger</strong> &mdash; web hosting and email delivery.</li>
    <li><strong>Google Analytics</strong> or <strong>Plausible</strong> &mdash; site analytics.</li>
  </ul>
  <p>We never sell your data. Ever. We never share your email with affiliates, partners, or marketing lists.</p>

  <h2>4. Cookies</h2>
  <p>The site uses essential cookies for cart and login state, and (if enabled) Google Analytics or Plausible analytics cookies. Plausible is cookieless. You can disable cookies in your browser; the site will still work, but checkout may not.</p>

  <h2>5. Your rights</h2>
  <p>You can ask us to:</p>
  <ul>
    <li>Show you what we have on you</li>
    <li>Correct anything wrong</li>
    <li>Delete your record entirely (we&rsquo;ll keep order records as required by tax law, but the email and any list memberships go)</li>
    <li>Export your data in a portable format</li>
  </ul>
  <p>Email <a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a> with the subject &ldquo;Data request&rdquo; and we&rsquo;ll respond within 30 days. This applies to GDPR (EU/UK) and CCPA (California) residents and anyone else who wants the same.</p>

  <h2>6. Children</h2>
  <p>The site is not directed at anyone under 18. We don&rsquo;t knowingly collect data from minors.</p>

  <h2>7. Security</h2>
  <p>The site runs over HTTPS. Email lists are stored with reputable providers (Influencersoft, Hostinger). No system is perfectly secure; if a breach occurs that affects your data, we&rsquo;ll notify you within 72 hours of becoming aware.</p>

  <h2>8. Changes</h2>
  <p>If we materially change this policy, we&rsquo;ll update the &ldquo;Last updated&rdquo; date and notify list subscribers if the change reduces your rights.</p>

  <h2>9. Contact</h2>
  <p><a href="mailto:<?= e(cfg('support_email')) ?>"><?= e(cfg('support_email')) ?></a>.</p>
</article>
<?php include __DIR__ . '/_inc/footer.php'; ?>
