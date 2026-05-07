<?php
$page_title       = $page_title       ?? 'The STR Ledger';
$page_description = $page_description ?? 'Editorial finance and operating systems for Airbnb and VRBO hosts. Excel workbooks, manuals, and tools that pay for themselves on the first booking.';
$page_canonical   = $page_canonical   ?? rtrim(cfg('site_url'), '/') . ($_SERVER['REQUEST_URI'] ?? '/');
$page_og_image    = $page_og_image    ?? rtrim(cfg('site_url'), '/') . '/assets/img/og-default.png';
$ga4 = cfg('ga4_id');
$plausible = cfg('plausible_domain');
$noindex = cfg('noindex', false);
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= e($page_title) ?></title>
<meta name="description" content="<?= e($page_description) ?>">
<link rel="canonical" href="<?= e($page_canonical) ?>">
<?php if ($noindex): ?><meta name="robots" content="noindex,nofollow"><?php endif; ?>
<meta property="og:title" content="<?= e($page_title) ?>">
<meta property="og:description" content="<?= e($page_description) ?>">
<meta property="og:type" content="website">
<meta property="og:url" content="<?= e($page_canonical) ?>">
<meta property="og:image" content="<?= e($page_og_image) ?>">
<meta property="og:site_name" content="The STR Ledger">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="/assets/img/favicon-32.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/css/site.css">
<?php if ($ga4): ?>
<script async src="https://www.googletagmanager.com/gtag/js?id=<?= e($ga4) ?>"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','<?= e($ga4) ?>');</script>
<?php elseif ($plausible): ?>
<script defer data-domain="<?= e($plausible) ?>" src="https://plausible.io/js/script.js"></script>
<?php endif; ?>
</head>
<body class="<?= e($page_body_class ?? '') ?>">
