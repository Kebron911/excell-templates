# Configuring FBL for Your Domains 

**Section:** Campaigns
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050384772-Configuring-FBL-for-Your-Domains
**Article ID:** 360050384772
**Updated:** 2020-11-21T21:42:34Z

---

/[Campaigns ](https://help.influencersoft.com/hc/en-us/sections/360009245371-Campaigns)/ Configuring FBL for Your Domains

**Content **

-
[1 Why is this necessary?](#Why%20is%20this%20necessary?)

- [2 How to setup? ](#How%20to%20setup?)

- [3 FBL Settings for Google ](#FBL%20Settings%20for%20Google)

- [4 Configuring the IMAP email protocol on Gmail.com ](#Configuring%20the%20IMAP%20email%20protocol%20on%20Gmail.com)

- [5 What to report in support? ](#What%20to%20report%20in%20support?)

## Why is this necessary?

Setting up FBL for your domain is necessary to automatically unsubscribe those individuals who press the SPAM button in your emails.

This setting is performed after the [DKIM signature](https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM-) is configured.

If you did not, then by default, the FBL settings of the InfluencerSoft service will be used and your subscribers will unsubscribe from your mailing list without your participation.

## How to setup?

*If you created an email for FBL settings on your hosting, then the setup algorithm depends on your hosting. ****The IMAP protocol**** settings can be accessed either in the control panel or after contacting the hosting support.*

If you decide to use FBL for an existing email to which you receive any emails, all your emails will be automatically deleted after processing by our service. Therefore, to configure the FBL, **it is necessary to create a new box.**

## FBL Settings for Google

-
Sign up for [https://postmaster.google.com](https://postmaster.google.com/)

-
Enter the domain and verify ownership of it by adding a DNS TXT or DNS CNAME record.

## Configuring the IMAP email protocol on Gmail.com

-
Login to your mail at mail.google.com, which you created specifically for FBL settings. Click the **Settings button ==> Settings**.

-
Make sure that you have “**IMAP enabled**” in the line “**IMAP ****access**:.” If this is not the case, please tick this box and click “Save Changes.”

The address of the IMAP server for mail from Google is ***imap.gmail.com*** – it will need to be reported in support. In the case of Gmail, the login for email coincides with the email itself.

## What to report in support?

To complete the settings, please send us the following information in support of [support@influencersoft.com](mailto:support@influencersoft.com):

-
Address of your email **IMAP** server

-
Log in for email, which you did for FBL. **Please note**: Often it coincides with email, but it can differ

-
Password for access to email [fbl@your_site.com](mailto:fbl@your_site.com)

## Articles:

[*Creating a G Suite account for your business mail* ](https://help.influencersoft.com/hc/en-us/articles/360050848231-Creating-a-G-Suite-Account-for-Your-Business-Mail)

[*Recommendations for maintaining mailings* ](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings-)

[*What should I do if my emails go into spam?* ](https://help.influencersoft.com/hc/en-us/articles/360050848311-What-Should-I-Do-if-My-Emails-Go-Into-Spam-)

[*Set up digital signatures* ](https://help.influencersoft.com/hc/en-us/articles/360050385192-Set-up-Digital-Signatures-)

[*Creating corporate mail on your domain* ](https://help.influencersoft.com/hc/en-us/articles/360050848251-Creating-Corporate-Mail-on-Your-Domain-)

[*Configuring the Digital Signature of DKIM*](https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM-)