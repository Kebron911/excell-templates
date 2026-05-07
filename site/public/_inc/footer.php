<footer class="site-footer">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="wordmark" href="/" style="color:var(--brand-parchment)">
          <span class="the" style="color:var(--brand-parchment)">The</span>
          <span class="name" style="color:var(--brand-parchment)">STR Ledger<span class="dot">.</span></span>
        </a>
        <p>Run your rentals before they run you.</p>
        <p class="fine">Business-grade Excel systems for Airbnb &amp; VRBO hosts who treat their portfolio like a real business.</p>
      </div>
      <div class="foot-col">
        <h5>Templates</h5>
        <ul>
          <li><a href="/products/TAX-001">Mileage Log</a></li>
          <li><a href="/products/TAX-002">P&amp;L Tracker</a></li>
          <li><a href="/products/GST-001">Welcome Book</a></li>
          <li><a href="/products/OPS-001">Turnover Checklist</a></li>
          <li><a href="/#templates">All templates</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h5>Free</h5>
        <ul>
          <li><a href="/free/47-deductions">47 Deductions</a></li>
          <li><a href="/free/welcome-book">Welcome Book starter</a></li>
          <li><a href="/free/etsy-buyer">Etsy buyer upgrade</a></li>
          <li><a href="/free/entity-flowchart">Entity flowchart</a></li>
        </ul>
      </div>
      <div class="foot-col">
        <h5>Company</h5>
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="mailto:<?= e(cfg('support_email')) ?>">Contact</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/refunds">Refunds</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-rule"></div>
    <div class="foot-fine">
      <span>© <?= date('Y') ?> The STR Ledger · <?= e(cfg('support_email')) ?></span>
      <span>Not tax advice · consult your CPA</span>
    </div>
  </div>
</footer>
</body></html>
