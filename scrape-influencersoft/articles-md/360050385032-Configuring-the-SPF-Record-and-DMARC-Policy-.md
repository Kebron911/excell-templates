# Configuring the SPF Record and DMARC Policy 

**Section:** Campaigns
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050385032-Configuring-the-SPF-Record-and-DMARC-Policy
**Article ID:** 360050385032
**Updated:** 2021-12-16T14:56:27Z

---

/[Campaigns ](https://help.influencersoft.com/hc/en-us/sections/360009245371-Campaigns)/ Configuring the SPF record and DMARC policy

**Content **

-
[1 General information ](#h_01EREFKQH8VB6KCG3P09G7863P)

[1.1 What is it? ](#h_01EREFKX3FTKGPHZGD68SYEM90)

- [1.2 Can you please be more precise? ](#h_01EREFM25GZ2T2XNFC8CTWXE6F)

- [1.3 Pros of using SPF and DMARC ](#h_01EREFM8RN6DSG19761GQKW4SQ)

-
[1.4 To whom is the setting available?](#h_01EREFMGZ78VCPDVY7JY9MKZ1W)

-
[2 How to connect? ](#h_01EREFMRVPZ4PC5YE8TDYQMHGF)

[2.1 Create mail and write to support ](#h_01EREFN0VQ51CT760F0347PKBP)

- [2.2 Get a response and add one entry ](#h_01EREFN93PXZYYVGD990P0MYGF)

- [2.3 Report that the records are ready ](#h_01EREFNHZ55X7H4CYMQ23WYF56)

- [2.4 Wait for the answer and finish setting ](#h_01EREFNSJNWX613KR8Z1WC5J15)

- [3 What should I do next? ](#h_01EREFP4G5BAE37EM77BARF73J)

## General information

### What is it?

In simple terms, **SPF **is one of the types of records in your domain’s DNS. The entry implements a mechanism for authenticating the message, by checking the sender’s server. The setting will be effective when DKIM is configured and will allow you to configure the DMARC, which is described below.

**DMARC **is an entire specification created by a group of organizations. Like other records and signatures, it is designed to reduce the amount of spam and phishing emails. Thanks to other records, DMARC helps to exclude the situation when the email comes from a familiar sender, but in fact from a foreign or fraudulent server.

### Can you please be more precise?

Of course. **Sender Policy Framework** (SPF) is an extension for the protocol for sending email through SMTP. SPF is defined in RFC 7208. With SPF, you can check whether the sender’s domain is tampered with. SPF allows the domain owner, in the TXT record corresponding to the domain name, to specify the list of servers that have the right to send email messages with return addresses in this domain. Mail transfer agents that receive email messages can request SPF information using a simple DNS query, thereby verifying the sender’s server.

**Domain-based Message Authentication, Reporting and Conformance** (DMARC) is a technical specification created by a group of organizations designed to reduce the number of spam and phishing emails based on the identification of the sender’s email domains based on the rules and attributes specified on the recipient’s mail server. That is, the mail server itself decides whether a message is good or bad,say, based on the policies above, and acts according to the DMARC records.

For **SPF**, a special entry is registered in the DNS of the **X **domain, which lists the servers that have the right to send return-path messages to the **X **domain. Thus, to send messages from your servers, a person must have access to the DNS domain of X, to register the necessary servers.

**DMARC **checks the correspondence of the sender’s domain (FROM), as well as the return-path domain and DKIM. To pass the DMARC test, you must at least match the sender’s domain (FROM) and (return-path). That is, you must correctly configure the SPF.

### Pros of using SPF and DMARC

The record data is a logical continuation of the vector you took when setting up the DKIM signature. Together with it, they provide deeper protection from forgery of your emails.

In addition to the advantages that DKIM provides, with these entries, you can choose what to do with the emails when there is a mismatch: deliver to inbox, deliver to spam, or reject at the reception stage. Thus, DMARC helps to eliminate the situation when the email comes from a familiar sender, but from someone else’s server that you have not authorized.

### To whom is the setting available?

All letters have SPF, but the entry is common for all users of the service. This allows you to get a good basic level of protection against forgery of the email.

### How to connect?

Never send email from an additional domain if you have already configured SPF for another domain.
If this happens to you, contact our support team.

### Create mail and write to support

Create a new email address on your domain. This should be a separate address that will not be used for mailing. It will receive messages about non-existent subscribers (addresses entered erroneously, abandoned boxes, etc.). To configure and operate the system we need access to this box: IMAP server, login, and password.

Write to us. The easiest way to do this is directly from your private email.

In the subject field, indicate: “*Configure SPF and *DMARC “. In the message itself, you must specify:

-
Your domain for which you want to set up records

-
Mail address for SPF (the address must be on the domain from the previous item)

-
IMAP server

In our case it will look like this:

*“Please configure SPF and DMARC for the domain -” my_domain “*

*domain: my_site.com*

*e-mail for SPF: *[*spf@my_site.com*](mailto:spf@my_site.com)

*IMAP: imap.my_hoster.com*

 ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360072265712/blobid0.png)

### Get a response and add one entry

Records are configured primarily on the side of our service, but some actions should be performed by you. And so, having received your message with the initial data, our programmers will make the necessary settings. In the response message we will ask you to make some settings on your hosting, for example:

“*Write the following entry in the DNS editor on your hosting for the domain my_site.com*:

*your.site in TXT “v = spf1 a mx ~ all”*

After that you need to go to your hosting and add this record.

On the hosting, it will look something like the screenshot below. The control panels of different hosting sites may differ, so, find the similar fields as in the screenshot below to enter the information.

 ![blobid1.png](https://help.influencersoft.com/hc/article_attachments/360072265732/blobid1.png)

### Report that the records are ready

After you make the settings described above, let us know by return email. We will activate the necessary settings from our side. And we will ask you to register one more final record in DNS.

### Wait for the answer and finish setting

After we activate the necessary settings for our part, we shall ask you to register one more final record in the DNS.

It will look something like this:

*The settings are almost complete. We did our part for everything that was **required**. **There is a **last entry** remaining**. In the DNS editor on your hosting for the domain my_site.com, write the following entry:*

*_dmarc.my_site.com IN TXT «v = DMARC1; p = reject; sp = reject; adkim = relaxed; aspf = relaxed »*

## What should I do next?

Connect “Postmaster Tools” from Gmail.

### Related Articles:

[Creating a G Suite account for your business mail ](https://help.influencersoft.com/hc/en-us/articles/360050848231-Creating-a-G-Suite-Account-for-Your-Business-Mail)

[Recommendations for maintaining mailings ](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings-)

[What should I do if my emails go into spam? ](https://help.influencersoft.com/hc/en-us/articles/360050848311-What-Should-I-Do-if-My-Emails-Go-Into-Spam-)

[Set up digital signatures ](https://help.influencersoft.com/hc/en-us/articles/360050385192-Set-up-Digital-Signatures-)

[Creating corporate mail on your domain ](https://help.influencersoft.com/hc/en-us/articles/360050848251-Creating-Corporate-Mail-on-Your-Domain-)

[Configuring the Digital Signature of DKIM ](https://help.influencersoft.com/hc/en-us/articles/360050848191-Configuring-the-Digital-Signature-of-DKIM-)