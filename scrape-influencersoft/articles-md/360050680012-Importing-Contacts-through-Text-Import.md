# Importing Contacts through Text Import

**Section:** Contacts
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050680012-Importing-Contacts-through-Text-Import
**Article ID:** 360050680012
**Updated:** 2021-02-19T07:57:00Z

---

/ [Contacts](https://help.influencersoft.com/hc/en-us/sections/360009245391-Contacts) / Import Contacts

**Content**

-
[Import contacts](#h_01ERA54880KG1J2ZQFKJGDPHAW)

- [List to import the leads ](#h_01ERA54FD30WC56Z7G7RASYCJ6)

- [List to transfer the leads from one group to another ](#h_01ERA55560VHHC6YP6BH9424BT)

- [Automatic emails ](#h_01ERA55CJ8WBBSVV4249ATM7C2)

## Import contacts

This form allows you to import subscribers from other mailing services. You may also use it to transfer the leads from one group to another.

Prepare the list for transfer first.

## List to import the leads

Go to the section “Contacts” – “Leads” – “Import” – “Text Import”.

- In the “Where to import” field, specify the group to which the import will be made.

- In the window “Import data” paste the data in text format

Make sure the inserted data is correct, take into account the order of the data and the separator:

**![](https://help.justclick.io/wp-content/uploads/2020/12/2020-12-26_22-51-41.png)**

Make sure that the inserted data is correct:

- The first line should contain a list of the imported fields

- The lines that follow should contain the data

-
Divider is ;

- In case the date is the value for the additional field, then it should be typed as follows:
YYYY-MM-DD

If the imported contacts are from an export file that was generated from InfluencerSoft, then inserting only the e-mail address is enough, you do not need to fill in other fields. The contact with the specified e-mail address will be added to the new group, and the contact information will be added automatically. See example below:

email; test@gmail.com;

The “skip automatic emails” field allows you to specify whether subscribers will receive email series in their entirety after import or not. You can add subscribers to a new group by skipping the first 2 emails, then subscribers will start receiving an automatic series immediately from the third message.

## List to transfer the leads from one group to another

To do this, you should follow the steps above, but preparing the list may be easier. Refer to the [Subscribers section](https://help.influencersoft.com/hc/en-us/articles/360050850591-Subscribers-) on how to export the subscriber lists.

Filter stores the information for 5 minutes. If you do not import within the time frame, filter the required leads and import them by clicking the cogwheel. Otherwise, all leads in the database will be imported.

Search and select the required subscribers and export them in a plain text format. Next is to add the first line – it should contain the field names that will be imported.

## Automatic emails

The field defines whether the subscribers will receive all [automatic emails](https://help.influencersoft.com/hc/en-us/articles/360050848451-Email-Series-) after the import.

Run import and see progress

Click Import once all data is defined.

The bottom part of the window displays the progress bar.

In addition to the methods described in this article for adding a database of addresses to your account, you can integrate with other services through [Zapier](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-) and [API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API).

## Helpful information

### What is the difference between importing followers and importing contacts?

**A contact** is data about a potential customer or subscriber that was entered manually through import or when placing an order or filling out a subscription form. For non-activated contacts, it is not possible to send broadcasts to them. You can only send sms if the contact has a mobile number.

However, if the contact was uploaded by importing subscribers with the ability to send email through an external SMTP server, then you can send an email to them without going through our servers and the activation process. Work with letters, texts, settings takes place in your InfluencerSoft account, and mailing is carried out via a [third-party mail server](https://help.influencersoft.com/hc/en-us/articles/360050848471-How-to-setup-your-business-Email-Mailing-Settings-#h_01ERAVFCYYAGNMAJX0HXYR3J8J).

**A subscriber** is a contact that is in the “Subscribed” or “Activated” status, that is, the most useful contact. For subscribers, you can send instant, automatic emails and sms through the InfluencerSoft servers. Read more about contact statuses below:

### In what status will the contact be added to the new group?

If this is a contact that you already have in the database, it will be added in the same status as at the time of import.

If this is a new contact that you do not have in your database, it will be added in the “Awaiting activation” status. If you import contacts with sending an activation email, then those who activate the subscription will receive an active “Subscribed” status, after which they will be able to receive your mailings.

If this is a new contact and during import you select “Skip sending activation email when importing. It will be possible to send emails to them only through a third-party SMTP server”, then the contact will receive the status “Can only be sent through an external SMTP server” (blue checkmark).

### Option 1

If you need to add contacts/subscribers from one group to another within one InfluencerSoft account, then use the “gear” in the “Subscribers” section or through the “Leads” section Filter the necessary data and add them to another or new group.у.

[![](https://help.justclick.io/wp-content/uploads/2020/12/2020-12-26_22-54-33.png)](https://help.justclick.io/wp-content/uploads/2020/12/2020-12-26_22-54-33.png)

The filter stores information about the change for 5 minutes. If you did not import (add to the group) in five minutes, please filter the necessary contacts again and repeat the procedure, otherwise all contacts in your database will be added to the group.

### Option 2

You can export filtered data or contacts / subscribers by group via export by clicking on the gear. Then load this data via import in text or via CSV file.

To export (upload) data, click on the gear and select the appropriate format

[![](https://help.justclick.io/wp-content/uploads/2020/12/2020-12-26_22-55-44.png)](https://help.justclick.io/wp-content/uploads/2020/12/2020-12-26_22-55-44.png)

## Articles:

*[Lead Card](https://help.influencersoft.com/hc/en-us/articles/360050399232-Lead-Card) *

*[Lead Card in Call Tasks](https://help.influencersoft.com/hc/en-us/articles/360050398252-Lead-Card-in-Call-Tasks) *

*[How to Import Leads From a CSV File](https://help.influencersoft.com/hc/en-us/articles/360050401032) *

*[Configuring Invisible reCAPTCHA](https://help.influencersoft.com/hc/en-us/articles/360050862271-Configuring-Invisible-reCAPTCHA) *

*[Contact lists](https://help.influencersoft.com/hc/en-us/articles/360050401352-Contact-Lists) *

*[Add and Edit Contact List](https://help.influencersoft.com/hc/en-us/articles/360050400112-Add-and-Edit-Contact-List) *