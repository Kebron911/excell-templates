# Getting a list of all coupons (discounts) – getcoupons

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360058447251-Getting-a-list-of-all-coupons-discounts-getcoupons
**Article ID:** 360058447251
**Updated:** 2021-03-12T21:15:30Z

---

[API 2.0](https://help.influencersoft.com/hc/en-us/sections/360012725711-API-2-0) / Getting a list of all coupons (discounts) – getcoupons

Content

- [1 How does it work?](#h_01F0M4K6PBCSBBXEXDEMEXB3XT)

- [2 Parameters passed in the request](#h_01F0M4KJ870RCR04H0P92DT5YA)

- [3 Parameters received in response](#h_01F0M4KYD9JC1NTG54HDC89GNE)

## How does it work?

If you are not a developer, read [this article](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0-), it will make it much easier to use API 2.0.
You can get a list of all coupons (discounts) that are in your account. This will be useful for use with other methods.

The request is sent by the POST method in the URLencode format to the address: **https://username.influencersoft.com/api/getcoupons**, where **username** is the user’s login in the system and his 3rd level domain in the InfluencerSoft service.

In response to the request, your system will receive the function execution result in JSON format. For example, like this:

{
"error_code": 0,
"error_text": "OK",
"result": [
{
"id": 585,
"coupon": "coupon50proc"
},
{
"id": 586,
"coupon": "coupon90proc"
},
],
"hash": "019a22abe9024aae827d223ff3be2442"
}

In case of an error, the standard “[Service API Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)” will be returned.

## Parameters passed in the request

The only parameter for this method is rpsKey, which is the API key; the key for your account is in the “Integration and API” section, the link to the section is in the footer of your personal account or here /shops/setts/apisettings/

## Parameters received in response

You will get a result array with objects. Each object is one group. The following will be listed:

- id – discount coupon id – what we see in the address bar of the personal account when editing a coupon (discount);

- coupon – a discount coupon that a buyer enters to receive it.