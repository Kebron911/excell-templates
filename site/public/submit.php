<?php
/**
 * Lead-form fallback handler.
 *
 * If config.is_form_endpoint is set, the form posts directly to Influencersoft
 * and never hits this file. This file runs only as a graceful fallback —
 * it logs the lead, mails support_email, and redirects to /thank-you.
 */
require_once __DIR__ . '/_inc/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /'); exit;
}

$email   = trim($_POST['email'] ?? '');
$magnet  = trim($_POST['magnet'] ?? '');
$redir   = $_POST['redirect'] ?? '/thank-you';

// Light validation — block obvious junk and bot honeypots
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Invalid email.'; exit;
}
if (!preg_match('/^[a-z0-9-]{1,40}$/i', $magnet)) { $magnet = 'unknown'; }

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 200);
$ts = date('c');

// Append to a daily lead log (outside webroot would be better, but Hostinger shared)
$logDir = __DIR__ . '/_data';
$logFile = $logDir . '/leads-' . date('Y-m') . '.log';
@file_put_contents($logFile, "$ts\t$magnet\t$email\t$ip\t$ua\n", FILE_APPEND | LOCK_EX);

// Email the support inbox
$to = cfg('support_email');
$subject = "[lead] $magnet — $email";
$body = "Lead captured\n"
      . "Time: $ts\nMagnet: $magnet\nEmail: $email\nIP: $ip\nUA: $ua\n";
$headers = "From: no-reply@thestrledger.com\r\n"
         . "Reply-To: $email\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";
@mail($to, $subject, $body, $headers);

// Redirect to thank-you (sanitize redirect to same-origin path)
$safe = preg_match('#^/[a-z0-9?=&_/-]*$#i', $redir) ? $redir : '/thank-you';
header('Location: ' . $safe);
exit;
