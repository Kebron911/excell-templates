# Set up Digital Signatures 

**Section:** Campaigns
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050385192-Set-up-Digital-Signatures
**Article ID:** 360050385192
**Updated:** 2020-11-29T17:41:40Z

---

/[Campaigns ](https://help.influencersoft.com/hc/en-us/sections/360009245371-Campaigns)/ Set up digital signatures

**Content **

- [1 Why is this necessary? ](#h_01ERAGXRHTNFXPZJVW9B59KFV0)

-
[2 What sequence? ](#h_01ERAGY0V1SC3HKGNCW4Z0KB5J)

[2.1 Your domain ](#h_01ERAGY9RHDQDPC3H0683BW1Z7)

- [2.2 Corporate Mail ](#h_01ERAGYHEH10DPEVRATSVAZSX4)

- [2.3 Dedicated IP ](#h_01ERAGYR6SX5V7SB0EVBFE0SH3)

- [2.4 DKIM signature ](#h_01ERAGZ2H1Q4QJA7ARY5PQM38W)

- [2.5 SPF and DMARC ](#h_01ERAGZAF8ZFSRYMTE4RM880YE)

- [2.6 Connecting Monitoring Tools ](#h_01ERAGZKCGSGBJ9MF9SF0HZDRH)

- [2.7 FBL for your domains ](#h_01ERAGZXBZMHXBZ0NDQKVRC7BV)

## Why is this necessary?

So, you have decided to take the delivery of emails under **your**** control** and want to set up digital signatures for your domains? We have articles where we provide information on how to do this.

In the same article, we decided to give a general look at the technology and describe the sequence of settings, without going into detail. Also, we noted everything that is needed in the process, except for the signatures themselves.

The essence of the technology is simple: you as the owner of the domain from which the mailings are conducted can register in the DNS of your domain a policy that decides what to do with emails that are recognized as counterfeit. Implementation may seem intricate, but the picture from Gmail.com perfectly visualizes the essence.

## What sequence?

### Your domain

Of course, you will need your domain. We only note that we recommend using the services of trusted registrars. For example, [GoDaddy](https://godaddy.com/).

You can bind the purchased domain to us or not. You can find variants and binding possibilities [here](https://help.influencersoft.com/hc/en-us/articles/360050851711-How-to-bind-your-own-domain-or-subdomain-).

### Corporate Mail

Undoubtedly, you will need your own corporate mail and not only one. Often this service is provided by your host, but you can also use the free services from the mailing giants. More detailed instructions are [in this article](https://help.influencersoft.com/hc/en-us/articles/360050848251-Creating-Corporate-Mail-on-Your-Domain-).

### Dedicated IP

If everything described above is already there, then contact support@influencersoft.com.

 ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360072265972/blobid0.png)

You need to send a request to connect a dedicated server to an IP with a good reputation. Example query:

*Subject**: “Providing a dedicated IP for mailings”*

*Message: “My tariff is Guru. My login: login Configure, please, the dedicated IP for mailings.”*

Dedicated IP is connected in the period from 1 to 5 working days.

### DKIM signature

DKIM is one way to make sure that the letter is not forged and has been sent by the actual owner of the mailing address. Its configuration is the first step in setting up digital signatures of the email. This step is not mandatory, but necessary for you to be able to get information about what happens to your emails first-hand, from the mailing services your subscribers and customers use. You can configure the DKIM signature simultaneously with the configuration of the dedicated IP. That is, you can send two requests at once. Detailed instructions for configuring the DKIM signature can be found [in this article.](https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM-)

DKIM is connected in a period of 1 to 3 working days.

### SPF and DMARC

Thanks to the SPF (Sender Policy Framework), you can check whether the sender’s domain has been tampered with.

DMARC is a specification designed to reduce the number of spam and phishing emails based on the identification of the sender’s email domains by other characteristics that do not consider DKIM or do not fully consider the SPF.

Altogether, these settings give the best results. A detailed description and instructions for setting up these records can be found [here](https://help.influencersoft.com/hc/en-us/articles/360050385032-Configuring-the-SPF-Record-and-DMARC-Policy-).

SPF and DMARC are connected in a period of 1 to 3 working days.

### Connecting Monitoring Tools

Connect the “Post Office” from Postmaster in Gmail.com to track the delivery, opening-rate, and spamming-rate of your emails using Gmail services.

### FBL for your domains

FBL is the standard for issuing information about complaints, about spam from an email service provider to the sender of emails. Mail.ru, Yandex, and Google are the only mail services that use this technology. For more information about this setting, see [this article](https://help.influencersoft.com/hc/en-us/articles/360050384772-Configuring-FBL-for-Your-Domains-).

### Articles:

[*Creating a G Suite account for your business mail* ](https://help.influencersoft.com/hc/en-us/articles/360050848231-Creating-a-G-Suite-Account-for-Your-Business-Mail)

[*Recommendations for **maintaining** mailings* ](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings-)

[*What should I do if my emails go into spam?* ](https://help.influencersoft.com/hc/en-us/articles/360050848311-What-Should-I-Do-if-My-Emails-Go-Into-Spam-)

[*Creating corporate mail on your domain* ](https://help.influencersoft.com/hc/en-us/articles/360050848251-Creating-Corporate-Mail-on-Your-Domain-)

[*Configuring the Digital Signature of DKIM* ](https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM-)

[*Configuring the SPF record and DMARC policy* ](https://help.influencersoft.com/hc/en-us/articles/360050385032-Configuring-the-SPF-Record-and-DMARC-Policy-)