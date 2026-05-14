# API Response Statuses, Codes, and Descriptions 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions
**Article ID:** 360050392312
**Updated:** 2021-05-24T01:44:01Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / API Response Statuses, Codes and Descriptions

**Content **

[1 Code and Response Messages from the InfluencerSoft Service API Table ](#h_01ERAYM2720EEDXY2JV3H1ZQZY)

[2 Example in PHP Receiving and Processing the Service Response ](#h_01ERAYMA620DZRXK174KFG2381)

## Code and Response Messages from the InfluencerSoft Service API Table

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

After each access to the API service functions, the system receives a response in the JSON encoding.

*(For how to get it and process it, see the PHP example below.)*

In the answer, **error_code**, **error_text,** and **hash **fields are returned. Sometimes the **result **array returns when it is necessary to return more data:

-
**error_code **is the numerical code of the error message;

-
**error_text **is a text error message;

-
**hash **is a signature to the data to make sure that the response is from our system, and not forged (for how it is formed, see below);

-
**result **is the array with the result data (for example, *result-> bill_id* is the number of the created order).

error_code |
error_text |
description |

general errors |

0 |
ok |
The action has performed successfully. |

1 |
not transferred hash |
The hash of the query is not transferred. |

2 |
no transmitted data |
The parameters of the query are not transmitted. |

3 |
wrong posted data |
The parameters of the query are wrong. |

4 |
incorrect hash |
The hash of the query is wrong. |

5 |
invalid user name |
The login is not transferred or not found in the InfluencerSoft System |

6 |
permission denied for ip … |
Access is denied for the specified IP. |

7 |
account disabled |
Account is disabled. |

Adding A Contact Errors |

0 |
activation email sent to subscriber |
The user is added to groups. He or she is sent an activation letter. |

100 |
email is missing |
There is no email contact in the transmitted parameters. |

101 |
subscription error: (description) |
Error in adding a user to the group. |

102 |
the subscriber is already registered |
Contact already exists in all transferred groups. |

103 |
has an invalid subscriptions group |
A non-existent group was transferred in the query. |

104 |
subscription forbidden for (group id) |
Adding a contact to this group is impossible. For example, it is an auto group. |

Order Operating Errors |

0 |
order status changed |
The order status has changed successfully. |

200 |
nonexistent order |
The order with the specified number doesn’t exist. |

201 |
wrong status |
The order status is invalid. |

202 |
order not paid |
The error occurred while paying for the order. |

203 |
order number is empty |
No order number is transferred. |

Deleting And Editing A Status Of Order Errors |

0 |
order status changed |
The order status is changed successfully. |

0 |
order deleted |
The order is successfully deleted. |

302 |
nonexistent order |
A non-existent order number was transferred in the query. |

303 |
wrong status |
There is no such order status in the system. |

Obtaining A Purchased Products List Using The Customer’s Email Errors |

400 |
order not found |
The order with the specified number doesn’t exist. |

Obtaining A Group List Using The Customer’s Email Errors |

500 |
subscriber not found |
The subscriber with the specified email doesn’t exist. |

501 |
group not found |
The contact is not included in any group. |

Creating The Order Error |

600 |
wrong email |
Wrong customer’s email is transmitted. |

601 |
order already exist. his number send in result array. |
This order already exists. (Its number will be transferred in result-> bill_id). |

602 |
error creating order |
The System could not create an order. |

603 |
missing products |
There are no goods in the order. |

604 |
product not exist |
There is no product with this ID in your store. (The ID of this product will be returned). |

605 |
not having any data for delivery products |
There is not enough data to deliver the product (no address or name). |

Receiving All The Products Errors |

700 |
no products |
The Shop doesn’t have any products. |

Adding A Contact Errors |

800 |
group subscribers is not found |
The specified group of contacts is not found (it doesn’t exist). |

801 |
subscriber with such address is not found |
The specified contact is not found (he/she doesn’t exist). |

Retrieving The Order Data Errors |

400 |
Order not found |
The order with the specified number doesn’t exist. |

*The response table will be supplemented, as the API service is developed.*

## Example in PHP Receiving and Processing the Service Response

// Login to the InfluencerSoft system.
$user_rs['user_id'] = 'username';

// The key for forming a hash. see "Shop" - "Settings" - "CanadaPostService and API" - "Secret key for signing".
$user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

//Forming the data array for transferring to the API.
$send_data = array
(
'rid[0]' =>
'super', 'lead_name' =>
'Name', 'lead_email' =>
'lead@email.com', 'lead_phone' =>
'+788888888', 'lead_city' =>
'City', 'aff' =>
111, 'tag' =>
'this is tag', 'ad' =>
1111, 'doneurl2' =>
'http://yandex.ru/', );

// Forming the hash to the transmitted data.
$send_data['hash'] = GetHash($send_data, $user_rs);

// Calling the AddLeadToGroup function in the API and decoding the received data.
$resp = json_decode(Send('https://username.influencersoft.com/api/AddLeadToGroup', $send_data));

// Checking the service response.
if(!CheckHash($resp, $user_rs))
{
echo "Error! The response hash is not true!";
exit;
}
if($resp->error_code == 0)
echo "User added to group {$send_data['rid[0]']}. Service response: {$resp->error_code}";
else
echo "Error code:{$resp->error_code} - description: {$resp->error_text}";

// =========== Functions of sending, receiving and processing a response ============

// Sending the query to the API service.
function Send($url, $data)
{ $ch = curl_init(); curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// outputting the response to the variable.
$res = curl_exec($ch); curl_close($ch); return $res; }

// Forming the transferred to the API data hash.
function GetHash($params, $user_rs)
{ $params = http_build_query($params); $user_id = $user_rs['user_id'];
$secret = $user_rs['user_rps_key'];
$params = "$params::$user_id::$secret"; return md5($params); }

// Checking the received response hash.
function CheckHash($resp, $user_rs)
{ $secret = $user_rs['user_rps_key'];
$code = $resp->error_code;
$text = $resp->error_text;
$hash = md5("$code::$text::$secret");
if($hash == $resp->hash) return true; // the hash is correct
else return false; // the hash is not correct
}

##

## Articles

[*Enabling API **t**o Get Started* ](https://help.influencersoft.com/hc/en-us/articles/360050867731-Enabling-API-to-Get-Started)

[*General Principles of Working with API* ](https://help.influencersoft.com/hc/en-us/articles/360050868031-General-Principles-of-Working-with-API)

[*Countries’ Identifiers* ](https://help.influencersoft.com/hc/en-us/articles/360050867391-Countries-Identifiers-)

## Rate Article