# Getting a list of groups (subscriptions) – getalllists

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360057987072-Getting-a-list-of-groups-subscriptions-getalllists
**Article ID:** 360057987072
**Updated:** 2021-03-12T21:08:55Z

---

[API 2.0](https://help.influencersoft.com/hc/en-us/sections/360012725711-API-2-0) / Getting a list of groups (subscriptions) – getalllists

Content

- [1 How does it work?](#h_01F0M46678DQK02FQX10Y4FBWD)

- [2 Parameters passed in the request](#h_01F0M46HVHPRC6RCCH89DSE7KW)

- [3 Parameters received in response](#h_01F0M46Y0YD8PSKD5AEFC3Y9J6)

## How does it work?

If you are not a developer, read [this article](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0-), it will make it much easier to use API 2.0.
You can get a list of all subscription groups that are in your account. This will be useful for use with other methods.

The request is sent by the POST method in the URLencode format to the address: **https://username.influencersoft.com/api/getalllists**, where **username** is the user’s login in the system and his 3rd level domain in the InfluencerSoft service.

In response to the request, your system will receive the function execution result in JSON format. For example, like this:

{
    "error_code": 0,
    "error_text": "OK",
    "result": [
        {
            "id": 2086840,
            "rass_id": 2086840,
            "rass_name": "1605189997.0025174394",
            "rass_title": "#27950"
        },
        {
            "id": 2086838,
            "rass_id": 2086838,
            "rass_name": "1605188141.0707471155",
            "rass_title": "#27952"
        },
        {
            "id": 2086839,
            "rass_id": 2086839,
            "rass_name": "1605188160.9622104559",
            "rass_title": "#27957"
        }
    ],
    "hash": "019a22abe9024aae827d223ff3be2442"
}
In case of an error, the standard “[Service API Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)” will be returned.

## Parameters passed in the request

The only parameter for this method is rpsKey, which is the API key; the key for your account is in the “Integration and API” section, the link to the section is in the footer of your personal account or here /shops/setts/apisettings/

## Parameters received in response

You will get a result array with objects. Each object is one group. The following will be listed:

- id – group id – what we see in the address bar of the personal account when editing a group;

- rass_id – matches the previous value;

- rass_name – api id of the group, most often used in other API methods (when working with contacts, for example);

- rass_title – the name of the group, as it is named in the personal account (in the methods API is not needed, but it can be useful for general understanding).