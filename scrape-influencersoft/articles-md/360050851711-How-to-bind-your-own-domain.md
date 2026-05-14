# How to bind your own domain

**Section:** Website
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050851711-How-to-bind-your-own-domain
**Article ID:** 360050851711
**Updated:** 2025-08-29T15:49:03Z

---

/[Website ](https://help.influencersoft.com/hc/en-us/sections/360009245331-Website)/ How to bind your own domain/subdomain

##

**Content **

- [1 Why do I need to bind an additional domain? ](#h_01EREE2DJX9ZM46QC9HKFYQTZT)

- [2 Delegating (setting) a domain ](#h_01EREE2K6KDPY82XAKZVSP1RCS)

-
[3 Working with a delegated (configured) domain in InfluencerSoft ](#h_01EREE2VF3VFCBB08655DWGFZ8)

[3.1 How to make the store pages open on their own domain? ](#h_01EREE33TVV025T31YNGHWFXTK)

- [3.2 How do I place pages on an alternate domain? ](#h_01EREE3ATJ10SW23ZHANB25X0B)

- [3.3 DNS Editor for Second-level Linked Domains ](#h_01EREE3JMV02960VXS5TQS5CMG)

## Why do I need to bind an additional domain?

When registering with InfluencerSoft, you will receive a domain named “yourlogin.influencersoft.com” for all pages of the store and mini-site. However, there are often situations where it is required to you must:

-
Observe the “corporate spirit” and make sure that the pages of the store are in the address space of your existing external site

-
Hide the login that appears in the default domain from InfluencerSoft

-
Bind the domain to the store in order to make it easier to approve in some payment systems

-
Bind a personal domain in order to undergo moderation on advertising platforms

-
Add a separate domain for the alternative store

In all the listed situations, the additional domain to your InfluencerSoft account is a solution. And then visitors will see a nice address like shop.yoursite.com or mydomain.com.

Domain registrars like GoDaddy.com let you choose a domain name and register it for a fee (usually ranging from $3 to $70).

***Note:** if** you already have a site that is **located **at **mydomain**.com, it cannot be bound – otherwise the existing site will be lost! Therefore, you need to choose either a free domain of the 2nd level mydomain2.com or a new unused subdomain (domain of the third level), of the form: shop.mydomain.com.*

Ensure that the Name Servers are generated automatically from our system (Name Servers used in the video are based on the domain being added).

**Also, our system sees name servers ***.cloudflare.com for your domain because influencersoft.com has them. But physically, these records are not in the Cloudflare DNS editor. You can find your Domain DNS Zone in your InfluencerSoft account once it's completely delegated and shows activate. Kindly go to Websites>Settings>click the domain to add records. **

## Delegating (setting) a domain

You can add a new domain to your domain list at any time. To do this, go to the Website – Settings and click on the “Add domain” button:.

 ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360072496571)

Enter the domain name and click “Next”..” For example, if you chose shop.moyblog.com, then this is exactly what you need to enter in the verification field. If you chose your-domain.com, then enter this particular domain.

 ![blobid1.png](https://help.influencersoft.com/hc/article_attachments/360072496591)

The data of your domain will display, specifying the status of your domain as follows:

![](https://help.influencersoft.com/hc/article_attachments/40734641787412) - After buying a domain or any changes in its settings.

![](https://help.influencersoft.com/hc/article_attachments/40734641791124) - If your domain was pointed to another host.

If there is no specified error that shows read above this photo below, then you can click the "Get DNS settings for your domain" to generate the name servers that you need to add on your domain:

![](https://help.influencersoft.com/hc/article_attachments/40734641791764)

After that, the service will show you a message with instructions on what entries you need to make to your domain settings. Please note that the jobs and leah name servers below are only sample, you must copy the one that display above you clicked the "Get DNS settings for your domain".

![](https://help.influencersoft.com/hc/article_attachments/40734641794452)

If your domain does NOT have a site (a free second-level domain like mydomain.com), then to edit the domain settings, go to the DNS control panel at your domain registrar (the domain registrar is the service in which you purchased the domain itself).

To enter the DNS control panel, instructions on the websites of the registrars themselves will help. If you cannot do it yourself – contact the registrar support for help.

If there is a site on your domain  (and you want to bind a subdomain of the form shop.mydomain.com), then to edit the domain settings, go to the DNS control panel on your host (the host is the service where the site is located on the main domain).

Depending on the host, this section may have different names: “DNS Management”,” “DNS Editor”,” “DNS Master”,” “DNS Server”,” or “DNS Zones”..”

*Note: **I**f you have several sites and several domains hosted **with that host**, select the domain that you want to edit.*

If you cannot find the necessary section or you are afraid of breaking something, consult your host’s support team by copying the message text with the settings that the service offered you.

Some hosts prohibit the creation of subdomains by the user. To create a subdomain in this case, also contact the host’s support team to create a domain according to this instruction on their part.

After completing the domain setup at the registrar (host), after a while it will be possible to activate the domain.

 ![blobid3.png](https://help.influencersoft.com/hc/article_attachments/360072496631)

You can check in 2-4 hours after changing the settings for the domain and then at the same interval. The maximum waiting time is 48 hours. This process is not up to us.

After the records are updated on all network devices and the domain is successfully activated, you will see its active status in your account. Here is a video tutorial on [how you can build your domain in InfluencerSoft](https://admin.influencersoft.com/lms/course/1025/module/2247/lesson/5132/).

 ![blobid4.png](https://help.influencersoft.com/hc/article_attachments/360072496651)

## Working with a delegated (configured) domain in InfluencerSoft

### How to make the store pages open on their own domain?

A domain that starts at www. (for example, www.domain.com) cannot be selected as the main one for the store. To make it possible to choose your domain as the main one, please connect the domain without "www".

To change the primary domain for the store, you must:

-
Go to the “Website -> Settings” section and click on the “Domains” button.

-
Scroll down the page and find the table with domains.

-
Set a marker in front of the desired domain in the “Store” column.

When changing the main domain, you need to regenerate the subscription forms, order forms, and order buttons, and replace them on your websites (pages).

### How do I place pages on an alternate domain?

After the new domain has been attached to the personal cabinet, the question “**how to attach it to the pages of the mini-site**” arises. You need to attach it to the pages of the mini-site.

To do this, go to the “Website –>> Pages” section. Here, by default, when creating an account, “Main Site” is added, the pages of which open on a standard domain with the form “yourlogin.influencersoft.com”.

Two possible options are as follows:

**Option 1.**

If the **“Main Site”** has already created pages that now need **to be configured on a new attached domain**, then you need to edit it. that is, you need to click on the “Set Up” button opposite the name “Main site”..”

 ![blobid5.png](https://help.influencersoft.com/hc/article_attachments/360072272452)

**Option 2.**

If the pages already created must remain on the previous domains and **on the new domain you need to create other pages** – you need to create a new site by clicking on the “Create” button.

 ![blobid6.png](https://help.influencersoft.com/hc/article_attachments/360072496671)

**Further actions are identical for both options:**

-
On the “main parameters settings” tab in the “Domains” field, click on the empty space and select the required domain from the drop-down list

-
Save changes

 ![blobid7.png](https://help.influencersoft.com/hc/article_attachments/360072496691)

### DNS Editor for Second-level Linked Domains

Go to the Website – Settings:

 ![blobid8.png](https://help.influencersoft.com/hc/article_attachments/360072272492)

The DNS Editor page opens when you click on the name of the second-level domain when the status is marked “Active..” You can add /  or change domain records in the Editor. Most often this is necessary if you need to configure domain mail on a connected domain using services such as G Suite.

The first time you open the DNS Editor for a domain, you will see a data loading window. You need to wait until the data is updated (up to 2 minutes). Then you can already start adding the records you need.

Click on “Adding a record” to add a new record.

![blobid9.png](https://help.influencersoft.com/hc/article_attachments/360072272512)
Select the type of record you need, specify its value, and click on “Adding a record”.
Available record types:

-
A

-
AAAA

-
MX

-
TXT

-
CNAME

 ![blobid10.png](https://help.influencersoft.com/hc/article_attachments/360072496711)

By default, the record is added as Enabled.

If you need to temporarily disable the record, click on the switch button in the “Status” column to turn it gray. Pressing the button activates the record.

 ![blobid11.png](https://help.influencersoft.com/hc/article_attachments/360072496731)

Related Articles:

[How to block cookies on the site until the visitor agrees to their use ](https://help.influencersoft.com/hc/en-us/articles/360050388812-How-to-Block-Cookies-on-the-Site-Until-the-Visitor-Agrees-to-Their-Use-)

[Site settings ](https://help.influencersoft.com/hc/en-us/articles/360050389252-Site-Settings-)

[How to make a broadcast page for a webinar in 5 minutes ](https://help.influencersoft.com/hc/en-us/articles/360050851551-How-to-Make-a-Broadcast-Page-for-a-Webinar-in-5-Minutes-)

[Interactive blocks ](https://help.influencersoft.com/hc/en-us/articles/360050389092-Interactive-Blocks-)

[Pages ](https://help.influencersoft.com/hc/en-us/articles/360050389112-Pages-)

[File manager ](https://help.influencersoft.com/hc/en-us/articles/360050388792-File-Manager-)

[How to bind your own Sub-domain](https://help.influencersoft.com/hc/en-us/articles/360058485492)