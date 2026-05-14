# UpdateSubscriberData. Editing the Existing Contact’s Data 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data
**Article ID:** 360050501952
**Updated:** 2021-10-17T16:00:26Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) /UpdateSubscriberData. Editing the Existing Contact’s Data

**Content **

[1 Parameters Transferred in the Query ](#h_01ERA04ZS5GEVS1VQ4CWN1767S)

[2 How Does It Work? ](#h_01ERA057PB8V7M15VBCAXHS8YN)

[3 Example of Changing the Contact Data in PHP ](#h_01ERA05G9V59NY9YFQNG869KNY)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration via Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).

You can change the existing contact data by requesting a query to the API service using software methods. You can change the name of the contact, telephone number, and city of residence.

You can change each contact data once using the function.

The query is sent by the POST method in the URL encode format to the address: http://username.influencersoft.com/api/UpdateSubscriberData where **username **is the login of the user to the system, as well as their domain of the third level in the InfluencerSoft service.

## Parameters Transferred in the Query

-
**lead_email** is the email of the existing contact (required);

-
**lead_name** is the new name of the contact after the query is made (optional);

-
**lead_phone** is the telephone number that will be replaced by the one already specified (not necessarily);

-
**lead_city** is the city of contact (optional).

The lead_email field is the only required field. The other fields are up to you. If the field is turned down, the user data in this field remain unchanged.

## How Does It Work?

Transfer the contact’s email and new data to the UpdateSubscriberData API function to replace the old ones.

The system will receive the result of the function in response. The response is coded in JSON format. For more details, see the [**API Service Responses**](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-).

## Example of Changing the Contact Data in PHP

In the example, we change the contact data with the email **test@test.****ru**. Login to the system is **username**.

Function GetHash forms the hash to the transferred data.

Function CheckHash checks the hash of the service response.

 // Login to the InfluencerSoft system.
 $user_rs['user_id'] = 'username';
 // The key for forming a hash. See API section (the link in the bottom right corner of the personal account).
 $user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

 // Forming the data array for transferring to the API.
 $send_data = array(
    'lead_email' => 'tester@influencersoft.com', // the existing subscriber name.
    'lead_name' => 'John', // the replacement name.
    'lead_phone' => '+18000000000', // new telephone number.
    'lead_city' => 'Los Angeles', // city of residence.
    'lead_tags' => 'tag1,tag2,tag3', // subscriber tags.
    );

// Forming the hash to the transmitted data.
$send_data['hash'] = GetHash($send_data, $user_rs);

// Calling the UpdateSubscriberData function in the API and decoding the received data.
$resp = json_decode(Send('https://username.influencersoft/api/UpdateSubscriberData', $send_data));

// Checking the service response.
if(!CheckHash($resp, $user_rs)){
    echo "Error! The response hash is not valid!"; print_r($resp);
    exit;
}

if($resp->error_code == 0)
    echo "The subscriber data are updated: {$resp->error_text}";
else
    echo "Error code:{$resp->error_code} - description: {$resp->error_text}";

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
        return true; // the hash is correct.
    else
        return false; // the hash is not correct.
}

## Articles

[*The Script Notification When Unsubscribing **f**rom Your Newsletters* ](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters-)

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status* ](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*AddLeadToGroup. Adding a Contact to a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050435412-AddLeadToGroup-Adding-a-Contact-to-a-Group-)

[*DeleteSubscribe. Unsubscribe a Contact from a Group.* ](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)

[*GetLeadGroups. Receiving a List of All Contact Groups.*](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups)

[*GetAllGroups. Receiving a List of all Contact Groups from the Account* ](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)

## Rate Article