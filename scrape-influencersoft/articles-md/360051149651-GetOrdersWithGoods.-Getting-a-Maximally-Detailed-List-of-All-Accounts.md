# GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts
**Article ID:** 360051149651
**Updated:** 2020-11-30T08:02:03Z

---

#### /[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / GetOrdersWithGoods. Getting a Maximally Detailed List of All AccountsContent

[1 Parameters Transferred in the Query](#h_01ER99P27GCJ8W9SDSWP8RNR90)

[2 How Does It Work?](#h_01ER99PDWAMGAK197MCY7VGR4D)

[3 Example of Getting the Orders List in PHP](#h_01ER99PSB7XC11P01R3DY3YYTF)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration via Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).
You can get the order list by requesting a query to the API service using software methods.

The query is sent by the POST method in the URL-encode format to the address: **http://username.influencersoft.com/api/getOrdersWithGoods **where **username **is the login of the user in the system, as well as their domain of the third level in the InfluencerSoft service.

In response, your system will receive the order data.

## Parameters Transferred in the Query

You can transfer the filters as follows:

1
2
3
4

 |

begin_date - invoice “from” date, with the format 01.01.2017

end_date - invoice “to” date, with the format 01.02.2017

paid - (bool) only paid orders

goods - (string or array) product's ID that is taken from the address bar when editing the product

 |

In the *begin_date – end_date interval*, you can enter a time interval for a month or less.
If these values are not transmitted, then the data is given for the current day.
If the end date is not specified, then the current moment is taken for it.
If the dates make an interval of more than a month, then it is cut down to a month in a way that the end date remains the one that the user transferred (or the current one, if the user did not specify it), but the initial one is cut.
If you specify the parameter paid = true, you will get the invoices that have been paid at the specified time interval.

## How Does It Work?

You call the GetOrdersWithGoods API function.

Your system will receive the result of the function performing and an array with order data in the result variable in response.

The data array will look as follows:

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88

 |

Array (

[0] => stdClass Object (

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

[payway] => way of the payment

[comment] => comment on the invoice

[domain] => order domain

[link] => link to paying for the order page

[good_count] => the number of products in the order

[price] => product price

[is_recurrent] => Is the bill recurrent? true/false

[bill_sum_topay] => left to pay

[tag] => tag

[kupon] => used coupon

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

 |

The response is coded in JSON format. For more details, see the [API Service Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-).

## Example of Getting the Orders List in PHP

We retrieve the information about the orders from 01/01/2017 to 01/02/2017 for products with 1, 2, 3 id.

GetHash Function forms the hash to the transferred data.

CheckHash Function checks the hash to the service response.

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71

 |

// Login to the InfluencerSoft system.

$user_rs['user_id'] = 'username';

  //The key for forming a hash. See API section (the link in the right bottom corner of the personal account).

$user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

// Forming the data array for transferring to the API.

$send_data = array(

    'begin_date' => '01.01.2017',

    'end_date' => '01.02.2017',

    'paid' => 'true', // only paid invoices or false

    'goods' => array(1, 2, 3) //products ID

);

// Forming the hash to the transmitted data.

$send_data['hash'] = GetHash($send_data, $user_rs);

//Calling the GetOrdersWithGoods function and decoding the received data.

$resp = json_decode(Send('http://username.influencersoft.com/api/getOrdersWithGoods', $send_data));

// Checking the service response.

if(!CheckHash($resp, $user_rs)){

echo "Error! The response hash is not true!" ; print_r($resp);

exit;

}

if($resp->error_code == 0){

echo “Order information”;

print_r($resp->result);

}
else

echo "Error code:{$resp->error_code} - description: {$resp->error_text}";

// ===========  Functions of sending, receiving and processing a response. ============

//   Sending the query to the API service

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

$params = "$params::$user_id::$secret";

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

 |

## Articles

*[CreateOrder. Creating a New Invoice](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice-)*

*[UpdateOrderStatus. Changing Invoice Status](https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status-)*

*[DeleteOrder. Deleting / Hiding an Invoice](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice-)*

*[GetOrders. Getting a List of All Invoices](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices-)*

*[GetOrderDetails. Getting Detailed Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050558052-GetOrderDetails-Getting-Detailed-Invoice-Information)*

*[GetOrderInfo. Getting Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050664772-GetOrderInfo-Getting-Invoice-Information-)*

## Rate Article