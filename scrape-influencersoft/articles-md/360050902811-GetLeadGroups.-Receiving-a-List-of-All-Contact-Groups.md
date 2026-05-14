# GetLeadGroups. Receiving a List of All Contact Groups

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups
**Article ID:** 360050902811
**Updated:** 2021-05-24T02:30:16Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / GetLeadGroups. Receiving a List of All Contact Groups

**Content **

[1 Parameters Transferred in the Query ](#h_01ERBWFPNE5TRJ831VR8BPB9FR)

[2 How Does It Work? ](#h_01ERBWFG77GR94HVJQBJNHS8AT)

[3 Example of Getting a Subscription Groups List in PHP ](#h_01ERBWF6TYPK2JJ89Q1VPCQJMJ)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

**This method is out-of-date.  **

**Use [GetLeadGroupStatuses](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-) instead.**

You can get the contact groups list by requesting a query to the API service by software methods using their email. In response, your system will receive an array. Therefore, each group will be transferred to a group ID and given a group name.

The query is sent by the POST method in the URL-encode format to the address: http://username.influencersoft.com/api/**GetLeadGroups **where **username **is the login of the user to the system, as well as their domain of the third level in the InfluencerSoft service.

## Parameters Transferred in the Query

-
email is the subscriber’s e-mail that you need to get the current groups list (required)

The one and only field is the email field.

## How Does It Work?

You transfer the client email to the GetLeadGroups API function. Your system will receive the result of the function-performing and an array with subscription groups in the result variable in response.

The groups array will look as follows:

$resp->result = Array (

[0] => array (
[rass_name] => Group 1 ID
[rass_title] => Group 1 Name
)

[1] => array (
[rass_name] => Group 2 ID
[rass_title] => Group 2 Name
)

[2] => array (
[rass_name] => Group 3 ID
[rass_title] => Group 3 Name
The response is coded in JSON format. For more details, see the “API Service Responses”.

## Example of Getting a Subscription Groups List in PHP

We get subscription groups for the user with the email [fiztov5@test.com](mailto:fiztov5@test.ru) in the example. Your username in the system is “username”.

GetHash Function forms the hash to the transferred data.

CheckHash Function checks the hash to the service response.

// Login to the InfluencerSoft system.
 $user_rs['user_id'] = 'username';
  // The key for forming a hash. See API section (the link in the bottom right corner of the personal account)
 $user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

 // Forming the data array for transferring to the API
$send_data['email'] = 'fiztov5@test.com'; // Client email, that we get the subscription groups list from

// Forming the hash to the transmitted data
$send_data['hash'] = GetHash($send_data, $user_rs);

// Calling the GetLeadGroups function and decoding the received data
$resp = json_decode(Send('https://username.influencersoft.com/api/GetLeadGroups', $send_data));

// Checking the service response
if(!CheckHash($resp, $user_rs)){
	echo "Error! The response hash is not true!" ; print_r($resp);
	exit;
}

if($resp->error_code == 0){
echo “Group List”;
print_r($resp->result);
}
else
	echo "Error code: {$resp->error_code} - description: {$resp->error_text}";

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
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // outputting the response to the variable.

	$res = curl_exec($ch);

	curl_close($ch);
	return $res;
}

// Forming the transferred to the API data hash
function GetHash($params, $user_rs) {
	$params = http_build_query($params);
	$user_id = $user_rs['user_id'];
	$secret = $user_rs['user_rps_key'];
	$params = "$params::$user_id::$secret";
	return md5($params);
}

// Checking the received response hash
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

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status* ](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*AddLeadToGroup. Adding a Contact to a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050435412-AddLeadToGroup-Adding-a-Contact-to-a-Group-)

[*UpdateSubscriberData. Editing the Existing Contact’s Data* ](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data-)

[*DeleteSubscribe. Unsubscribe a Contact from a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)

[*GetAllGroups. Receiving a List of all Contact Groups from the Account* ](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)

## Rate Article