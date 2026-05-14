# Configuring the Digital Signature of DKIM

**Section:** Campaigns
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM
**Article ID:** 360050848191
**Updated:** 2025-02-27T17:49:20Z

---

/[Campaigns](https://help.influencersoft.com/hc/en-us/sections/360009245371-Campaigns) / Configuring the Digital Signature of DKIM

**Content **

-
[1 General information](#General%20information)

[1.1 What is a DKIM signature? ](#What%20is%20a%20DKIM%20signature?)

-
[1.2 Can you please be more precise?](#h_01EQPDN8H7GT5YR550A0KC53DA)

- [1.3 Pros of using DKIM ](#h_01EQPDPF0JN901HM25KM1WTBXS)

- [1.4 To whom is the setting available? ](#h_01EQPDPSYSBHN6D5PQC0A8191Y)

-
[2 How to connect? ](#h_01EQPDQ4WHFET4TQ2J52M4A0VF)

[2.1 Create a domain mail ](#h_01EQPDQHXRKG15754NKTNDQCTE)

- [2.2 Contact Support ](#h_01EQPDQX6GCYD9Z2APWACHHFGB)

- [2.3 Get a response and add one entry ](#h_01EQPDR8MRAMBDY7KMK67FZVMQ)

- [2.4 Check the entry and report that everything is read ](#h_01EQPDRJ5QXCQ5Q1MSXMSA7X8N)

- [3 How to verify your DKIM signature? ](#h_01EQPDRY1Q99RRZ1T3GX4ZXNTZ)

- [4 What should I do next? ](#h_01EQPDS9DQJ9E4QDKW85M9B363)

## General information

### What is a DKIM signature?

DKIM (Domain Keys Identified Mail) is a digital signature used by email services to identify and classify legitimate email. The presence of a signature says that the sender is a verified and approved person. Such a signature directly affects the delivery of emails to subscribers.

To put it simply, DKIM is one way to make sure that the email is not forged and has been sent by the actual owner of the mailing address.

### Can you please be more precise?

Sure! The pair generates an open-private key. The private key is placed on the server for sending mail, the public key is registered in the DNS. When sending a message, it is said that it will be signing the domain **X**. Next, some unique fields (recipient, subject, date, text) are taken from the message and a digital signature is generated using the private key. To verify a signature, you need to obtain a public key from the DNS for domain **X**, decrypt the signature, and verify that the signature and content of the message match.

Thus, for DKIM to work on domain **X**, a person must have access to the DNS of domain **X**, as well as to the mail server to accommodate the keys.

### Pros of using DKIM

-
You increase your delivery-rate by several percentage points. When a message is signed using DKIM, the mail service allocates for itself such a sender and in due course its reputation is formed. Messages from a signer with a good reputation will pass a less thorough check by the recipient’s filters and the attitude to the emails will be more supportive. Of course, this is not a solution if you do not follow the basic recommendations.

-
You have a spam rating, independent of the spam rating of the mailing list service. This is the first step to ensure that other authors of mailings cannot even indirectly affect the delivery of your emails.

-
You get the first stage of personal protection from scammers and competitors who try to forge their spam or phishing mail under your emails, which worsen your spam rating this way.

### To whom is the setting available?

All emails sent through the service are signed with one digital signature. This allows you to get a good basic level of protection against forgery and meet the technical requirements of the largest mail services. Projects that do not focus on email newsletters or have a small database can easily manage the regular DKIM Service. For larger projects, it is better to use your DKIM.

## How to connect?

### Create a domain mail

To connect DKIM, your email, which will be listed in your InfluencerSoft account as the sender’s email, must be on your domain.

For example [info@my_site.com](mailto:info@my_site.com), where my_site.com is your domain.

To create such an email, you can use the services provided by the email service giants: Yahoo, Google, etc. A similar service can be found with your host.

*To increase the loyalty of mail services and the correct operation of the DKIM signature in the email name, it is not recommended to use dashes, dots, **u**nderscores,** and names like “no-reply**.”*

The best options are:

-
[mail@yourdomain.com](mailto:mail@yourdomain.com)

-
[help@yourdomain.com](mailto:help@yourdomain.com)

-
[support@yourdomain.com](mailto:support@yourdomain.com)

-
[info@yourdomain.com](mailto:info@yourdomain.com)

-
firstname [username@yourdomain.com](mailto:username@yourdomain.com)

We also strongly recommend you to reply with this email to your subscribers. If you receive an email in response to your newsletter, be sure to respond to it. This will show the mailing services that the newsletter is live and you are in dialogue with your subscribers, and not just sending them emails.

### Contact Support

Write to us. The easiest way to do this is directly from your private email.

 ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360072490111)

If you only need to configure digital signatures, then please send us **ALL the sender's e-mail addresses** that enabled in the section Campaigns >> Settings >> Mailing Settings >> Sender contact information

In the subject field, specify: “Configure the DKIM signature.” In the message itself, you must specify:

-
Your login

-
**All the emails listed in your Sender contact information that need to configure DKIM**

-
The domain of each email

In our case it will look like this:

“Please configure DKIM signature for the account -” your_login “

email: [info@my_site.com](mailto:info@my_site.com)

domain: my_site.com

email: [info@domain.com](mailto:info@domain.com)

domain: domain.com

### Get a response and add one entry

The digital signature is configured both on the side of our service and on your side. Having received your message with the initial data, our programmers will make the necessary settings. In the response message we will ask you to make some settings on your hosting, for example:

*“Write the following entry in the DNS editor on your host** for the domain my_site.com:*

1

 |

<span style="font-weight: 400;"><em> default._domainkey IN TXT "v = DKIM1; k = rsa; s = email; p = MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUpF + 8E9liTlxc9ICYRQpyciJsWlJ2moGqI / 5q3ysSAiFGIACbJm9UD9VQPWpsGp0Vfts7DwJFc3AuNGqTNyjemJDBL0mHABzi1sMGs6RIB6drmSwzu8jpWtUw5k6NMw + 6U74EOFAS / KtC0P7GYgUIqaBhmjh + Vdv7wIDAQAB" </em></span>

 |

After that you need to go to your host and add this record.

On the host, it will look something like the screenshot below. The control panels of different hosting sites may differ, so, find the similar fields to write the code and details as in the screenshot below.

 ![blobid2.png](https://help.influencersoft.com/hc/article_attachments/360072265572)

Note that in the Value field, we insert this text without quotes.

1

 |

"v=DKIM1; k=rsa; s=email; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUpF+8E9liTlxc9ICYRQpyciJsWlJ2moGqI/5q3ysSAiFGIACbJm9UD9VQPWpsGp0Vfts7DwJFc3AuNGqTNyjemJDBL0mHABzi1sMGs6RIB6drmSwzu8jpWtUw5k6NMw+6U74EOFAS/KtC0P7GYgUIqaBhmjh+Vdv7wIDAQAB"

 |

This text is given as an example, you insert your unique text, which our programmers will generate for you.

### Check the entry and report that everything is read

After you write down the necessary data on your hosting, you need to make a check by clicking the link [https://toolbox.googleapps.com/apps/dig/#TXT](https://toolbox.googleapps.com/apps/dig/#TXT/)

*Pay attention that changes on hosting occur most often within 24 hours – the exact time depends on your host**.*

In the “Name” field, enter default._domainkey.my_site.com and click anywhere on the page. Below is the answer to your host, which should be the entry you made.

 ![blobid4.png](https://help.influencersoft.com/hc/article_attachments/360072265592)

After you make the settings described above, let us know by return email. We will include the DKIM-signature for your emails.

The settings will be completed.

## How to verify your DKIM signature?

To verify that your DKIM signature is working, you just need to send an email from your account with the email of the sender for whom the DKIM signature was configured.

In the email that you receive from your mailing list, you will see a similar picture in the information about the sender.

It can be displayed differently in different mail services, but there it should be written that the signature type is “DKIM,” and the email is sent from your domain.

If you look at the properties of the email, you will see that your domain is also registered there, as in the screenshot below:

![blobid5.png](https://help.influencersoft.com/hc/article_attachments/360072265612)

After such a check, you can be sure that the DKIM signature for your email is configured correctly.

## What should I do next?

After configuring the DKIM signature, you need to configure FBL for your domain, otherwise the subscribers who press the SPAM button in your messages will not be automatically deleted from your database. We will talk about this in the following article in more detail.

Unfortunately, setting up DKIM does not cancel other mail system requirements, so we recommend that you read [the general rules of mailing](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings-) on the InfluencerSoft service.

*Attention: As the DKIM signature setting is done manually by our programmers for each user, it takes some time, depending on the load of the programmers. Typically, DKIM setup takes from 1** to **2 days to a week.*

### Articles:

[*Creating a G Suite account for your business mail* ](https://help.influencersoft.com/hc/en-us/articles/360050848231-Creating-a-G-Suite-Account-for-Your-Business-Mail)

[*Recommendations for **maintaining** mailings* ](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings-)

[*What should I do if my emails go into spam?* ](https://help.influencersoft.com/hc/en-us/articles/360050848311-What-Should-I-Do-if-My-Emails-Go-Into-Spam-)

[*Set up digital signatures* ](https://help.influencersoft.com/hc/en-us/articles/360050385192-Set-up-Digital-Signatures-)

[*Creating corporate mail on your domain*](https://help.influencersoft.com/hc/en-us/articles/360050848251-Creating-Corporate-Mail-on-Your-Domain-)

[*Configuring the SPF record and DMARC policy* ](https://help.influencersoft.com/hc/en-us/articles/360050385032-Configuring-the-SPF-Record-and-DMARC-Policy-)