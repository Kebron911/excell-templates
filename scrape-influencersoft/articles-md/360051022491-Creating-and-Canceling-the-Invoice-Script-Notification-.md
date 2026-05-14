# Creating and Canceling the Invoice Script Notification 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360051022491-Creating-and-Canceling-the-Invoice-Script-Notification
**Article ID:** 360051022491
**Updated:** 2021-05-23T23:43:29Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API)/Creating and Canceling the Invoice Script Notification

**Content **

[1 Creating the Invoice Script Notification ](#h_01ERA1X7T9F9W40KTJWXBW4PAQ)

[2 Cancelling the Order Script Notification ](#h_01ERA1XH9QCAM5524EFMXVJ1BF)

## Creating the Invoice Script Notification

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration via Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).

You can activate the system notification for when a customer makes the order.

To do this, enter your script address into the “URL for API notifications about the **created invoice**”** **field when editing the product. Our service will send notifications there.

Notifications are sent to this address after the order has been created. When paying for it, notifications are sent to the address indicated in the “URL for API notifications about the **paid invoice**” field ([more info](https://help.influencersoft.com/hc/en-us/articles/360050665012-Script-Notification-for-Prepayment-of-the-Invoice-for-Its-Paying-Off-and-for-Refund-Moneyback-)).

You can enter the same script in both fields. But at the same time, add a parameter specifying what notification is this.

For example, like this:

-
the “URL for API notifications about the created invoice” field: http://mysite.io/script?a=make

-
the “URL for API notifications about the paid invoice” field: http://mysite.io/script?a=paid

Or determine the made order by the absence in the received data of the value with the [‘paid’] key.

Notifications are sent in the URL-encoded POST format as follows:

array(
'status' => new order
'id' => order number
'first_name' => customer’s name
'last_name' => customer’s surname
'middle_name' => customer’s middle name
'email' => customer’s email
'phone' => customer’s telephone number
'city' => the city of the delivery
'country' => the country of the delivery
'address' => the address of the delivery
'region' => the region of the delivery
'postalcode' => postal code
'created' => the time of the order creation
'comment' => comment on the order
'tag' => tag
'kupon' => used coupon
'domain' => order domain
'link' => link to the order payment
'utm' => array (
'medium' => channel utm-parameter
'source' => source utm-parameter
'campaign' => campaign utm-parameter
'content' => advertisement utm-parameter
'term' => key utm-parameter
),
'items' => array( //goods array
array(
'id' => character identifier
'title' => product name
'sum' => actual cost (including up-selling or discount)
'price' => cost from the settings
),
array(
'id' => character identifier
'title' => product name
'sum' => actual cost (including up-selling or discount)
'price' => cost from the settings
),
...
)
'hash' => md5 (order number + customer’s email + time of the order creation + secret key)
)

Example in PHP

$hash = md5($_REQUEST['id'].$_REQUEST['email'].$_REQUEST['paid'].$setts['user_rps_key']);
Where, the “secret key” for forming a hash is a line that can be found in the “API” section (right-side of the InfluencerSoft personal cabinet) ⇒ “API key.”

[![](https://help.justclick.io/wp-content/uploads/2016/11/1576223758657.png)](https://help.justclick.io/wp-content/uploads/2016/11/1576223758657.png)

[![](https://help.justclick.io/wp-content/uploads/2016/11/1576223862146.png)](https://help.justclick.io/wp-content/uploads/2016/11/1576223862146.png)

For example, if you use PHP for development, the transferred data at once goes into the $ _query system array, i.e. $_query[‘items’][0] [‘sum’] will be equal to the cost of the first item in the order.

## Canceling the Order Script Notification

You can activate the system notification for when a customer cancels the order.

Enter your script address into the “URL for API notifications about the canceled invoice” field when editing the product.

Notifications are sent in the URL-encoded POST format as follows:

array(
'status' => 'cancel_order',
'id' => order number,
'first_name' => customer’s name,
'last_name' => customer’s surname,
'middle_name' => customer’s middle name,
'email' => customer’s email,
'phone' => customer’s telephone number,
'city' => the city of the delivery,
'country' => the country of the delivery,
'region' => the region of the delivery,
'postalcode' => postal code,
'created' => the time of the order creation,
'comment' => comment on the order,
'utm' => array (
'medium' => channel utm-parameter,
'source' => source utm-parameter,
'campaign' => campaign utm-parameter,
'content' => advertisement utm-parameter,
'term' => key utm-parameter
,
),
'items' => array( //goods array
array(
'id' => character identifier,
'title' => product name,
'sum' => actual cost (including up-selling or discount),
'price' => cost from the settings,
),
array(
'id' => character identifier,
'title' => product name,
'sum' => actual cost (including up-selling or discount),
'price' => cost from the settings,
),
...
)
'hash' => md5 (order number + customer’s email + time of the order creation + secret key),
)

##

## Articles

## [GetOrdersWithGoods. Getting a Maximally Detailed List of All Accounts](https://help.influencersoft.com/hc/en-us/articles/360051149651-GetOrdersWithGoods-Getting-a-Maximally-Detailed-List-of-All-Accounts)

[*CreateOrder. Creating a New Invoice* ](https://help.influencersoft.com/hc/en-us/articles/360050502452-CreateOrder-Creating-a-New-Invoice-)

[*UpdateOrderStatus. Changing Invoice Status* ](https://help.influencersoft.com/hc/en-us/articles/360050670752-UpdateOrderStatus-Changing-Invoice-Status-)

[*DeleteOrder. Deleting/Hiding an Invoice* ](https://help.influencersoft.com/hc/en-us/articles/360050556792-DeleteOrder-Deleting-Hiding-an-Invoice-)

[*GetOrders. Getting a List of All Invoices*](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices-)

[*GetOrderDetails. Getting Detailed Invoice Information* ](https://help.influencersoft.com/hc/en-us/articles/360051149571-GetOrders-Getting-a-List-of-All-Invoices-)

##