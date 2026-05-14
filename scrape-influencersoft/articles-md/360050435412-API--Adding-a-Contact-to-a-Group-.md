# API: Adding a Contact to a Group 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050435412-API-Adding-a-Contact-to-a-Group
**Article ID:** 360050435412
**Updated:** 2021-05-24T01:50:25Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / AddLeadToGroup. Adding a Contact to a Group

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

You can add new contacts to your InfluencerSoft account by requesting a query to the API service using software methods.

You can add a contact to separate groups at the same time.

The query is sent by the POST method in the URL encode format to the address: http://username.influencersoft.com/api/**AddLeadToGroup **where **username** is the login of the user in the system, as well as their domain of the third level in the InfluencerSoft service.

## Parameters Transferred in the Query

The query parameters coincide with the parameters of the subscription form (see **How to ****C****reate a ****S****ubscription ****F****orm** for more details), as follows:

-
*rid [**0]** *is the first group to which the contact will be added (the symbolic identifier of the group);

-
*rid [1] *is the second group to which the contact will be added, and so on (optional);

-
*lead_name** *is the Contact Name, Contact Full Name, or Nickname (optional – if it is empty, it will be replaced by “Dear Friend”);

-
*lead_email** *is the contact e-mail;

-
*lead_phone** *is the contact telephone number (optional);

-
*lead_city** *is the city of residence of the contact (optional);

-
*tag** *is an unspecified string label that will mark the contact (optional);

-
*doneurl2** *is the address of redirecting the contact after the subscription is confirmation (optional);

-
*activation *is a parameter that allows you to decide whether to require the subscriber to confirm the subscription or not. (Not necessarily, it is used only on the “Guru” tariff for compulsory activation of the subscription confirmation.);

-
*utm** [**utm_medium**]** *is the channel utm-parameter (optional);

-
*utm** [**utm_source**]** *is the source utm-parameter (optional);

-
*utm** [**utm_campaign**]** *is the campaign utm-parameter (optional);

-
*utm [utm_content] *is the advertisement parameter (optional);

-
*utm** [**utm_term**]** *is the key utm-parameter (optional);

-
*utm** [**aff_medium**]** *is the channel affiliate parameter (optional);

-
*utm** [**aff_source**]** *is the source affiliate parameter (optional);

-
*utm** [**aff_campaign**]** *is the campaign affiliate parameter (optional);

-
*utm [aff_content] *is the advertisement affiliate parameter (optional);

-
*utm** [**aff_term**]** *is the key affiliate parameter (optional).

Only the two fields *rid [**0]* and *lead_email* are needed. The rest is up to you.

If you want to send information that the subscriber has come from a partner, send two parameters utm [utm_medium] and utm [utm_source] as follows:

'utm[utm_medium]' => 'affiliate', //only 'affiliate' and nothing else
'utm[utm_source]' => 'username', // partner’s login to InfluencerSoft system
You also can use affiliate utm_marks (utm [aff_ …]). In this case, the specified partner must necessarily be a member of the affiliate program, and the tag data (utm [aff_ …]) will be displayed only in the partner’s cabinet.

If you want to confirm the subscription from the user, you must pass TRUE to the activation field.

## How Does It Work?

Adding a contact is the same as via using the subscription form, i.e. if activation of the subscription is needed, a relevant notification will be sent to the given e-mail.

The response is coded in JSON format. For more details, see the [API Service Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-).

## Example of Adding a Subscriber to the Group in PHP

In the example, we add the user with the e-mail **lead@email.****com** in the “super” group. Login to the system is **username**.

Function GetHash forms the hash to the transferred data.

Function CheckHash checks the hash of the service response.

 // Login to InfluencerSoft system
  $user_rs['user_id'] = 'username';

// The key for forming a hash. See API section (the link in the bottom right corner of the personal account).
  $user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  //Forming the data array for transferring to the API.
 $send_data = array(
 'rid[0]' => 'super', // <span style="font-weight: 400;" data-mce-style="font-weight: 400;">the group the subscriber will go to.</span>
 'lead_name' => 'Name',
 'lead_email' => 'lead@email.com',
 'lead_phone' => '+788888888',
 'lead_city' => 'City',
 'tag' => 'this is tag', // unspecified tag
 'doneurl2' => 'http://yandex.ru/', // address after subscription confirmation
 'activation' => true, // requiring subscription confirmation
 'utm[utm_medium]' => 'cpc',
 'utm[utm_source]' => 'direct',
 'utm[utm_campaign]' => 'My_Campaign',
 'utm[utm_content]' => '<span style="font-weight: 400;" data-mce-style="font-weight: 400;">content_123</span>',
 'utm[utm_term]' => 'my_label',
 );
 // Forming the hash to the transmitted data.
 $send_data['hash'] = GetHash($send_data, $user_rs);
 // Calling the AddLeadToGroup function in the API and decoding the received data.
 $resp = json_decode(Send('http://username.influencersoft.com/api/AddLeadToGroup', $send_data));
 // Checking the service response.
 if(!CheckHash($resp, $user_rs)){
 echo "Error! The response hash is not valid!";
 exit;
 }
 if($resp->error_code == 0)
 echo " User added to group {$send_data['rid[0]']}. Service response: {$resp->error_code}";
 else
 echo "Error code:{$resp->error_code} - description: {$resp->error_text}";

// ===========  Functions of sending, receiving and processing a response ============

//Sending the query to the API service
 function Send($url, $data){
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

## Articles

[*The Script Notification When Unsubscribing **f**rom Your Newsletters*](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters-)

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status* ](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*UpdateSubscriberData. Editing the Existing Contact’s Data* ](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data-)

[*DeleteSubscribe. Unsubscribe a Contact from a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)

[*GetLeadGroups. Receiving a List of All Contact Groups* ](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups)

[*GetAllGroups. Receiving a List of all Contact Groups from the Account* ](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)

## Rate Article