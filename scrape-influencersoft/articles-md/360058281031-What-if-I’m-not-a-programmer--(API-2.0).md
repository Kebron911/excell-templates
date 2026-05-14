# What if I’m not a programmer? (API 2.0)

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0
**Article ID:** 360058281031
**Updated:** 2025-03-11T23:20:48Z

---

Content

- [1 What if I’m not a programmer?](#h_01F0F5F1T1EYJSQR085JM1T73Y)

-
[2 How to read articles about API 2.0?](#h_01F0F5FXH0JSVGGK7TW3M6B7TD)

[2.1 The address](#h_01F0F5G6TZBTAF1QRKTB2HK0H7)

- [2.2 Parameter names and meanings](#h_01F0F5GP4EPFFS13SSTK1B0466)

-
[3 From another service – to InfluencerSoft (example)](#h_01F0F5HSM1ZT3N3NE2QSY0VVGN)

[3.1 What will we do first of all?](#h_01F0F5J7Z86G3VKA7D68964P9A)

- [3.2 Where will we transfer the data?](#h_01F0F5JQEB6RV3M2FW1QGNFR7S)

- [3.3 What data should I transfer?](#h_01F0F5K5EQFR6JQ5NHX2ADY0XA)

- [4 From InfluencerSoft to another service](#h_01F0F5MDC3369WT4BXXFWYMXX4)

## What if I’m not a programmer?

Now you do not need to write a code (or look for someone who will do it) – everything is configured in your personal account and differs from the mailing list or page creation settings only in details.

In this article we will look at two examples: how to transfer data to InfluencerSoft and how to transfer data from InfluencerSoft.

Key benefits of API 2.0:

- more features than in API 1.0 (for example, it supports working with additional contact fields, can transfer social media profiles);

- setting has become simpler and more convenient (the participation of a programmer is not required or is minimal)

##

## How to read articles about API 2.0?

### The address

At the beginning of the articles there is this (or similar) phrase: “The request is sent by the POST method in the URLencode format to the address: ***https://username.influencersoft.com/api/createorder***.” From the link we need:

- link (in bold);

- method – in the example above it is “POST” (sometimes “GET”).

### Parameter names and meanings

There are only two terms: the parameter name and its value. For example, it is written: “*customer_email – email of the contact to which to issue an invoice.*” This means that the customer’s mail should only be called *customer_email* – this is the name of the parameter. But the parameter value is a regular email address (for each customer it will have its own).

## From another service – to InfluencerSoft (example)

In this part of the article, we talk about the settings not inside InfluencerSoft, but about the ones to look for in other services. However, for clarity, we give examples from our system. Visually, the settings in other services can be very different, to the point that you still need a programmer.

### What will we do first of all?

We determine what we want to transfer to InfluencerSoft. Do we need to create an order, a contact or something else? We make sure that both services (InfluencerSoft and the other) can do this. To do this, go to the Knowledge Base of both services. For InfluencerSoft, this is the current section – API 2.0.

Then we search the title of the article. For example, we want the order to be created in one system and paid through InfluencerSoft. This means we need an article on creating an order. It is called “Order creation”.

### Where will we transfer the data?

Open the article and look for the phrase “The request is sent by the POST method in the URLencode format to the address: https://username.influencersoft.com/api/createorder, where username is the user’s login in the system and his third-level domain in the InfluencerSoft service. ” This link is where and how to send the request. If we did it in InfluencerSoft (and you need to do it in a third-party service), then it would look like this: [1] – indicated the type of request, [2] – indicated the address, indicating the login of your account.

![mceclip4.png](https://help.influencersoft.com/hc/article_attachments/360088914831)

### What data should I transfer?

The articles have the heading “Parameters passed in the request”. The required and optional parameters will be indicated. Mandatory are those without which InfluencerSoft will not accept the request (or rather, reject it).

Your api key will always be required, others can be added as well. The parameter name for the API key is “rpsKey” (case as in the example).
The value of the parameter is already your key – that very long combination of letters and numbers that you can copy by clicking on the words “Integrations and API” in the footer of your personal account.

[![](https://help.justclick.io/wp-content/uploads/2021/12/2020-12-27_10-45-06-1024x190.png)](https://help.justclick.io/wp-content/uploads/2021/12/2020-12-27_10-45-06.png)

This is how we would configure it in InfluencerSoft. In another service, it may look different, but the essence is exactly the same: [1] – parameter name as in the screenshot below, [2] – your key (each account has its own).

![mceclip3.png](https://help.influencersoft.com/hc/article_attachments/360088914651)

Now we add other parameters you need (the order is not important), from those described in the article. For our example, at least the following will be appropriate:

- email of the contact;

- name;

- telephone;

- product (s) to be in the order;

- order status (because you can create a new order awaiting payment and a paid invoice too).

We are looking for the name of these parameters and that is exactly what we indicate.

![mceclip2.png](https://help.influencersoft.com/hc/article_attachments/360088852132)

Parameter names are marked with [1], they should be like in the example.
Parameter values ​​in block [2] can be different. In the screenshot above, “variables” are indicated for the contact’s email, name and phone number.

Instead of variables, the system will substitute the desired value. The variables in the example are variables in InfluencerSoft. In other services, the variables may differ (if you write the same, it will not work).

[3] is the id of the products to be included in the invoice. The IDs are listed in the link on the InfluencerSoft invoice page. We clarify such points in each article so that it is convenient for you to work.

[![](https://help.justclick.io/wp-content/uploads/2021/12/2020-12-27_11-37-42.png)](https://help.justclick.io/wp-content/uploads/2021/12/2020-12-27_11-37-42.png)

[4] is the account status. What it should be is also indicated in the corresponding article (Expected, Paid, Cancel or MoneyBack).

Everything is ready!)

## From InfluencerSoft to another service

In this part of the article, we tell you “how to enter data” in your InfluencerSoft account. The parameter names will depend on the other service. That is, you will need to name the parameters so that this other service understands them.

You can write classic code in your PhpStorm, but this article is for “non-programmers”.

The principle of transfer to other systems is exactly the same as we described above, with the only difference that you will need to find out the address and parameter names from the documentation of another service.

In other words:

- You will find out what another service can receive.

- Create a process in InfluencerSoft (more convenient through Funnels), add the “POST / GET request” block to the process and then make all the settings in it.

- Choose the POST / GET format (as indicated in the documentation of the third-party service).

- Specify the address where the request is to be sent (the same ordinary Internet link).

- Add the necessary parameter names (see again in the documentation of the third-party service).

- Add the required values ​​for these parameters. If we are talking about email, phone, and similar values ​​individual for each lead, then select the corresponding variable (instead of it InfluencerSoft will substitute the data). If we are talking about any static data (like an API key, but this time a key from a third-party system), then register it manually.

![mceclip0.png](https://help.influencersoft.com/hc/article_attachments/360088851992)

Then take a look at the Zapier service, the integration with which is also described in our [Knowledge Base](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-).