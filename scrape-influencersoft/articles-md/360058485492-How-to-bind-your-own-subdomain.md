# How to bind your own subdomain

**Section:** Website
**URL:** https://help.influencersoft.com/hc/en-us/articles/360058485492-How-to-bind-your-own-subdomain
**Article ID:** 360058485492
**Updated:** 2024-01-09T15:55:59Z

---

[Website](https://help.influencersoft.com/hc/en-us/sections/360009245331-Website)/ How to bind your own subdomain

There are instances where you already have your website built somewhere else e.g in WordPress and you do not want to recreate it in InfluencerSoft. In this case, creating a sub-domain may be a good idea for you to be able to build your landing pages within InfluencerSoft. It is important to recognize that when you move over your [domain to InfluencerSoft](https://help.influencersoft.com/hc/en-us/articles/360050851711-How-to-bind-your-own-domain-or-subdomain-), the hosting for that domain gets pointed to the InfluencerSoft server, so in the event you already have a website built on that domain, the website will no longer be reachable. In order to avoid this, it is best to create a sub-domain within your domain registrar and bind it to your InfluencerSoft account.

When binding your sub-domain, your second-level domain (e.g **example**.com) on your host will continue to work, and at the same time in InfluencerSoft you will have a personal third-level domain (e.g **hello**.example.com).

If you haven’t created your sub-domain yet, you can create one from your host. Note that the instructions on how to create a sub-domain varies per host. See the below instructions when creating a [sub-domain on GoDaddy](https://ph.godaddy.com/help/add-a-subdomain-4080).

- Log in to your GoDaddy Domain Control Center.

-
Select your domain name from the list to access the Domain Settings page.

-
Under Additional Settings, select Manage DNS.

-
Below the Records section, select Add.

-
Select A from the Type drop-down menu.

-
Complete the required fields:

-
Host: The host name, or prefix, for the subdomain. For example, enter blog to create a subdomain for blog.yoursite.com.

-
Points to: The IP address you are setting as the destination for the host. This is usually the IP address of a hosting account where the site for your subdomain lives.** Note: InfluencerSoft IP address is 176.9.85.146**

-
TTL: How long the server should cache information. The TTL is set to 1 hour by default.

      7. Select Save to save your record.

Please allow up to 48 hours for your DNS changes to take full effect globally.

For reference, you can visit the link: [https://ph.godaddy.com/help/add-a-subdomain-4080](https://ph.godaddy.com/help/add-a-subdomain-4080)

Once your sub-domain is setup, you can start binding it in InfluencerSoft by following the below instructions:

     1. Go to website settings and click on add domain:

 ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360090481312)

     2. Add the 3rd level domain/sub-domain as shown below:

 ![blobid1.png](https://help.influencersoft.com/hc/article_attachments/360090458991)

     3. Add the CNAME record in domain settings:

![blobid2.png](https://help.influencersoft.com/hc/article_attachments/360090481352)

 And "Check" settings (it may take 24-48 hours to update records on the server).

Below are some resources on how to create a subdomain with the following registrars:

[Hostgator](https://www.hostgator.com/help/article/what-is-a-subdomain-name-how-do-i-create-and-delete-one)

[Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/9776/2237/how-to-create-a-subdomain-for-my-domain/)

[Bluehost](https://www.bluehost.com/help/article/subdomains)