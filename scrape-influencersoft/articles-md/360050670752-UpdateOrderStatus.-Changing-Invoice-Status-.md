# UpdateOrderStatus. Changing Invoice Status 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status
**Article ID:** 360050670752
**Updated:** 2021-05-24T00:10:46Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / UpdateOrderStatus. Changing Invoice Status

#### Content

[1 Parameters Transferred in the Query ](#h_01ER9GWNCM5V19DGEZ7PDKXG3E)

[2 How Does It Work? ](#h_01ER9GX7B97JDHH3GXKCM4R8X8)

[3 Example of Updating the Order in PHP ](#h_01ER9GQ68AB6Y1BK5HGSZNVPGT)

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration via Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).

You can change the status of the order, transfer the date of sending, the date of payment, and the tracking number.

The query is sent by the POST method in the URL-encode format to the address:  http://username.influencersoft.com/api/**UpdateOrderStatus**.

## Parameters Transferred in the Query

-
*bill_id *is the order number*;*

-
*status *is the order status* (sent* means the order was sent by mail, paid means payment for the order was made*, return *means the customer returned the order,* cancel *means the order was canceled*);*

-
*date i*s the time of sending the order by mail or its payment, in seconds from January 1, 1970, the so-called UNIX times tamp (required for *sent** *and* paid *statuses);

-
*rpo** *is the tracking number of the postal item (required for the *sent status*)*.*

## How Does It Work?

You transfer the order number, its status, and additional data. The system changes the order status and add the given parameters to the order information.

Your system will receive the result of the function in JSON format in response. For more details, see the** **[API Service Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-).

## Example of Updating the Order in PHP

In the example, we change the status of the 100000 order to “sent.” The tracking code is 10000000000000. The sending date is March 3, 2013 00:00, which corresponds to timestamp 1362254400.

GetHash Function forms the hash to the transferred data.

CheckHash Function checks the hash to the service response.

<?php
  // Login to the InfluencerSoft system
  $user_rs['user_id'] = 'username';
  // The key for forming a hash. See API section (the link in the bottom right corner of the personal account)
  $user_rs['user_rps_key'] = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

  // Forming the data array for transferring to the API
  $send_data = array(
    'bill_id' => '100000',
    'status' => 'sent',
    'date' => '1362254400',
    'rpo' => '10000000000000',
   );
  // Forming the hash to the transmitted data
  $send_data['hash'] = GetHash($send_data, $user_rs);
  // Calling the UpdateOrderStatus API function and decoding the received data
  $resp = json_decode(Send('https://username.influencersoft.com/api/UpdateOrderStatus', $send_data));
  // Checking the service response
  if(!CheckHash($resp, $user_rs)){
    echo "Error! The response hash is not true!";
    exit;
  }
  if($resp->error_code == 0)
    echo "The order status is updated: {$resp->error_code}";
  else
    echo "Error code:{$resp->error_code} - description: {$resp->error_text}";

// =========== Functions of sending, receiving and processing a response ============

  // Sending the query to the API service
  function Send($url, $data){
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
?>

## Articles

*[GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts](https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts)*

*[CreateOrder. Creating a New Invoice](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice-) *

*[DeleteOrder. Deleting/Hiding an Invoice](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice-) *

*[GetOrders. Getting a List of All Invoices](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices-) *

*[GetOrderDetails. Getting Detailed Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050558052-GetOrderDetails-Getting-Detailed-Invoice-Information) *

*[GetOrderInfo. Getting Invoice Information](https://help.influencersoft.com/hc/en-us/articles/360050664772-GetOrderInfo-Getting-Invoice-Information-) *

## Read Article