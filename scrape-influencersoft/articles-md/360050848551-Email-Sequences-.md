# Email Sequences 

**Section:** Campaigns
**URL:** https://help.influencersoft.com/hc/en-us/articles/360050848551-Email-Sequences
**Article ID:** 360050848551
**Updated:** 2021-05-30T11:24:35Z

---

/[Campaigns ](https://help.influencersoft.com/hc/en-us/sections/360009245371-Campaigns)/Email Sequences

**Content **

- [1 What are the Sequences for? ](#h_01EREH1M27KQBXB7SKQJX5X3YJ)

-
[2 How to add a sequence? ](#h_01EREH1SKE5ED7CA9NQKHP6QQY)

[2.1 How to name a sequence? ](#h_01EREH1Z3PA7YDFJJZXY6WYH4T)

- [2.2 Key elements of the section ](#h_01EREH256Y0G2Z9V406GYA3NRG)

- [2.3 How many times will a sequence run for one lead? ](#h_01EREH2CQPE56SJDT9FBX9NH7D)

- [3 How to edit a previously created sequence? ](#h_01EREH2NED0QBXK0A0A2N0V8XJ)

- [4 How to disable a sequence? ](#h_01EREH2WXWKAWX593ZP0SBARDN)

- [5 How to delete a sequence? ](#h_01EREH359N6MYXBDVH03YP4FV3)

## What are the Sequences for?

Sequences define a variable chain of action for a lead, which will run for a subscriber of a particular list provided a lead meets one of the conditions (triggers or actions). These sequences can segment the database and flexibly adjust the sales funnel.

The sequences have a wide range of the tools and a visual editor, which make the process of making the logical sequences easy.

Let us describe some applications of this tool.

**Case #1: ****A**** subscriber opens a****n email**** — А/B testing for another ****email****.**

Once a subscriber joins a list, he/she will automatically receive an email. If a subscriber opens it, then he/she is sent another email. The screenshot shows that the next email is sent with А/B test to understand which email has a higher conversion rate. If a subscriber does not open the email, he/she will not receive further emails in this process.

![](https://help.justclick.io/wp-content/uploads/2020/02/sequences1.png)

**Case #2: ****A**** subscriber opens a page — ****an email**** is sent.**

A trigger “Visited page” can send another email to a lead. The email will be automatically sent once a lead of this list opens a page specified in a trigger.

**Case # 3. If a client processes the order, then he/she may be sent ****an email with a suggestion for making a purchase**** (in 70% of all cases), or a task for call-center to bring the client to ****buy**** (30% of all cases) will be automatically generated.**

This case can test two different schemes to work with the clients and to identify the best one — live communication over the phone with call-center staff or sending a standard email persuading to buy a product.

The case with a screenshot illustrates two different schemes to manage clients.

The left path of А/B testing: Once an order is processed, clients are sent the call to purchase email, and that is it.
The right path of А/B testing: Once an order is processed, call-center staff receives a task to contact a client and sell. If this call is successful, the process is completed. If the call is unsuccessful, the client will be sent an email with an overview of the previous event.

![](https://help.justclick.io/wp-content/uploads/2020/02/sequences2.png)

**Case #4. Full****-fledged sales funnel – from subscription to order processing.**

What shall we do? We will turn the cold clients into hot ones by sending email shots with useful recommendations, specify the most interested clients, and bring to the purchase stage the ones who have not processed the order yet. This is how it should look like:

![](https://help.justclick.io/wp-content/uploads/2020/02/sequences3.png)

Let us find out more about this step.

The first block, which is also called a starting block, is automatically generated, which means that a user has subscribed to a list (group).

A block “Warm email #1”. Email Composer or Visual Editor helps you automatically create an email. Follow the usual procedure to set the delays and restrictions. The flow-chart above illustrates the entire process to turn a cold client into a warm one.
We assume the final email in this sequence will have a link to generate an order to pay for a product.

“Visited landing page from an email” is the next step. When this happens, a client may be interested in the product. You can define an address of a particular page or several pages in this block, consider the link parameters (for example, a link with a particular promo tag), or disregard them.

“Order processing” is the next trigger. Let us define a one-day delay in the settings. It works like this: if the order has been generated, then the system moves to the next step at once. If the order is not generated, then the system waits for one day.
We can try different scenarios depending on the client’s actions. If the order has been processed, then our target is reached. We remove a client from a “warm” list (or you name it) and finish the process (the sequence).

However, if a client does not generate an order within one day, then we try to encourage purchase. Our case uses a block with A/B testing. A call to purchase email is sent to half of the potential clients, while the other half of the clients receives a call from a call-center team with a special discounted offer. If the call is successful, the process comes to an end. If a client does not answer the phone, he/she is sent the final sale email with a discount coupon.
By the way, a block type “Task” (“to bring client to purchase”) may have several exits. The options are “Call back later,” “Offer another product,” or other alternatives.

These are just some examples to apply the processes, however, we are not limited by these scenarios. The sequences can be customized to your needs.

## How to add a sequence?

To configure a sequence, move to “Campaigns” — “Sequences” and click “Add a sequence.”

 ![blobid3.png](https://help.influencersoft.com/hc/article_attachments/360072491431/blobid3.png)

### How to name a sequence?

Every new sequence requires a name and a list of leads which is the target for this sequence. Next click “Save.”

 ![blobid4.png](https://help.influencersoft.com/hc/article_attachments/360072267172/blobid4.png)

### Key elements of the section

The main page of the subsection has the “Filter” and “Add a sequence” buttons. The main part of the screen shows a list of already created sequences, the number of activated sequences, the number of leads for a sequence, the number of leads with finished sequences, the enable and disable bar, and a delete button.

 ![blobid5.png](https://help.influencersoft.com/hc/article_attachments/360072491451/blobid5.png)

### How many times will a sequence run for one lead?

A sequence can run one time or any (unlimited) number of times both simultaneously or not simultaneously.

 ![blobid6.png](https://help.influencersoft.com/hc/article_attachments/360072491471/blobid6.png)

Let us look at an example.

Starting trigger in a sequence – “Joined list A.”

If the sequence should run only once for a lead, once the lead has been triggered, it will no longer be active in the sequence should the same trigger occur.

If a sequence runs an unlimited number of times for one lead, then a lead in this sequence will join this sequence every time when the trigger is activated (for example, a lead unsubscribes and subscribes to this list again).

However, a sequence can run for more than one day for a lead, therefore, you can restrict the leads with the unfinished sequence to join this sequence again. To do this, select “any number of times if not in progress.”

## How to edit a previously created sequence?

Click the name of the created sequence to edit it.

 ![blobid7.png](https://help.influencersoft.com/hc/article_attachments/360072267192/blobid7.png)

## How to disable a sequence?

To disable a sequence, slide a bar opposite the required sequence.

(Green background — enabled, black — disabled).

 ![blobid8.png](https://help.influencersoft.com/hc/article_attachments/360072491491/blobid8.png)

## How to delete a sequence?

To delete a sequence, click the X opposite the required sequence. Once deletion of the sequence is confirmed, all information about it will be removed.

 ![blobid9.png](https://help.influencersoft.com/hc/article_attachments/360072491511/blobid9.png)

Please be aware that sequence management is like [Processes](https://help.influencersoft.com/hc/en-us/articles/360051178071-Creating-and-Editing-Processes) management.

Sequences of emails are the process with only one starting trigger. the Subscribers list (a list is defined when a sequence is created), and this trigger cannot be deleted or edited.

If the sequence blocks have leads waiting to perform an action, their number will be displayed in the outputs of the blocks.

![](https://help.justclick.io/wp-content/uploads/2020/02/sequences11.png)

![](https://help.justclick.io/wp-content/uploads/2020/02/sequences11.png)

### Related Articles:

[*Message Constructor *](https://help.influencersoft.com/hc/en-us/articles/360050848491-Message-Constructor-)

[*Recommendations for maintaining mailings *](https://help.influencersoft.com/hc/en-us/articles/360050848271-Recommendations-for-Maintaining-Mailings-)

[*Broadcasts *](https://help.influencersoft.com/hc/en-us/articles/360050848431-Broadcasts-)

[*Sending and Editing Emails by Lists *](https://help.influencersoft.com/hc/en-us/articles/360050848511-Sending-and-Editing-Emails-by-Lists-)

[*Sending and editing email by activity *](https://help.influencersoft.com/hc/en-us/articles/360050385632-Sending-and-Editing-Email-by-Activity-)

[*Broadcasts message analytics *](https://help.influencersoft.com/hc/en-us/articles/360050385472-Broadcasts-Message-Analytics-)