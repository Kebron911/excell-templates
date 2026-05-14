# GetPartnerStats. Get Partner’s Statistics 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050671232-GetPartnerStats-Get-Partner-s-Statistics
**Article ID:** 360050671232
**Updated:** 2021-05-24T01:24:38Z

---

/[API ](https://help.influencersoft.com/hc/en-us/sections/360009245591-API)/ GetPartnerStats. Get Partner’s Statistics

#### Content

[1 Parameters Transferred in the Query](#h_01ER7DWN96XRM1X2K0P45MH46Q)

[2 How Does It Work?](#h_01ER7DWWE6B9KNAWAXBKBQW0CR)

[3 Example in PHP](#h_01ER7DX6DWXYFPQ7F6PBZENN70)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about[ Integration via Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).
You can get statistics for any of your partners by requesting a query to the API service using software methods.

Your system will get an array with statistics for the selected partner (for a particular period of time).

The query is sent by the POST method in the URL-encode format to the address: http://username.influencersoft.com/api/**GetPartnerStats **where **username **is the login of the user in the system, as well as their domain of the third level in the InfluencerSoft service.

## Parameters Transferred in the Query

- partner – Partner’s login (required)

- date_from – The lower limit of the time interval of statistics, in the format YYYY-MM-DD (optional)

- date_to – The upper limit of the time interval for statistics, in the format YYYY-MM-DD (optional)

## How Does It Work?

You call the GetPartnerStats API function.

Your system will receive the result of the function performing and an array that will look as follows:

Array[
     'earned_total'   => charged $,
     'topay_total'    => pay $,
     'clicks_total'   => number of clicks,
     'leads_total'    => number of contacts,
     'bills_total'    => number of payments,
     'partners_total' => number of partners,
]

The response is coded in JSON format. For more details ,see the [API Service Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-).

## Example in PHP

GetHash Function forms the hash to the transferred data.

CheckHash Function checks the hash to the service response.

// Login to the InfluencerSoft system
$user_rs['user_id'] = 'username';
// The key for forming a hash. See API section (the link in the bottom right corner of the personal account)
$user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// Forming the array of bought goods for transferring to the API
$send_data = array(
    'partner'   => 'my_partner_login',
    'date_from' => '2016-08-01',
    'date_to'   => '2016-09-22',
);

// Forming the hash to the transmitted data
$send_data['hash'] = GetHash($send_data, $user_rs);

// Calling the GetAPartnerStats function and decoding the received data
$resp = json_decode(Send('http://username.influencersoft.com/api/GetPartnerStats', $send_data));

// Checking the service response
if (!CheckHash($resp, $user_rs)){
    echo "Error! The response hash is not true!"; print_r($resp);
    exit;
}

if ($resp->error_code == 0){
    echo "Partner’s Statistics:";
    print_r($resp->result);
} else {
    echo "Error code:{$resp->error_code} - description: {$resp->error_text}";
}

// =========== Functions of sending, receiving and processing a response ============

// Sending the query to the API service
function Send($url, $data)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // outputting the response to the variable

    $res = curl_exec($ch);

    curl_close($ch);
    return $res;
}

// Forming the transferred to the API data hash
function GetHash($params, $user_rs)
{
    $params  = http_build_query($params);
    $user_id = $user_rs['user_id'];
    $secret  = $user_rs['user_rps_key'];
    $params  = "$params::$user_id::$secret";
    return md5($params);
}

// Checking the received response hash
function CheckHash($resp, $user_rs)
{
    $secret = $user_rs['user_rps_key'];
    $code = $resp->error_code;
    $text = $resp->error_text;
    $hash = md5("$code::$text::$secret");

    if ($hash == $resp->hash) {
        return true; // the hash is correct
    } else {
        return false; // the hash is not correct
    }
}

### Rate article