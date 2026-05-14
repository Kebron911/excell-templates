# DeleteSubscribe. Unsubscribe a Contact from a Group

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group
**Article ID:** 360050901211
**Updated:** 2021-05-23T23:58:06Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / DeleteSubscribe. Unsubscribe a Contact from a Group

**Content **

[1 Parameters Transferred in the Query ](#h_01ERBVRSGZQ9AS3DN0MYXPCXQW)

[2 How Does It Work? ](#h_01ERBVS0J72VKZSDQQ02TSZ5QX)

[3 Example of Changing the Contact Data in PHP ](#h_01ERBVS716041YECZ54V5CVQBC)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).

You can unsubscribe contacts from a group in your InfluencerSoft account by requesting a query to the API service using software methods.

The query is sent by the POST method in the URL encode format to the address: http://username.influencersoft.com/api/**DeleteSubscribe **where the **username **is the login of the user in the system, as well as their domain of the third level in the InfluencerSoft service.

## Parameters Transferred in the Query

-
lead_email is the email of the unsubscribing contact

-
rass_name is the unsubscribing client contacts group identifier

Both fields are required.

## How Does It Work?

Your system will receive the result of the function in response. The response is coded in JSON format. For more details, see the [API Service Responses. ](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)

The activation confirmation email will not be received after re-subscribing.

## Example of Changing the Contact Data in PHP

In the example, we unsubscribe the user with the **lead@email.****com** email from the “super” group. Login to the system is **username**.

Function GetHash forms the hash to the transferred data.

Function CheckHash checks the hash of the service response.

 // Login to the Influencersoft system
 $user_rs['user_id'] = 'username';
 //The key for forming a hash. See API section (the link in the bottom right corner of the personal account).
 $user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

 // Forming the data array for transferring to the API.
 $send_data = array(
    'lead_email' => '[lead@email.com](mailto:lead@email.ru)', // user’s email
   'rass_name' => 'super' // unsubscribing group

   );
// Forming the hash to the transmitted data.
$send_data['hash'] = GetHash($send_data, $user_rs);
// Forming the hash to the transmitted data.
$resp = json_decode(Send('http://username.justclick.io/api/DeleteSubscribe', $send_data));
//Checking the service response.
if(!CheckHash($resp, $user_rs)){
 echo "Error! The response hash is not valid!" ;
 exit;
}
if($resp->error_code == 0)
 echo "The user unsubscribed the group {$send_data['rid[0]']}. Service resonse: {$resp->error_code}";
else
 echo "Error code:{$resp->error_code} - description: {$resp->error_text}";
// ===========  Functions of sending, receiving and processing a response. ============
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
**
Articles**

[*The Script Notification When Unsubscribing **f**rom Your Newsletters* ](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters-)

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status* ](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*AddLeadToGroup. Adding a Contact to a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050435412-AddLeadToGroup-Adding-a-Contact-to-a-Group-)

[*UpdateSubscriberData. Editing the Existing Contact’s Data* ](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data-)

[*GetLeadGroups. Receiving a List of All Contact Groups* ](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups)

[*GetAllGroups. Receiving a List of all Contact Groups from the Account* ](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)

## Rate Article