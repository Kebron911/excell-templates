# InfluencerSoft Email Deliverability Troubleshooting
## Emails from Welcome-Book-Magnet Sequence Landing in Spam

### Priority Checklist (Check First)

#### 1. **Authentication & SPF/DKIM/DMARC**
   - Verify SPF record is published for your sending domain
   - Check DKIM signature is enabled in InfluencerSoft
   - Confirm DMARC policy is set (p=none while testing, p=quarantine or p=reject for production)
   - Test records: use `mxtoolbox.com` or Google's DMARC alignment tool
   - **Why**: Missing or misconfigured auth is the #1 reason emails hit spam

#### 2. **Sender Reputation & IP Warming**
   - Check if you're using a dedicated IP or shared pool
   - Review bounce/complaint rates in InfluencerSoft analytics
   - Look at Feedback Loop (FBL) metrics — high complaints trigger spam filtering
   - If new IP, ensure proper warmup schedule (gradual volume increase)
   - **Why**: ISPs trust older, warm IPs more than new ones

#### 3. **List Quality & Engagement**
   - Verify you're sending ONLY to opted-in subscribers
   - Check bounce rate (hard bounces should be <2%, soft <5%)
   - Remove inactive subscribers (no opens/clicks in 6+ months)
   - Look at engagement metrics — high open/click rates improve deliverability
   - **Why**: Spam filters penalize high bounce and complaint rates

#### 4. **Email Content Inspection**
   - **Subject line**: Avoid spam trigger words (FREE, URGENT, $$, BUY NOW, LIMITED TIME, etc.)
   - **Links**: Use full URLs, avoid shorteners, ensure they resolve correctly
   - **Images**: Don't exceed 150KB, use alt text, balance image-to-text ratio (60/40 text minimum)
   - **Attachments**: Avoid in first welcome email; PDFs/spreadsheets = spam signal
   - **HTML quality**: Validate for broken tags, excessive CSS, or inline styles
   - **Color/formatting**: Avoid all-red text, excessive bold/caps, reversed colors
   - **Unsubscribe link**: Required by law (CAN-SPAM, GDPR); place prominently
   - **Reply-to address**: Ensure it's monitored and valid

#### 5. **InfluencerSoft Configuration**
   - Confirm sending domain is verified (check DNS alignment)
   - Review default From name/address (avoid generic "no-reply@")
   - Check bounce handling settings — hard bounces should auto-remove
   - Verify list segmentation is working correctly
   - Look at sequence timing — rapid-fire emails trigger spam scoring

#### 6. **ISP-Specific Checks**
   - **Gmail/Google Workspace**: Check Postmaster Tools for deliverability metrics
   - **Outlook/Microsoft**: Monitor smart network data services (SNDS), check authentication
   - **Yahoo/AOL**: Review FBL complaints; they're strict on image-only emails
   - **Corporate**: May block based on IP reputation; check sender policy

---

### Immediate Diagnostic Steps

1. **Send a test to your own account** across Gmail, Outlook, Yahoo
   - Check Spam/Junk folder directly
   - Use Gmail's "Show original" to see authentication headers
   - Look for "SPF PASS", "DKIM PASS", "DMARC PASS"

2. **Check InfluencerSoft Reports**
   - Go to Sequence Settings → Deliverability
   - Look for bounce rate, complaint rate, spam reports
   - Check if ISP is listed (Gmail, Outlook, etc.)

3. **Review Recent Sequence Changes**
   - Did you add new links, images, or change subject line?
   - Did you upload a new list or segment unexpectedly?
   - Any changes to sending frequency?

4. **Validate Infrastructure**
   - Run SPF/DKIM check: `nslookup -type=txt yourdomain.com`
   - Test email headers with mail-tester.com or validator.freestar.com
   - Check IP reputation: mxtoolbox.com, abuseipdb.com

---

### Most Common Causes for Welcome Sequences

- **New domain/IP**: Not warmed up; ISPs default to caution
- **Too aggressive sending**: Bulk welcome emails trigger volume-based filters
- **Recipient list quality**: Scraped/purchased lists = high bounce = spam folder
- **Weak authentication**: SPF/DKIM missing or misconfigured
- **Generic subject**: "Welcome!" or "Confirm your subscription" can be tagged as spam

---

### Next Steps if Still Not Resolved

1. Reach out to InfluencerSoft support with your sequence ID — they can review sending IP logs
2. Request a Deliverability Review from your ESP (they can see ISP feedback)
3. Consider alternative sending domain (different from main business domain) to isolate sender reputation
4. Run a/b test on subject line — try more personal, less promotional language
5. Segment new subscribers separately with gentler content first; build reputation before aggressive sequences

