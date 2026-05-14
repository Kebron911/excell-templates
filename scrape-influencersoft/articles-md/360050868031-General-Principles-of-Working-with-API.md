# General Principles of Working with API

**Section:** API 1.0
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050868031-General-Principles-of-Working-with-API
**Article ID:** 360050868031
**Updated:** 2021-05-24T02:12:21Z

---

/[API](https://help.influencersoft.com/hc/en-us/sections/360009245591-API) / General Principles of Working with API

**Content**

[1 URL API ](#h_01ERB0B91RYHF0G8GNQJRZ4HA9)

[2 How to Call ](#h_01ERB0B19M85C3CFKJV0CQ6KDJ)

## URL API

To integrate with other services and applications, we recommend setting up integration via Zapier.
You will be able to transfer data between services without the help of programmers.
Learn more about [Integration with Zapier.](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

API-service functions are taken from http://username.influencersoft.com/api/ adding the function name. For example, http://username.influencersoft.com/api/**AddLeadToGroup**.

**Username** – your store’s login.

***Please note****, you can also use your own domain linked to your account instead of username.influencersoft.com.  For more details, see the section “Site” ⇒ “Settings” ⇒ “Domains” in the personal account.*

## How to Call

Parameters are transferred by POST method with encoding URL-encode. For example:

<!--?php Send(http_build_query($send_data)); ?-->
where,

-
**Send **is the function that sends a query to the API;

-
**http_build_query **is a default PHP function;

-
**$send_data **is an array of transferred parameters.

Each query must be signed. For this, the *hash *field is transferred to the query.

It is formed as follows:

<!--?php md5("$params::$user_id::$secret") ?-->
where,

-
**$params **are URL encode parameters transferred to the API function;

-
**$user_id **is the login for the InfluencerSoft system;

-
**$secret **is a secret key that can be obtained from the account’s personal account in the API section.

[![](https://help.justclick.io/wp-content/uploads/2016/11/1576223758657.png)](https://help.justclick.io/wp-content/uploads/2016/11/1576223758657.png)

[![](https://help.justclick.io/wp-content/uploads/2016/11/1576223862146.png)](https://help.justclick.io/wp-content/uploads/2016/11/1576223862146.png)

Your system will receive the result of the function in the JSON format in response.

For more details, see the [API Service Responses](https://help.justclick.io/archives/511).

## Articles

[*Integration with Zapier.com* ](https://help.influencersoft.com/hc/en-us/articles/360050406312-Integration-with-Zapier-com-)

[*Enabling API **t**o Get Started* ](https://help.influencersoft.com/hc/en-us/articles/360050867731-Enabling-API-to-Get-Started)

[*API Response Statuses, Codes**,** and Descriptions* ](https://help.influencersoft.com/hc/en-us/articles/360050392312-API-Response-Statuses-Codes-and-Descriptions-)

[*Countries’ Identifiers* ](https://help.influencersoft.com/hc/en-us/articles/360050867391-Countries-Identifiers-)

## Rate Article