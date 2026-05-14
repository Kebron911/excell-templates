# Creating and Editing Processes

**Section:** Automation
**URL:** https://help.influencersoft.com/hc/en-us/articles/360051178071-Creating-and-Editing-Processes
**Article ID:** 360051178071
**Updated:** 2021-03-31T01:48:12Z

---

/ [Automation](https://help.influencersoft.com/hc/en-us/sections/360009245431-Automation) / Creating and Editing Processes

**Content**

- [The name of the process ](#h_01ERDBRW0N2SK21GP30DBVH8XG)

-
[+Add trigger ](#h_01ERDBTGRMTQGZH4K434Q2H89R)

[What can serve as a trigger?](#h_01ERDBV1D5H05RMFTCR1CCEG8E)

- [Trigger settings ](#h_01ERDBV7R46C4PBVMYANNYM89T)

- [+Add the next step of the process ](#h_01ERDBVGJVRQDWKEQ42YR988VJ)

-
[+Add “Action” ](#h_01ERDBVT8C6AQ0G7DK57BXTQXJ)

[“Send email” action ](#h_01ERDC8QQ4P41P3158FAYWVW4S)

- [“End of process” action ](#h_01ERDC9ZBKKB2GMKF2M6EZZ62J)

- [Action settings ](#h_01ERDCAC12RW1R2XN7WRZMDQP6)

-
[+ Add “Condition” ](#h_01ERDCAPAC2CSXFDG29NY1G5BE)

[Filter ](#h_01ERDCAXWA73A117KBCS6SBQD9)

- [A/B Test ](#h_01ERDCB7CSPMASWJ1R3PPK6QPX)

- [Temporary field of the process editing ](#h_01ERDCBHKT23WG3TD1TSYXBJ2T)

- [Frequently asked questions (FAQ) ](#h_01ERDCC1DQK8YHWPCSE4VV92C9)

This section is available from the main menu “Tasks” — “Processes”.

What the process is for and the basic settings of a section have been described in [this article](https://help.influencersoft.com/hc/en-us/articles/360051179551-Processes).

## The name of the process

When you create a new process, it is named by default as “Process (Date/Time)”. You can change the name to something that will be clear to you. Customers and subscribers will never see this name.

Click on the process name; enter a new name and click “Save”.

![](https://help.justclick.io/wp-content/uploads/2019/07/process_edit1.png)

## +Add a trigger

Trigger is an event that occurs with a contact. If this event occurs, the trigger causes the contact to be added to the process and the process execution.

Each process has “Added to process” trigger enabled by default. This trigger allows you to add a contact to the process manually. To do this, you need to go to the Lead card by clicking on the email in the Contacts  —  Lead section. Then click the cogwheel icon and select “Add to process”.

![](https://help.justclick.io/wp-content/uploads/2019/07/1576142744427-1024x452.png)

To add an additional trigger, click the plus sign on the right and select the desired trigger.

![](https://help.justclick.io/wp-content/uploads/2019/07/2021-01-18_153523.jpg)

### What can serve as a trigger?

Events work by logic “or”. For example, a contact (lead) OR subscribed to the list OR made an order — any of these events, including any combination of them.

List of available events that will cause the process execution:

-
Tag applied

-
Tag removed

-
Subscribed to list

-
Added to list

-
Removed from list

-
New order

-
Paid order

-
Cancelled order

-
Refund by order

-
Activated subscription

-
New leads

-
Visited page

-
Opened an email

-
Custom field value changed

### Trigger settings

By adding a trigger, you can specify a name that you understand, one or an infinite number of repetitions for one contact, set a trigger condition, and add an additional condition.

![](https://help.justclick.io/wp-content/uploads/2019/07/2021-01-18_155014.jpg)

When you configure a trigger (other than first-level triggers), you can configure it to move to the next step, not only when the trigger is triggered, but also when the timeout is exceeded.

Let us consider an example.

You want customers who made the order for a product to temporarily not receive a mail-out with other offers and not be distracted from the mailing. You add them to a separate list through the process and want the customers who paid the order to start receiving the mail-out again. Moreover, those who have not paid would begin to receive it 10 days after creating the order.

In this case, we add a “Paid order” trigger to the process, followed by the “Remove from list” action. In the settings of the trigger “Paid order”, select “Go to the next step — when the trigger is triggered or wait time is finished — 10 days.”

![](https://help.justclick.io/wp-content/uploads/2019/07/process_edit5.png)

You can set up a contact to move to the next stage of the process after a certain time or certain date, even if the trigger did not work.

## + Add the next step of the process

Click the “Plus sign” below to go to the setting of the next process step.

A step can be the “Actions”, “Conditions”, or “Triggers”.

![](https://help.justclick.io/wp-content/uploads/2019/07/2020-02-24_14-15-50.png)

You can configure the branching of the process. Thus, several different actions, conditions, or triggers will be performed simultaneously for a contact at one stage of the process.

You can use process branching if you want two actions to be performed simultaneously for a contact added to a process, such as adding to the list and adding a trigger.

![](https://help.justclick.io/wp-content/uploads/2019/07/process_edit7.png)

## + Add “Action”

Action — is what happens to the contact after the trigger is triggered. If the trigger is in action, one of the following actions can be performed on the contact:

-
Add tag

-
Delete tag

-
Add to list

-
Remove from list

-
Send email

-
POST/GET request

-
Change contact field value

-
Task

-
End of process

### “Send email” action

By this action, you can set up sending an email directly in the “Process”.

We have already learned to change the name of the block. In addition, you can configure one or an infinite number of repetitions for contact. If the toggle switch is off (black background color), an email will be sent to the contact every time he or she gets into the process and reaches this action. If the switch is on (green background), the message will be sent to the contact only once.

An email can be sent as soon as the contact has reached this point, a few days after the previous step, or on a specific date.

You must select the sender’s contact on whose behalf the message will be sent,. then fill in the “Message subject” and write a letter in a familiar visual editor.

![](https://help.justclick.io/wp-content/uploads/2019/07/process_edit8.png)

Before saving the action, you can evaluate the email through “Preview”. Test it and add an additional condition, for example, do not send an email to contacts in a certain list.

### “End of process” action

Each chain of actions in the process must end with an “End of process” action. If this action is not at the end of the chain, the process for the contact is not completed and will not get into the statistics “Done”. In addition, if a process can be run for a contact any number of times, but not at the same time, the contact will not get into the process the second time because it is “stuck” in the process.
It is possible to edit the “End of process” action. To do this, click on the “pencil” next to this block.

![blobid0.png](https://help.influencersoft.com/hc/article_attachments/360073095652/blobid0.png)

The block settings will open, where you can set a new name and select the color of the block.

![blobid1.png](https://help.influencersoft.com/hc/article_attachments/360073364271/blobid1.png)

### Action settings

In addition to changing the name and number of repetitions, you can specify the time of the action, select a list or tag, and add an additional condition.

![blobid2.png](https://help.influencersoft.com/hc/article_attachments/360073364291/blobid2.png)

The execution time of the action can be:

-
after done the previous

-
after done the previous one through

-
after done the previous on date

By selecting “after done the previous one through”, you can choose which days and at what time the action will be performed. For example, the action can run 7 days after the previous one, but only from Monday to Friday or from 08:00 to 21:00.

## + Add “Condition”

You can set a filter or use the A/B Test to distribute contacts into two different chains when certain conditions are performed.

![blobid3.png](https://help.influencersoft.com/hc/article_attachments/360073095692/blobid3.png)

### Filter

In the filter, you can choose whether it is necessary to fulfill one or all the conditions for passing the filter, specify one or more conditions, and add an additional condition.

After you add a condition, you must add an action, condition, or trigger that will trigger when the condition performed and or not performed.

![blobid4.png](https://help.influencersoft.com/hc/article_attachments/360073364331/blobid4.png)

**Examples:**

-
In the sales newsletter, we send out a special offer to buy a new course and give a link to the course’s sales page.
In the Process, we set up a condition that will check the subscriber’s visit to this selling page, and if he visited it, send him an email with an offer to receive an additional bonus or discount on this product. Thus, we “fuel interest” in our offer and stimulate sales of a new product.

-
We want to drive repeat sales. To do this, we set up a condition that will verify the bills payment of the first paid Product no. 1 of our auto-funnel (tripwire) and customers who have paid for it a certain number of days after the purchase. We will send a letter offering discounts on Product No. 2, which will complement Product No. 1 well. Thus, we encourage customers to repeat sales and get more profit in our project.

### A/B Test

When the “A/B Test” condition is applied, the process will go along one of the branches specified in this block. The percentage of distribution of contacts depends on the values set in the variants settings.

![blobid5.png](https://help.influencersoft.com/hc/article_attachments/360073095732/blobid5.png)

The percentage value in the variants can be changed.

**Example:**

We launched the “A / B Test” with a distribution of 50/50 variants.
In the first variant, we send a letter with a discount offer for Product No. 1 to customers who have paid bills in the amount of more than 500 dollars, and in the second variant we send a letter with a discount offer for Product No. 2.
Based on the analysis of statistics, they realized that according to the first variant, the process works much more efficiently; letter No. 1 brings the project more profit than letter No. 2.
We change the distribution of percent in variants by 100/0.
The process continues to work with high-performance indicators, and process analytics is not lost. With this approach, the process does not need to be reconfigured.

## Temporary field of the process editing

The upper right corner has the following buttons:

-
“Show statistics” button — when it activated, the “Filter” button appears. And in each action, trigger, and condition, the number of repetitions for each contact is shown, as well as the number of times this action, trigger, and the condition have already been performed

-
Process status button

-
The button of setting, by clicking on which you can rename the process

-
Save button

-
Exit from editing process button

Demonstration of statistics and filter will help you to see the progress of the process, at what stages of the process contacts are stuck. You can use this data to adjust your sales funnel.

![blobid6.png](https://help.influencersoft.com/hc/article_attachments/360073095772/blobid6.png)

You can change the location of the elements by dragging them and thus create a convenient visualization of the process.

## Frequently asked questions (FAQ)

**Is it possible to edit a running process?**

Yes, you can edit the process if it is already running. Before saving the changes, the system will ask you what to do with the unfinished sessions. If you have deleted some process steps, the process would complete for the contacts for which these steps performed. You can choose one of the actions “End of process” that you need to apply to these contacts.

For those contacts that are not in the deleted steps, you can choose one of two options: continue the process execution, or select the “End of process” action.

## Articles:

*[Tasks ](https://help.influencersoft.com/hc/en-us/articles/360050859551-Tasks)*

*[Processes](https://help.influencersoft.com/hc/en-us/articles/360051178071) *

*[Rules ](https://help.influencersoft.com/hc/en-us/articles/360051178391)*