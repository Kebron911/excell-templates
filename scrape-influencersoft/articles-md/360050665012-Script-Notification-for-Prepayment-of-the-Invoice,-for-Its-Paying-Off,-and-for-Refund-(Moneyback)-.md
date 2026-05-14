# Script Notification for Prepayment of the Invoice, for Its Paying Off, and for Refund (Moneyback) 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050665012-Script-Notification-for-Prepayment-of-the-Invoice-for-Its-Paying-Off-and-for-Refund-Moneyback
**Article ID:** 360050665012
**Updated:** 2021-05-24T00:39:58Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / Script Notification for Prepayment of the Invoice, for Its Paying Off, and for Refund (Moneyback)

#### Content

[1 Paying Off Notification ](#h_01ER97D5P6SS7P767QEATC387S)

[2 Example in PHP](#h_01ER97DH55Q81258J1TQWA03TP)

[3 Prepayment Notification ](#h_01ER97DWWZ3NC6ACD7MAD9Z2F1)

[4 MoneyBack Notification](#h_01ER97E7MFD1TRYFMNV54Z2S7C)

## Paying Off Notification

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration via Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).

You can activate the system notification for when a customer pays for the order.

To do this, enter your script address into the “URL for API notifications about the **paid invoice**” field when editing the product. Our service will send notifications there.

Notifications are sent to this address after the order has been paid. When it is created, notifications are sent to the address indicated in the “URL for API notifications about the **created invoice**” field [(](https://help.influencersoft.com/hc/en-us/articles/360051022491-Creating-and-Canceling-the-Invoice-Script-Notification-)[more info](https://help.influencersoft.com/hc/en-us/articles/360051022491-Creating-and-Canceling-the-Invoice-Script-Notification-)[)](https://help.influencersoft.com/hc/en-us/articles/360051022491-Creating-and-Canceling-the-Invoice-Script-Notification-).

You can enter the same script in both fields. But at the same time, add a parameter specifying what notification is this.

For example, like this:

-
the “URL for API notifications about the created invoice” field: http://mysite.io/script?a=make

-
the “URL for API notifications about the paid invoice” field: http://mysite.ru/script?a=paid

Or determine the made order by the absence in the received data of the value with the [‘paid’] key.

Notifications are sent in the URL-encoded POST format as follows:

array(
'id' => order number
'first_name' => customer’s name
'last_name' => customer’s last name
'middle_name' => customer’s middle name
'email' => customer’s email
'phone' => customer’s telephone number
'city' => the city of the delivery
'country' => the country of the delivery
'address' => address of the delivery
'region' => region of the delivery
'postalcode' => postal code
'created' => the order creation time
'paid' => the order paying-off time
'last_payment_sum' => amount of the last payment (if the bill is paid in one payment, then it is equal to the amount of the bill)
'comment' => comment on the order
'tag' => tag
'coupon' => used coupon
'type' => type
'payway' => method of payment
'domain' => order domain
'is_recurrent' => Is the bill recurrent? (1 - yes, 0 - no),
'utm' => array (
   'medium' => channel utm-parameter
   'source' => source utm-parameter
   'campaign' => campaign utm-parameter
   'content' => advertisement utm-parameter
   'term' => key utm-parameter
   ),
'items' => array( goods array
array(
'id' => character identifier
'title' => product name
'sum' => actual product cost (including up-selling or discount)
'price' => product price from settings
'pincode' => pin-code sent in the letter after the payment
'partners' => array (
   0 => array (
       'partner_lvl' => affiliate level (the first level)
       'partner_id' => partner’s identifier
       'partner_name' => partner’s login
       'partner_fee' => the amount of partner’s charges
       ),
   1 => array (
       'partner_lvl' => affiliate level (the second level)
       'partner_id' => partner’s identifier
       'partner_name' => partner’s login
       'partner_fee' =>  the amount of partner’s charges
       ),
   ),
),
array(
'id' => character identifier
'title' => product name
'sum' => actual product cost (including up-selling or discount)
'price' => product price from settings
'pincode' => pin-code sent in the letter after the payment
'partners' => array (
   0 => array (
       'partner_lvl' => affiliate level (the first level)
       'partner_id' => partner’s identifier
       'partner_name' => partner’s login
       'partner_fee' => the amount of partner’s charges
       ),
   1 => array (
       'partner_lvl' => affiliate level (the second level)
       'partner_id' => partner’s identifier
       'partner_name' => partner’s login
       'partner_fee' =>  the amount of partner’s charges
       ),
   ),
),
...
)
'hash' => md5 (order number + customer’s mail + time of paying-off the order + secret key)
)

## Example in PHP:

$hash = md5($_REQUEST['id'].$_REQUEST['email'].$_REQUEST['paid'].$setts['user_rps_key']);
Where, the “secret key” for forming a hash is a line that can be found in the “API” section (right-side of the InfluencerSoft personal cabinet) ⇒  “API key”.

[![](https://help.justclick.io/wp-content/uploads/2016/11/1576223758657.png)](https://help.justclick.io/wp-content/uploads/2016/11/1576223758657.png)

[![](https://help.justclick.io/wp-content/uploads/2016/11/1576223862146.png)](https://help.justclick.io/wp-content/uploads/2016/11/1576223862146.png)

Where, the “secret key” for forming a hash is a line that can be found in the “API” section (right-side of the InfluencerSoft personal cabinet) ⇒ “API key”.

For example, if you use PHP for development, the transferred data at once goes into the $ _query system array.

$ _query[‘items’][0] [‘sum’] will be equal to the cost of the first item in the order.

## Prepayment Notification

You can activate the system notification for when a customer pays for the order in advance.

To do this, enter your script address into the “URL for API notifications about the **pre-paid invoice**” field when editing the product. Our service will send notifications there.

Notifications are sent in the URL-encoded POST format as follows:

array(

'id' => order number
'first_name' => customer’s name
'last_name' => customer’s last name
'middle_name' => customer’s middle name
'email' => customer’s email
'phone' => customer’s telephone number
'city' => the city of the delivery
'country' => the country of the delivery
'region' => region of the delivery
'postalcode' => postal code
'created' => the order creation time
'prepayment_sum' => prepayment sum
'tag' => tag
'coupon' => used coupon
'domain' => order domain
'link' => link to the order payment page
'is_recurrent' => Is the bill recurrent? (1 - yes, 0 - no),
'utm' => array (
   'medium' => channel utm-parameter
   'source' => source utm-parameter
   'campaign' => campaign utm-parameter
   'content' => advertisement utm-parameter
   'term' => key utm-parameter
   ),
'items' => array( goods array
array(
'id' => character identifier
'title' => product name
'sum' => actual product cost (including up-selling or discount)
'price' => product price from settings
'pincode' => pin-code sent in the letter after the payment
'partners' => array (
   0 => array (
       'partner_lvl' => affiliate level (the first level)
       'partner_id' => partner’s identifier
       'partner_name' => partner’s login
       'partner_fee' => the amount of partner’s charges
       ),
   1 => array (
       'partner_lvl' => affiliate level (the second level)
       'partner_id' => partner’s identifier
       'partner_name' => partner’s login
       'partner_fee' =>  the amount of partner’s charges
              ),
   ),
),
...
)
'hash' => md5 (order number + customer’s mail + time of paying-off the order + secret key)
)

## MoneyBack Notification

You can **activate the system notification for when a customer wants full refund**.

Enter your script address into the “URL for API notifications about the Moneyback” field.

Notifications are sent in the URL-encoded POST format as follows:

array(

'status' => 'moneyback'
'id' => order number
'first_name' => customer’s name
'last_name' => customer’s last name
'middle_name' => customer’s middle name
'email' => customer’s email
'phone' => customer’s telephone number
'city' => the city of the delivery
'country' => the country of the delivery
'region' => region of the delivery
'postalcode' => postal code
'created' => the order creation time
'comment' => comment on the order
'is_recurrent' => Is the bill recurrent? (1 - yes, 0 - no),
'utm' => array (
   'medium' => channel utm-parameter
   'source' => source utm-parameter
   'campaign' => campaign utm-parameter
   'content' => advertisement utm-parameter
   'term' => key utm-parameter
   ),
'items' => array( goods array
array(
'id' => character identifier
'title' => product name
'sum' => actual product cost (including up-selling or discount)
'price' => product price from settings
       ),
   ),
array(
'id' => character identifier
'title' => product name
'sum' => actual product cost (including up-selling or discount)
'price' => product price from settings
),
...
)
'hash' => md5 (order number + customer’s mail + time of paying-off the order + secret key)
)

## Articles

*[GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts. ](https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts)*

*[CreateOrder. Creating a New Invoice ](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice-)*

*[UpdateOrderStatus. Changing Invoice Status ](https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status-)*

*[DeleteOrder. Deleting/Hiding an Invoice ](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice-)*

*[GetOrders. Getting a List of All Invoices ](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices-)*

*[GetOrderDetails. Getting Detailed Invoice Information ](https://help.influencersoft.com/hc/en-us/articles/360050558052-GetOrderDetails-Getting-Detailed-Invoice-Information)*

## Rate Article