# GetOrderDetails. Getting Detailed Invoice Information

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050558052-GetOrderDetails-Getting-Detailed-Invoice-Information
**Article ID:** 360050558052
**Updated:** 2021-05-24T02:41:58Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / GetOrderDetails. Getting Detailed Invoice Information

**Content**

[1 Parameters Transferred in the Query ](#h_01ERA40YFZQA3S0MG6Z33N2NK2)

[2 How Does It Work ](#h_01ERA416B09N7A1XDKZ13AH1RS)

[3 Example of Getting the Invoice Information in PHP ](#h_01ERA41DVGA1RH48T10P5R4EYD)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

You can get detailed information about the order by its ID by sending a query to the API service using software methods.

The query is sent by the POST method in the URL encode format to the address: **http://username.influencersoft.com/api/getOrderDetails** where the **username **is the login of the user in the system, as well as their domain of the third level in the InfluencerSoft service.

Your system will receive the invoice information in response.

## Parameters Transferred in the Query

The method can contain:

bill_id - (int) invoice ID (required)
good_info - (bool) add the product information
If you pass 1 or true in the *good_info* parameter, the following information will be displayed:

-
**good_ids** is the product id in the invoice

-
**good_count** is the number of products in the invoice

-
**prepayment_enabled** shows whether prepayment is allowed

-
**prepayment_minsum** is the minimal prepayment amount.

**How Does It Work? **

You call getOrderDetails API function. Your system will receive the result of the function and perform the data array in the result variable in response.

The data array will look as follows:

stdClass Object (
[id] => invoice number,
[first_name] => name
[last_name] => surname
[middle_name] => middle name
[email] => email
[phone] => telephone number
[city] => city
[country] => country
[address] => address
[region] => region
[postalcode] => postal code
[created] => date of creating the invoice
[pay_status] => invoice status
[paid] => date of paying the invoice
[type] => order type
[payway] => method of payment
[comment] => comment on the invoice
[domain] => order domain
[link] => link to paying for the order page
[good_count] => the number of products in the order
[price] => product price
[bill_sum_topay] => left to pay
[tag] => tag
[coupon] => used coupon

[utm] => stdClass Object
(
[medium] => channel utm-parameter (if exists)
[source] => source utm-parameter (if exists)
[campaign] => campaign utm-parameter (if exists)
[content] => advertisement utm-parameter (if exists)
[term] => key utm-parameter (if exists)
)

[items] => Array (
[0] => stdClass Object (
[id] => product identifier
[title] => product name
[sum] => the actual cost
[price] => product price from settings
[pincode] => transferred pincode

[partners] => Array
(
[0] => stdClass Object
(
[partner_lvl] => affiliate program level
[partner_id] => partner’s ID
[partner_name] => partner’s login
[partner_fee] => partner’s fee
)

[1] => stdClass Object
(
[partner_lvl] => affiliate program level
[partner_id] => partner’s ID
[partner_name] => partner’s login
[partner_fee] => partner’s fee
)
)
)

[1] => stdClass Object (
[id] => product identifier
[title] => product name
[sum] => the actual cost
[price] => product price from settings
[pincode] => transferred pincode
[partners] => Array
(
[0] => stdClass Object
(
[partner_lvl] => affiliate program level
[partner_id] => partner’s ID
[partner_name] => partner’s login
[partner_fee] => partner’s fee
)

[1] => stdClass Object
(
[partner_lvl] => affiliate program level
[partner_id] => partner’s ID
[partner_name] => partner’s login
[partner_fee] => partner’s fee
)
)
)
)
)
The response is coded in JSON format. For more details, see the [API Service Responses. ](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)

If you transferred *the bill_domain* parameter to the CreateOrder function, the variable $resr->result[‘link’]will contain the full link for payment in the [http://your-domain.com/bill/…](http://your-domain.ru/bill/%E2%80%A6) format after the response. You can use it like that, for example :

header("Location: " . $resp->result['link']);
If you didn’t transfer *the bill_domain* parameter to the CreateOrder function, add the protocol and domain to the link after the response:

header("Location: http://your-domain.com" . $resp->result['link']);

## Example Of Getting the Invoice Information in PHP

In the example, we get the order 102937 information.

GetHash Function forms the hash to the transferred data.

CheckHash Function checks the hash to the service response.

// Login to the InfluencerSoft system.
$user_rs['user_id'] = 'username';
//The key for forming a hash. See API section (the link in the bottom right corner of the personal account).
$user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Forming the array of bought goods for transferring to the API.
$send_data = array(
	'bill_id' => '102937', //order ID
	'good_info' => true

);

// Forming the hash to the transmitted data.
$send_data['hash'] = GetHash($send_data, $user_rs);

//Calling the getOrderDetails function and decoding the received data.
$resp = json_decode(Send('http://username.influencersoft.com/api/getOrderDetails', $send_data));

//Checking the service response.
if(!CheckHash($resp, $user_rs)){
	echo "Error! The response hash is not true!" ; print_r($resp);
	exit;
}

if($resp->error_code == 0){
	echo "The order information:";
	print_r($resp->result);
}
else
	echo "Error code:{$resp->error_code} - description: {$resp->error_text}";

// =========== Functions of sending, receiving and processing a response. ============

// Sending the query to the API service
function Send($url, $data)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // outputting the response to the variable.

	$res = curl_exec($ch);

	curl_close($ch);
	return $res;
}

// Forming the transferred to the API data hash.
function GetHash($params, $user_rs) {
	$params = http_build_query($params);
	$user_id = $user_rs['user_id'];
	$secret = $user_rs['user_rps_key'];
	$params = "{$params}::{$user_id}::{$secret}";
	return md5($params);
}

// Checking the received response hash.
function CheckHash($resp, $user_rs) {
	$secret = $user_rs['user_rps_key'];
	$code = $resp->error_code;
	$text = $resp->error_text;
	$hash = md5("$code::$text::$secret");
	if($hash == $resp->hash)
		return true; // the hash is correct
	else
		return false; // the hash is not correct
}

## Articles

[*GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts* ](https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts)

[*CreateOrder. Creating a New Invoice* ](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice-)

[*UpdateOrderStatus. Changing Invoice Status* ](https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status-)

[*DeleteOrder. Deleting/Hiding an Invoice* ](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice-)

[*GetOrders. Getting a List of All Invoices* ](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices-)

[*GetOrderInfo. Getting Invoice Information* ](https://help.influencersoft.com/hc/en-us/articles/360050664772-GetOrderInfo-Getting-Invoice-Information-)

## Rate Article