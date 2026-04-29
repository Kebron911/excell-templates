# Atomization Map — slide-to-artifact reference

Quick-reference table for which slides feed which artifact, what gets exported, and where the file lives.

| Artifact | Slides used | Asset format | Where it lives | Funnel CTA |
|---|---|---|---|---|
| YouTube long-form | All 10 + VO | 1080p MP4, 10–15 min | YouTube channel | Blog URL |
| YouTube Shorts (×5–10) | One slide each (priority: 5, 6, 7, plus select 1/4/8/9) | 1080×1920 MP4, <60s | YouTube channel | `/47` |
| Instagram carousel | 1, 2, 3, 4, 5, 6, 7, 8, 9 (+ 10 as final card) | 1080×1350 PNG ×10 | IG feed | Link-in-bio → blog |
| Instagram Reel | 1, 4, 5, 6, 7, 10 | 1080×1920 MP4, 30–45s | IG feed | Link-in-bio → blog |
| Pinterest pins (×3–5) | Slide 1 hook reformatted into 3–5 styles (tip-list, quote-card, infographic, question, before/after) | 1000×1500 PNG | Pinterest boards | Blog URL or `/47` |
| Email newsletter | 4, 5, 6, 7, 8 expanded | Plain-text + HTML, 400–700 words | Influencersoft sequence | Blog URL or product |
| Blog post | All 10 expanded | Markdown, 1500–2500 words | Ghost blog | Product page |
| LinkedIn post | Slide 1 in body + 9-slide PDF carousel | Native LinkedIn carousel | LinkedIn feed | Blog URL (in comments) |
| X / Twitter thread | One tweet per slide (10 tweets) | Native X thread | X timeline | Blog URL (tweet 11) |
| FB group post | Slide 1 + question | Native FB post | Daniel's FB group | None |
| Etsy listing refresh | Slide 8 only (real-numbers block) | Listing description block | Etsy listing | (the listing itself) |

## UTM convention

Every CTA URL uses:

```
?utm_source={channel}&utm_medium={artifact_type}&utm_campaign={slug}
```

| Channel | utm_source | utm_medium |
|---|---|---|
| YouTube long-form | youtube | longform |
| YouTube Shorts | youtube | short |
| IG carousel | instagram | carousel |
| IG Reel | instagram | reel |
| Pinterest | pinterest | pin |
| Email | email | newsletter |
| Blog (internal) | blog | inline |
| LinkedIn | linkedin | post |
| X | twitter | thread |
| FB group | facebook | group |
| Etsy | etsy | listing |

## Voice budget

You record audio **once per week**, the YouTube long-form voiceover. Every cut comes from that single file:

- YouTube long-form: full audio
- YouTube Shorts: 30–60s slices (one per slide)
- IG Reel: ~40s composite from slides 1, 4, 5, 6, 7, 10
- Pinterest, blog, email, LinkedIn, X, FB, Etsy: silent — text only

If your weekly schedule prevents recording, the **fallback** is text-only output for IG carousel + Pinterest + blog + email + LinkedIn + X + FB. Skip YouTube + Reel + Shorts that week. Audio is the only gate; the other 6 channels are independent.

## Engagement signal capture (per artifact)

Each artifact tags `source_deck={{date}}-{{slug}}`. At end of week, capture:

| Signal | Where to find it | Why it matters |
|---|---|---|
| IG carousel saves | IG Insights → Saves per post | Top conversion-leading metric for templates buyer |
| IG carousel shares | IG Insights → Shares | Indicates "this is a reference doc" — strong save proxy |
| YT Shorts comments + retention curve | YT Studio | Top hooks for next week's Shorts |
| Pinterest outbound clicks | Pinterest analytics | Search-intent signal — what hosts are actually looking for |
| Email reply count + content | Inbox folder per newsletter | Direct topic signal for next week |
| Blog organic search ranking | Google Search Console (after 30+ days) | Long-tail SEO compounding |
| Etsy listing visits + favorites | Etsy stats | BOFU intent |
| FB group comments | FB group | Most direct buyer-language source |

Top 3 signals from any of the above feed the **Monday topic pool** for next week.
