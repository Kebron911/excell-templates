# The Script Notification When Subscribing for Your Newsletters 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050437792-The-Script-Notification-When-Subscribing-for-Your-Newsletters
**Article ID:** 360050437792
**Updated:** 2021-05-24T00:27:26Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / The Script Notification When Subscribing for Your Newsletters

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

You can activate the system notification for when a customer subscribes to newsletters.

Enter the address of your script in the API settings in the **URL ****f****or API Notifications** field. This is where our service will send notifications to.

Notifications are sent in the URL-encoded POST format as follows:

array (
'name' => contact name
'email' => contact email
'phone' => contact telephone number
'city' => city of contact residence
'id_group' => contact group number
'ip' => subscriber IP
'status' => status (2 - subscription, 1- subscription activation)
'utm' => array (
'medium' => channel utm-parameter
'source' => source utm-parameter
'campaign' => campaign utm-parameter
'content' => advertisement utm-parameter
'term' => key utm-parameter),
)
Notifications come after the subscription and activation. The received data differs only in “status” parameter. It is “2” after the subscription and “1” after the activation.

## Articles

[*The Script Notification When Unsubscribing **f**rom Your Newsletters* ](https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters-)

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status* ](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*AddLeadToGroup. Adding a Contact to a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050435412-AddLeadToGroup-Adding-a-Contact-to-a-Group-)

[*UpdateSubscriberData. Editing the Existing Contact’s Data* ](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data-)

[*DeleteSubscribe. Unsubscribe a Contact from a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group)

[*GetLeadGroups. Receiving a List of All Contact Groups* ](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups#h_01ERBWFG77GR94HVJQBJNHS8AT)

## Rate Article