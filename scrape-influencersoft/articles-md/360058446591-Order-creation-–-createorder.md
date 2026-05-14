# Order creation – createorder

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360058446591-Order-creation-createorder
**Article ID:** 360058446591
**Updated:** 2021-03-12T21:01:18Z

---

[API 2.0](https://help.influencersoft.com/hc/en-us/sections/360012725711-API-2-0) / Order creation – createorder

Content

- [1 How does it work?](#h_01F0M3HYSW8XKFKV1573P4G964)

- [2 Parameters passed in the request](#h_01F0M3JDBK5FPQ0S6SVF12VZQ3)

- [3 PHP example (cURL)](#h_01F0M3JQTBH8HP47ZW7ZPRTMF8)

## How does it work?

If you are not a developer, read [this article](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0-), it will make it much easier to use API 2.0.
You can create an order by making a request to the service API programmatically.

The request is sent by the POST method in the URLencode format to the address: **https://username.influencersoft.com/api/createorder**, where **username** is the user’s login in the system and his 3rd level domain in the InfluencerSoft service.

In response to the request, your system will receive the function execution result in JSON format. For example, like this:

{"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
For more details, see the article “[Service API Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)“.

## Parameters passed in the request

The request parameters are as follows, the required parameter is “rps_key” – your API key:

- rpsKey – API key; the key for your account is in the “Integration and API” section, the link to the section is in the footer of your personal account or here username.influencersoft.com/shops/setts/apisettings/

- customer_email – email of the contact to which to issue an invoice; string

- customer_first_name – contact name; string

- customer_last_name – contact surname; string

- customer_middle_name – middle name of the contact; string

- customer_phone – contact phone number; string

- order_ip – string (account / contact IP address)

- customer_shipping- shipping address; string

- customer_shipping_phone – customer’s phone number; string

- customer_shipping_address_2 – shipping address (it is recommended to use it as an additional field in case of complex addresses); string

- customer_shipping_city – shipping address (recommended for a city); string

- customer_shipping_state – shipping address (recommended for region / state); string

- customer_shipping_zip – shipping address (recommended for zip); string

- customer_shipping_country_code = string ([ISO country codes] ([https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes](https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes)), ex. “US”, “CA” etc)

- customer_billing_address_1 – string

- customer_billing_address_2 – string

- customer_billing_city – string

- customer_billing_state – string

- customer_billing_zip – string

- customer_billing_country_code – delivery country code; string; send in the format [ISO country codes] (ex. “US”, “CA” etc), will be automatically replaced by the country (for example, “US” will become “United States of America”)

- order_tag – order tag, there can be only one (not to be confused with the contact tag); string

- note – a note to the account, visible in the account card; string

- order_created_at – date and time when the invoice was created (30.01.2020 04:22:16 or 2019-07-30 04:22:16); string

- order_paid_at – date and time of order payment (01/30/2020 04:22:16 or 2019-07-30 04:22:16); string

- order_status – status of the created / modified order (Expected, Paid, Cancel or MoneyBack); string

- order_confirmed – whether the order is confirmed or not (Yes, No, True, False or Сonfirmed); string

- order_sales_manager – id of the personal manager for the contact (id is taken from the employee edit link /shops/access/)

- product_names – required parameter; id of products included in the invoice; values ​​separated by commas (taken from the link from the link to the order page)

- product_prices – optional parameter, product price; values ​​separated by commas; if not specified, the price will be taken from the product settings in the personal account; if there are 5 products in the invoice, and only 3 prices are clearly indicated, then the last two names will be with the price from the settings in the personal account (in a specific product)

- payment_method – string (PayPal, Stripe)

- coupon – discount coupon id (from the address bar when editing a coupon in your personal account; you can also get the getcoupons method); string

- affiliates – partner logins; line; separated by commas; the partner indicated first will be partners of the first level, the second – the second, etc.

- utm_medium – utm-label, string

- utm_source – utm-label, string

- utm_campaign – utm-label, string

- utm_content – utm-label, string

- utm_term – utm-label, string

In the near future, this method will also be able to work with additional fields that [you can create in CRM](https://help.influencersoft.com/hc/en-us/articles/360051177871-CRM-Settings#h_01ERBQT4QG1SRMQH9Z2648120J).

## PHP example (cURL)

<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://username.influencersoft.com/api/createorder',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => 'rpsKey=>customer_email=>customer_first_name=>
customer_last_name=>customer_middle_name=>customer_phone=>order_ip=>
customer_shipping=>customer_shipping_phone=>customer_shipping_address_2=>
customer_shipping_city=>customer_shipping_state=>customer_shipping_zip=>
customer_shipping_country_code=>customer_billing_address_1=>
customer_shipping_city=>customer_shipping_state=>customer_shipping_zip=>
customer_billing_address_1=>customer_billing_address_2=>customer_billing_city=>
customer_billing_state=>customer_billing_zip=>customer_billing_country_code=>
order_tag=>note=>order_created_at=>order_paid_at=>order_status=>order_confirmed=>
order_sales_manager=>product_prices=>payment_method=>coupon=>affiliates=>utm_medium=>
utm_source=>utm_campaign=>utm_content=>utm_term=',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/x-www-form-urlencoded'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;