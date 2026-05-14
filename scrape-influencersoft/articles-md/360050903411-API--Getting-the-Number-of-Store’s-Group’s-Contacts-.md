# API: Getting the Number of Store’s/Group’s Contacts 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050903411-API-Getting-the-Number-of-Store-s-Group-s-Contacts
**Article ID:** 360050903411
**Updated:** 2021-05-24T01:53:47Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / Getting the Number of Shop’s/Group’s Contacts

**Content **

[1 Parameters Transferred in the Query ](#h_01ERBX6M0G72KPEAX7XBX2K5VR)

[2 How Does It Work? ](#h_01ERBX6TMZXN0KH1JHQBJNHKCA)

[3 Example of Getting a Subscription Groups List in PHP ](#h_01ERBX722CBXQ6EV8KZ9YP8K4C)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

You can get the number of contacts from your account, or from the group, by requesting a query to the API service through software methods using their email. In response, your system will receive the numerical value of the number of contacts that can be used for example to display on the page of the site in the form: “We have … already!” or “Already registered … people.”

The query is sent by the POST method in the URL-encode format to the address http://username.influencersoft.com/api/**GetCountSubscribe** where the **username **is the login of the user in the system, as well as their domain of the third level in the InfluencerSoft service.

## Parameters Transferred in the Query

The one and only field is the group identifier field.

Identifiers reserved:

-
unique – getting the number of active unique contacts;

-
all – get the number of all contacts.

## How Does It Work?

You call the GetCountSubscribe API function.

Your system will receive the number of the shop’s contacts depending on the identifier. If there is a group identifier, the system will receive the number of the selected contact group. Also, you can use reserved identifiers.

The response is coded in JSON format. For more details, see the  [API Service Responses. ](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)

## Example of Getting a Subscription Groups List in PHP

GetHash Function forms the hash to the transferred data.

CheckHash Function checks the hash to the service response.

// Login to the InfluencerSoft system.
$user_rs['user_id'] = 'username';
  // The key for forming a hash. See API section (the link in the right bottom corner of the personal account).
$user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// Forming the data array for transferring to the API.
$send_data['group_name'] = "group identifier (you also can specify the reserved ones)";
// Forming the hash to the transmitted data.
$send_data['hash'] = GetHash($send_data, $user_rs);

//Calling the GetCountSubscribe function and decoding the received data.
$resp = json_decode(Send('http://username.influencersoft.com/api/GetCountSubscribe', $send_data));

//Checking the service response.
if(!CheckHash($resp, $user_rs)){
	echo "Error! The response hash is not true!" ; print_r($resp);
	exit;
}

if($resp->error_code == 0){
	echo “Number of contacts”
;
	print_r($resp->result);
}
else
	echo "Error code: {$resp->error_code} - description: {$resp->error_text}";

// ===========  Functions of sending, receiving and processing a response. ============

//  Sending the query to the API service
function Send($url, $data)
{
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // we output the answer to a variable

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

## Articles

[*The Script Notification When Unsubscribing **f**rom Your Newsletters* ](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters-)

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status*](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*AddLeadToGroup. Adding a Contact to a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050435412-AddLeadToGroup-Adding-a-Contact-to-a-Group-)

[*UpdateSubscriberData. Editing the Existing Contact’s Data* ](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data-)

[*DeleteSubscribe. Unsubscribe a Contact from a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)

[*GetLeadGroups. Receiving a List of All Contact Groups* ](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups#h_01ERBWFG77GR94HVJQBJNHS8AT)

## Rate Article