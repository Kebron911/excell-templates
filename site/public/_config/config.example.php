<?php
/**
 * The STR Ledger — site configuration
 *
 * Copy to config.php and fill placeholders before deploy.
 * config.php is gitignored. Never commit real values.
 */

return [
    // Brand + canonical
    'site_url'      => 'https://thestrledger.com',
    'site_name'     => 'The STR Ledger',
    'support_email' => 'hello@thestrledger.com',

    // Influencersoft (D1) — sales pages each "Buy" button opens.
    // Empty string = falls back to etsy_shop_url.
    'is_product_urls' => [
        'GST-001' => '', 'GST-002' => '',
        'OPS-001' => '', 'OPS-002' => '',
        'TAX-001' => '', 'TAX-002' => '', 'TAX-003' => '', 'TAX-004' => '',
        'FIN-001' => '', 'FIN-003' => '',
        'ACQ-001' => '', 'LGL-001' => '',
    ],

    // Influencersoft form endpoint for lead-magnet opt-ins.
    // Until set, forms POST to /submit.php which mails support_email.
    'is_form_endpoint' => '',
    'is_api_key'       => '',

    'is_magnet_tags' => [
        '47-deductions'    => '',
        'welcome-book'     => '',
        'etsy-buyer'       => '',
        'entity-flowchart' => '',
    ],

    // Analytics
    'ga4_id'           => '',  // e.g. G-XXXXXXXX. Empty = no tag rendered.
    'plausible_domain' => '',  // alternative to GA4

    // Etsy fallback URL
    'etsy_shop_url'    => 'https://www.etsy.com/shop/TheSTRLedger',

    // Pre-launch toggle: noindex the whole site
    'noindex'          => false,
];
