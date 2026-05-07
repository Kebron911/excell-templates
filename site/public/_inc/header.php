<?php $active = $active ?? ''; ?>
<header class="site-header">
  <div class="wrap">
    <a href="/" class="wordmark" aria-label="The STR Ledger home">
      <span class="the">The</span>
      <span class="name">STR Ledger<span class="dot">.</span></span>
    </a>
    <nav class="site-nav">
      <a href="/#templates" class="<?= $active==='templates'?'active':'' ?>">Templates</a>
      <a href="/bundles"    class="<?= $active==='bundles'?'active':'' ?>">Bundles</a>
      <a href="/free/47-deductions" class="<?= $active==='free'?'active':'' ?>">Free guide</a>
      <a href="/about"      class="<?= $active==='about'?'active':'' ?>">About</a>
      <a href="/free/47-deductions" class="btn btn-primary">Get the guide</a>
    </nav>
  </div>
</header>
