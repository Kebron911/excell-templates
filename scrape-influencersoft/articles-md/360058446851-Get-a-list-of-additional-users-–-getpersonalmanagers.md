# Get a list of additional users – getpersonalmanagers

**Section:** API 2.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360058446851-Get-a-list-of-additional-users-getpersonalmanagers
**Article ID:** 360058446851
**Updated:** 2021-03-12T21:05:23Z

---

[API 2.0](https://help.influencersoft.com/hc/en-us/sections/360012725711-API-2-0) / Get a list of additional users – getpersonalmanagers

Content

- [1 How does it work?](#h_01F0M3Z8M1CJC1YVMZWE9PZQ18)

- [2 Parameters passed in the request](#h_01F0M3ZR52Q4415B07C7BYBYSZ)

- [3 Parameters received in response](#h_01F0M402G8300YXEH63CVEJVMZ)

## How does it work

If you are not a developer, read [this article](https://help.influencersoft.com/hc/en-us/articles/360058281031-What-if-I-m-not-a-programmer-API-2-0-), it will make it much easier to use API 2.0.
You can get a list of all additional users that are in your account. This will be useful for use with other methods. For example, to appoint a person responsible for an account when generating an order using API.

The request is sent by the POST method in the URLencode format to the address: **https://username.influencersoft.com/api/getpersonalmanagers**, where **username** is the user’s login in the system and his 3rd level domain in the InfluencerSoft service.

In response to the request, your system will receive the function execution result in JSON format. For example, like this:

{
    "error_code": 0,
    "error_text": "OK",
    "result": [
        {
            "id": 71257,
            "manager_id": 71257,
            "manager_name": "Greg"
        },
        {
            "id": 72398,
            "manager_id": 72398,
            "manager_name": "001"
        },
        {
            "id": 71668,
            "manager_id": 71668,
            "manager_name": "Quickpost"
        }
    ],
    "hash": "019a22abe9556aae827d223ff3be2442"
}
In case of an error, the standard “[Service API Responses](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)” will be returned.

## Parameters passed in the request

The only parameter for this method is rpsKey, which is the API key; the key for your account is in the “Integration and API” section, the link to the section is in the footer of your personal account or here /shops/setts/apisettings/

## Parameters received in response

You will get a result array with objects. Each object is one group. The following will be listed:

- id – id of the additional user;

- manager_id – matches the previous value;

- manager_name – name and surname of the employee.