# Store Settings 

**Section:** Store
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050388432-Store-Settings
**Article ID:** 360050388432
**Updated:** 2021-04-20T02:54:48Z

---

/[Store ](https://help.influencersoft.com/hc/en-us/sections/360009133412-Store)/ Store Settings

**Content **

- [1 Payment method ](#h_01ERC1G0X3A6G2Z215Q6VH8HWB)

- [2 General settings ](#h_01ERC1G69AD9VGD0K261GFM241)

- [3 After prepayment ](#h_01ERC1GCCTHWWNF5T2E6BNZBQP)

- [4 Delivery ](#h_01ERC1GHXJ4P0BS0M14NDVB960)

- [5 Alternative store ](#h_01ERC1GQC2Q0P66XBAJDYQ8RXZ)

- [6 Payment methods for alternative store](#h_01ERC1GYRSDZ6JC6RQT78EWRH3)

- [7 Sales Tax](#h_01F3PK6DEKM81G6NN0D335RE6G)

- [8 Language  ](#h_01F3PK6R27W1XH6ECYKP9X37HA)

To go to the Store settings, you must select the **Store **item in the main menu and then in the submenu – **Settings**:

The form has six tabs:

-
Payment method

-
General settings

-
After prepayment

-
Delivery

-
Alternative store

-
Payment methods for alternative store

## Payment method

 ![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360072494691/blobid0.png)

To set a payment method, click «**Connect**»

## General settings

 ![blobid1.png](https://help.influencersoft.com/hc/article_attachments/360072270452/blobid1.png)

**Email for notifications**. This field specifies the e-mail address to which alerts will be sent about all created and paid bills in your store.

**Notify about new accounts via email**. If you uncheck this box, notifications about created accounts will not be received.

**Notify about paid orders via email**. If you uncheck this box, notifications about paid bills will not be received.

**When making an order, the phone field ****must**** be filled**. The included setting adds the “phone” field to the default order page.

**Check phone numbers for ****accuracy****. **A phone number mask has been added to minimize typing errors. Location is determined by the client’s IP address.

**Automatically assign new call task to personal manager**. If an additional [employee with Call Center rights](https://help.influencersoft.com/hc/en-us/articles/360050690672-Adding-and-Editing-a-User#h_01ERD13N29GDCAWB9DX2W65WS6) is added to the system and he has the right to view all accounts, or accounts of certain products, new accounts will be automatically added to the [calling task](https://help.influencersoft.com/hc/en-us/articles/360051550811-Calling-Tasks).

**New orders are marked with separate advertising channel and source – {Employee Login} / ****c****all center**. If the check mark is set, then when the manager creates a new account, it will not be possible to set the Channel and Source on the Advertising label tab. The default channel will be set as call center, and the manager’s login will be pulled into the source.

**Default minimum ****prepayment**** amount**. This is set in dollars. If during the [adding and editing a product](https://help.influencersoft.com/hc/en-us/articles/360050850851-Adding-and-Editing-a-Product-) to allow prepayment, but not to determine its size, the value will be taken from this field. It should be noted that the prepayment should not be more than half the value of the product, since the second payment can be  the same amount as the prepayment amount. We recommend that the minimum prepayment amount set for the product be a multiple of the total product amount.

**Expense amount.** You will need to configure the settings to get the correct expense amount. For example, you can set the default to count 13% from each product, which is spent on paying taxes and another 100 dollars, for example, postage or payment of encryption for each copy of the product. If the fields are not filled in, then the amount of profit and income in the Store section => Accounts will not differ.

**Link to the terms and conditions on the connected domains. **If an external domain is attached to the store, then in this field you can specify a link to the offer, which will be substituted in all products of the store by default.

**Colors. **With this setting, you can choose the colors and fonts that will be used on the order pages.
You can choose the color range from the suggested colors, or add your own (2 colors) to the fields for inserting the html-color code. The color from the first field will be used to design the order button and the order amount. And the color from the second field, for the color of the links on the page. You can also select the font of the title (title “Ordering”) and the main font of the text, which is displayed in the product name, product value, fields, and order button.

**Copyright text.** Information to be displayed in the footer of the page for the invoice.

## After prepayment

In this tab, you can customize the email that comes to the user after making a prepayment.

**Message “Thank you for ****your ****prepayment****”**

 ![blobid2.png](https://help.influencersoft.com/hc/article_attachments/360072494711/blobid2.png)

-
**{$name}** — inserts in the email the name of the contact specified when making the account;

-
**{$****bill_id****}** — substitute in the email the number of the account for which the prepayment was made;

-
**{$sum}** — substitute the amount of prepayment made in the email;

-
**{$good}** — substitutes in the email the name of the goods for which the prepayment is made;

-
**{$****leftsum****}** — substitutes the remaining amount in the email;

-
**{$****bill_link****}** — substitute in the email a link so the customer can pay the balance.

## Delivery

On this tab, you can choose the countries possible for delivery. This list will then be visible when creating or editing a physical product, on the “Delivery” tab.

 ![blobid3.png](https://help.influencersoft.com/hc/article_attachments/360072494731/blobid3.png)

## Alternative store

The point of the alternative store is to set up a redistribution of the funds received from different accounts to one account. That is, if you give a link to a regular store – money goes to one account, give another link (to an alternative store) – money goes to another account.

**How it works?**

In the Store ==> Settings section, you can choose a store for which you make settings for payment methods, that will be different from the main store.

 ![blobid4.png](https://help.influencersoft.com/hc/article_attachments/360072494751/blobid4.png)

To configure the work of an alternative store, you must have an [associated domain](https://help.influencersoft.com/hc/en-us/articles/360050851711-How-to-bind-your-own-domain-or-subdomain-) and assign it as an alternative store in the Store ==> Settings ==> Alternative Store.

Attention! To add your domain to an alternative store, click on the cross next to “Choose domain,” after which it becomes possible to select a domain delegated for the alternative store Further, the distribution of funds depends on the status of the alternative store: ON or OFF.

-
**If the alternative store is ON**, then ALL products, regardless of which store the order form was generated, will go to the alternative store account. ![blobid6.png](https://help.influencersoft.com/hc/article_attachments/360072270472/blobid6.png)

-
**If the alternative store is in the OFF status**, then by default the payment methods of the domain on which the form is generated are set.

![blobid7.png](https://help.influencersoft.com/hc/article_attachments/360072270492/blobid7.png)

If you have html skills and want to manually redistribute payment methods for certain products, then you can change the **action** forms to the domain of the alternative store so that the accounts are created to the alternative store.

Also, on this tab, you can configure the text of the copyright similarly to the settings of the main store.

## Payment methods for alternative store

 ![blobid8.png](https://help.influencersoft.com/hc/article_attachments/360072270512/blobid8.png)

More on [PayPal settings ](https://help.influencersoft.com/hc/en-us/articles/360050851091-Paypal-Settings)

## Sales tax

In this tab, you can add sales tax for a specific country of the buyer. Sales tax will be added to the product price when the buyer selects the country for which sales tax has been added:

[![](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-27_165552.jpg)](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-27_165552.jpg)

Clicking on the “Add sales tax” button will open a menu for adding it manually:

[![](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-18_18-47-00.png)](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-18_18-47-00.png)

Please note that sales tax will apply to both recurrent and upsell products too! That is, their amount will increase by the added percentage of sales tax.
You can also add standard EU VAT rates and request the customer’s VAT number. To do this, click on the “Add EU standard VAT rates” button and put a tick in the window that opens in the “Request customer VAT ID” item. After that, if necessary, select additional items with checkmarks. This functionality allows you to massively fill in a table at standard VAT rates for EU countries, so as not to enter data for each country separately:

[![](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-18_18-51-30.png)](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-18_18-51-30.png)

The Add EU standard VAT rates button adds a sales tax value for Europe only. In the country selection box (Not selected in the screenshot) select your country where your business is registered before importing sales taxes. In this case, you can exclude Reverse Charge for your country.

You can delete the added data by clicking on the cross next to them:

[![](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-18_18-52-24.png)](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-18_18-52-24.png)

This is useful if you want to edit automatic data. After deleting the data, you can add the information you need via the “Add sales tax” button.

## Language

On this tab, you can edit the message for a paid subscription product. By clicking on the question mark, you will see a hint that indicates what each variable from the field means.

Also, here you can set the format of the payment start date. You can choose a suitable format from the dropdown list:

[![](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-24_16-17-20.png)](https://help.justclick.io/wp-content/uploads/2016/11/2021-01-24_16-17-20.png)

The text from the “Message for a product with paid subscription” field will be displayed on the product order page if the payment type was [“Subscription”](https://help.influencersoft.com/hc/en-us/articles/360050850851-Adding-and-Editing-a-Product-#h_01ERBF0YMVBVHNH87EPHD450FK) (ie recurring payment) for the product.

###

### Related Articles:

[How to create (to edit) a discount ](https://help.influencersoft.com/hc/en-us/articles/360044766911-How-to-Create-to-Edit-a-Discount)

[Orders ](https://help.influencersoft.com/hc/en-us/articles/360050851031-Orders-)

[Create an order ](https://help.influencersoft.com/hc/en-us/articles/360050850951-Create-an-Order-)

[Order management (order card) ](https://help.influencersoft.com/hc/en-us/articles/360050851011-Order-Management-Order-Card-)

[The manager handles the order and the client. What is the difference? ](https://help.influencersoft.com/hc/en-us/articles/360050388452-The-manager-handles-the-order-and-the-client-What-is-the-difference-)

[Payment reminders via email ](https://help.influencersoft.com/hc/en-us/articles/360050388252-Payment-Reminders-via-Email-)