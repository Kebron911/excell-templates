# The Script Notification When Unsubscribing from Your Newsletters 

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050443012-The-Script-Notification-When-Unsubscribing-from-Your-Newsletters
**Article ID:** 360050443012
**Updated:** 2021-05-24T00:24:31Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / The Script Notification When Unsubscribing From Your Newsletters

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

You can activate the system notification when a customer unsubscribes from newsletters.

Enter the address of your script, which our service will send notifications to, in the API settings in the **URL ****f****or ****N****otifications** field.

![](https://help.justclick.io/wp-content/uploads/2017/11/1576226988449.png)

Notifications are sent in the URL-encoded POST format as follows:

array (
'name' => contact name
'email' => contact email
'phone' => contact telephone number
'city' => contact city
'id_group' => contact group number
'ip' => subscriber IP
'status' => 0, //there will always be 0 because the subscriber status becomes "Unsubscribed" in this group
)
Notifications come only after the unsubscription. Only the group administrator can delete a subscriber from the group.

## Articles

[*GetLeadGroupStatuses. Receiving a List of All Contact Groups with a Subscription Status* ](https://help.influencersoft.com/hc/en-us/articles/360050901691-GetLeadGroupStatuses-Receiving-a-List-of-All-Contact-Groups-with-a-Subscription-Status-)

[*Add**LeadToGroup. Adding a Contact to a Group* ](https://help.influencersoft.com/hc/en-us/articles/360050435412-AddLeadToGroup-Adding-a-Contact-to-a-Group-)

[*UpdateSubscriberData. Editing the Existing Contact’s Data* ](https://help.influencersoft.com/hc/en-us/articles/360050501952-UpdateSubscriberData-Editing-the-Existing-Contact-s-Data-)

[*DeleteSubscribe. Unsubscribe a Contact from a Group*](https://help.influencersoft.com/hc/en-us/articles/360050901211-DeleteSubscribe-Unsubscribe-a-Contact-from-a-Group#h_01ERBVS716041YECZ54V5CVQBC)

[*GetLeadGroups. Receiving a List of All Contact Groups* ](https://help.influencersoft.com/hc/en-us/articles/360050902811-GetLeadGroups-Receiving-a-List-of-All-Contact-Groups#h_01ERBWFG77GR94HVJQBJNHS8AT)

[*GetAllGroups. Receiving a List of all Contact Groups from the Account* ](https://help.influencersoft.com/hc/en-us/articles/360050436312-GetAllGroups-Receiving-a-List-of-All-Contact-Groups-from-the-Account)

## Rate Article