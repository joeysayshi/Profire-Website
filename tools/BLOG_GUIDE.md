# Writing a Profire blog post

This is the checklist the weekly blog task follows. A person reviews every post before it goes live.

## Post file

Create `content/blog/YYYY-MM-DD-short-slug.md`:

```
---
title: What Happens If Your AFSS Is Late in NSW?
description: One or two sentences (140–160 characters) that work as the Google search snippet.
date: 2026-10-26
image: hero_afss
image_alt: Technician testing a fire pump control panel
tags: AFSS, fire safety statement, strata, NSW
---

Opening paragraph...

## A subheading

Text, lists, **bold**, [links](/afss-inspections/).

![Describe the photo](routine2 "Optional caption")

## Sources

- [Source title](https://...)
```

- `image` and inline images must be keys from `tools/images.json` (Profire's own photos). Pick the photo that best matches the topic; use a different photo inline than the cover.
- Supported Markdown: `##` and `###` headings, paragraphs, `-` and `1.` lists, `>` quotes, `**bold**`, `*italic*`, links, and images on their own line.

## Content rules

- **Audience:** strata managers, building owners and facility managers in NSW.
- **Length:** 800–1,200 words. Australian English. Plain, friendly, practical.
- **Accuracy first:** research every factual claim (laws, deadlines, standards, penalties) on official or primary sources, such as NSW Government, NSW Planning, Fire and Rescue NSW, NSW Fair Trading, the legislation website, FPA Australia or Standards Australia. Cite them under `## Sources`. If something can't be verified, leave it out.
- **Profire claims:** only use facts already on the site (40+ years combined experience, 50+ team members, unrestricted Level 1 and Level 2 accreditation, 24/7 after-hours on 02 9948 4494, AS1851 testing, photographic reports). Never invent testimonials, prices, statistics or case studies.
- **Search terms:** work in the topic's main phrase naturally in the title, first paragraph and one subheading. Don't stuff keywords.
- **Internal links:** link to 2–3 relevant pages: `/afss-inspections/`, `/routine-fire-inspections/`, `/fire-equipment-repairs/`, `/smoke-alarm-testing/`, `/after-hours-fire-service/`, `/certifications/`, `/contact/`.
- End with a short call to action pointing to `/contact/` or the phone number.
- Don't repeat a topic already in `content/blog/`. Take the next unused idea from `content/blog/TOPICS.md` (or a better timely one), and tick it off there.

## Build and check

```
python3 tools/build.py
```

Then confirm `blog/<slug>/index.html` exists and the post shows on `blog/index.html`.
