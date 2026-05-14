# Getting a list of products – getgoods

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360057987312-Getting-a-list-of-products-getgoods
**Article ID:** 360057987312
**Updated:** 2021-03-12T21:12:24Z

---

[API 2.0 ](https://help.influencersoft.com/hc/en-us/sections/360012725711-API-2-0)/ Getting a list of products – getgoods

Content

- [1 How does it work?](#h_01F0M4D25ZMC50XS6T1VH3MDWH)

- [2 Parameters passed in the request](#h_01F0M4DGRXYC1G4Z1V0YH2B249)

- [3 Parameters received in response](#h_01F0M4DW4F0NVQ0JQEE128NGBF)

## How does it work?

If you are not a developer, read [this article](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0-), it will make it much easier to use API 2.0.
You can get a list of all the products that are in your account. This will be useful for use with other methods.

The request is sent by the POST method in the URLencode format to the address: **https://username.influencersoft.com/api/getgoods**, where **username** is the user’s login in the system and his third-level domain in the InfluencerSoft service.

In response to the request, your system will receive the function execution result in JSON format. For example, like this:

{
"error_code": 0,
"error_text": "OK",
"result": [
{
"id": 75696,
"good_name": "digital",
"good_title": "Digital product"
},
{
"id": 75791,
"good_name": "testdrive",
"good_title": "testdrive"
}
],
"hash": "019a22abe9024aae827d223ff3be2442"
}
In case of an error, the standard “[Service API Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)” will be returned.

## Parameters passed in the request

The only parameter for this method is rpsKey, which is the API key; the key for your account is in the “Integration and API” section, the link to the section is in the footer of your personal account or here /shops/setts/apisettings/

## Parameters received in response

You will get a result array with objects. Each object is one group. The following will be listed:

- id – product id – what we see in the address bar of the personal account when editing a product;

- good_name – what we see in the address bar on the invoice page (order page);

- good_title – the name of the product that the buyer sees (commercial name).