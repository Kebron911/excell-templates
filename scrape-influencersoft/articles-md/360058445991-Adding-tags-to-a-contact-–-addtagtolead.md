# Adding tags to a contact – addtagtolead

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360058445991-Adding-tags-to-a-contact-addtagtolead
**Article ID:** 360058445991
**Updated:** 2021-03-12T20:49:56Z

---

[API 2.0](https://help.influencersoft.com/hc/en-us/sections/360012725711-API-2-0) / Adding tags to a contact – addtagtolead

Content

- [1 How does it work](#h_01F0M31YBDTE0T2CW65JJVKKHB)

- [2 Parameters passed in the request](#h_01F0M3296DJ6GS23CT5SQC5T29)

- [3 PHP example (cURL)](#h_01F0M32N37ZM0X5V6K4RB29E3P)

## How does it work

If you are not a developer, read [this article](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0-), it will make it much easier to use API 2.0.
You can add tags to contacts in your InfluencerSoft account by making a request to the service API programmatically.

The request is sent by the POST method in the URLencode format to the address: **https://username.influencersoft.com/api/addtagtolead**, where **username** is the user’s login in the system and his 3rd level domain in the InfluencerSoft service.

In response to the request, your system will receive the function execution result in JSON format. For example, like this:

{"error_code":0,"error_text":"OK","result":[],"hash":"******************************"}
For more details, see the article “[Service API Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)“.

## Parameters passed in the request

The request parameters are as follows, the required parameter is “rps_key” – your API key:

- rpsKey – API key; the key for your account is in the “Integration and API” section, the link to the section is in the footer of your personal account or here username.influencersoft.com/shops/setts/apisettings/

- add_tags – which tags to add to the contact; string; tags separated by commas

- lead_email – contact email; string

## PHP example (cURL)

<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://username.influencersoft.com/api/addtagtolead',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => 'rpsKey={API key}&lead_email={lead email}&add_tags={tags}',
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/x-www-form-urlencoded'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;

?>