<?php
// Variables expected: $magnet_id (string)
$m = magnet($magnet_id);
$action = has_is_endpoint() ? cfg('is_form_endpoint') : '/submit.php';
$method = has_is_endpoint() ? 'post' : 'post';
?>
<form class="lead-form" action="<?= e($action) ?>" method="<?= e($method) ?>">
  <input type="hidden" name="magnet" value="<?= e($magnet_id) ?>">
  <input type="hidden" name="redirect" value="/thank-you?m=<?= e($magnet_id) ?>">
  <?php if (has_is_endpoint() && !empty($m['is_tag'])): ?>
    <input type="hidden" name="tag" value="<?= e($m['is_tag']) ?>">
  <?php endif; ?>
  <input type="email" name="email" placeholder="you@yourstr.com" required autocomplete="email">
  <button type="submit" class="btn btn-gold btn-lg">Send the guide</button>
</form>
<p class="form-note">No spam. One email. Unsubscribe anytime.</p>
