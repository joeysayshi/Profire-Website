# Profire Australia website

Static site: 11 pages, no build step. Upload this folder as-is.

## Pages
| URL | Target searches |
|---|---|
| `/` | profire, profire australia, fire compliance company Sydney |
| `/afss-inspections/` | AFSS inspections, AFSS certification Sydney, annual fire safety statement |
| `/routine-fire-inspections/` | fire safety inspections, AS1851 testing |
| `/fire-equipment-repairs/` | fire equipment repairs, hydrant pump servicing |
| `/smoke-alarm-testing/` | smoke alarm testing Sydney, hard-wired smoke alarms |
| `/after-hours-fire-service/` | 24/7 fire maintenance, after-hours fire panel |
| `/certifications/`, `/services/`, `/about/`, `/team/`, `/contact/` | supporting pages |

## Deploy (Vercel)
1. `cd profire-site`
2. `npx vercel --prod`
3. In Vercel, add the domain `www.profireaustralia.com.au` (and redirect the bare domain to `www`).
4. Point the domain's DNS at Vercel and cancel the Wix plan once it's live.

`vercel.json` permanently redirects the old Wix URLs (`/general-8`, `/team-3`, `/get-in-touch`, etc.) to the new pages so existing Google rankings carry over. `_redirects` does the same on Netlify.

## After it's live
1. **Google Search Console:** add the domain, submit `https://www.profireaustralia.com.au/sitemap.xml`, and request indexing for `/` and `/afss-inspections/`.
2. **Google Business Profile:** set the website to the new URL, main category "Fire protection service", list every service and service area, and keep collecting reviews.
3. **Check the structured data** at https://search.google.com/test/rich-results (business details, FAQ, breadcrumbs, services).
4. **Same name/phone everywhere:** Yellow Pages, True Local, Hipages, Oneflare, FPA Australia directory, Strata Community Association NSW.
5. **Ask strata clients for a link** back to the site.

## Things to add when known
- Street address and office hours (add to the `LocalBusiness` data in each page head and the footer) — needed for the strongest local results.
- Links to social profiles or the Google Business Profile (`sameAs` in the structured data).
- Blog posts from the old site, or new articles (e.g. "What happens if my AFSS is late?"). `/blog` currently redirects to the home page.
- The contact form opens the visitor's email app. For direct submissions, connect a form service (e.g. Formspree) to `#cform`.
