<?php
// Loaded by every page. Sets up config, helpers, products, magnets.

$STRL_ROOT = __DIR__ . '/..';

$cfgFile = file_exists($STRL_ROOT . '/_config/config.php')
    ? $STRL_ROOT . '/_config/config.php'
    : $STRL_ROOT . '/_config/config.example.php';
$CONFIG   = require $cfgFile;
$PRODUCTS = require $STRL_ROOT . '/_data/products.php';
$MAGNETS  = require $STRL_ROOT . '/_data/magnets.php';

if (!function_exists('cfg')) {
    function cfg($k, $d = null) { global $CONFIG; return $CONFIG[$k] ?? $d; }
    function e($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
    function is_url_for($sku) {
        global $CONFIG;
        $u = $CONFIG['is_product_urls'][$sku] ?? '';
        return $u !== '' ? $u : ($CONFIG['etsy_shop_url'] ?? '#');
    }
    function has_is_url($sku) {
        global $CONFIG;
        return !empty($CONFIG['is_product_urls'][$sku] ?? '');
    }
    function has_is_endpoint() {
        global $CONFIG;
        return !empty($CONFIG['is_form_endpoint']);
    }
    function product($sku) { global $PRODUCTS; return $PRODUCTS[$sku] ?? null; }
    function magnet($id)   { global $MAGNETS;  return $MAGNETS[$id] ?? null; }
}
