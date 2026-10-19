import json, re, os, base64, shutil, html, datetime, sys

BASE = 'https://www.profireaustralia.com.au'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = ROOT
TODAY = datetime.date.today().isoformat()

T = open(ROOT + '/_src/template.html').read()
P = open(ROOT + '/_src/pages.html').read()
JS = open(ROOT + '/_src/site.js').read()

# ---------- page config ----------
PAGES = {
 '': dict(slug='/', label='Home', crumb=None,
   title='Profire Australia | AFSS Certification & Fire Safety Inspections Sydney, NSW',
   desc='Honest, transparent fire protection and compliance across NSW. AFSS certification, routine fire safety inspections, repairs and 24/7 after-hours service. Call 02 9948 4494.'),
 'about': dict(slug='/about/', label='About', crumb='About us',
   title='About Profire | Fire Compliance Company Sydney & NSW',
   desc='Profire provides personalised, friendly fire compliance services across NSW: AFSS certification, inspections and repairs for strata, commercial and government buildings.'),
 'team': dict(slug='/team/', label='The team', crumb='The team', parent='about',
   title='Our Team | Accredited Fire Safety Practitioners & Technicians | Profire',
   desc='Meet the Profire team of 50+ certifiers, fire safety technicians and office staff serving Bondi, Manly, Wollongong, the Northern Beaches, Sydney Metro and NSW.'),
 'certifications': dict(slug='/certifications/', label='Certifications', crumb='Certifications',
   title='Certifications | Level 1 & Level 2 Accredited Fire Safety Practitioners | Profire',
   desc='FPAA-accredited to test and certify all essential fire safety measures on your AFSS, with unrestricted Level 1 and Level 2 accreditation. Search the full list.'),
 'services': dict(slug='/services/', label='Services', crumb='Services',
   title='Fire Safety Services Sydney & NSW | Inspections, Repairs & Certification | Profire',
   desc='Turnkey fire safety: inspect, test, repair, install and certify fire panels, detection, sprinklers, hydrants, fire doors, exit and emergency lighting and more.'),
 'afss': dict(slug='/afss-inspections/', label='AFSS inspections', crumb='AFSS inspections', parent='services',
   title='AFSS Inspections & Certification Sydney, NSW | Annual Fire Safety Statement | Profire',
   desc='AFSS inspections and Annual Fire Safety Statement certification across Sydney and NSW. Accredited practitioners certify all measures. Check your 90-day deadline.',
   service='Annual Fire Safety Statement (AFSS) inspection and certification'),
 'routine': dict(slug='/routine-fire-inspections/', label='Routine inspections', crumb='Routine fire inspections', parent='services',
   title='Routine Fire Safety Inspections & Testing to AS1851 | Sydney, NSW | Profire',
   desc='Monthly, bi-annual and annual fire safety inspections and testing to AS1851, with photographic reports and cost-effective defect repair quotes.',
   service='Routine fire safety inspection and testing (AS1851)'),
 'repairs': dict(slug='/fire-equipment-repairs/', label='Repairs', crumb='Fire equipment repairs', parent='services',
   title='Fire Equipment Repairs & Preventative Maintenance NSW | Profire',
   desc='Fire equipment repairs plus preventative maintenance: hydrant and sprinkler pump servicing, 5-yearly hydrant overhauls, 10-yearly detection and smoke alarm upgrades.',
   service='Fire equipment repairs and preventative maintenance'),
 'smoke': dict(slug='/smoke-alarm-testing/', label='Smoke alarms', crumb='Smoke alarm testing', parent='services',
   title='Smoke Alarm Testing & Installation Sydney | Hard-wired & Interconnected | Profire',
   desc='Smoke and heat alarm testing, battery replacement and installation: 240v hard-wired, 10-year lithium and wireless interconnected, to BCA E2.2a, AS3786 and AS1851.',
   service='Smoke alarm and heat alarm testing and installation'),
 'after-hours': dict(slug='/after-hours-fire-service/', label='24/7 after hours', crumb='After-hours service', parent='services',
   title='24/7 After-Hours Fire Maintenance Service Sydney | Call 02 9948 4494 | Profire',
   desc='Beeping smoke alarm, chirping fire panel, jammed fire door or leaking hydrant? Call 02 9948 4494 for our on-call after-hours technician, 24/7.',
   service='24/7 after-hours fire system call-out'),
 'contact': dict(slug='/contact/', label='Get in touch', crumb='Get in touch',
   title='Contact Profire | Fire Compliance Enquiries | 02 9948 4494',
   desc='Get in touch with Profire about AFSS certification, inspections, repairs or after-hours call-outs. Call 02 9948 4494 or email office@profireaustralia.com.au.'),
}
SLUG = {k: v['slug'] for k, v in PAGES.items()}
SLUG['blog'] = '/blog/'
OLD = {'#/about': 'about', '#/team': 'team', '#/certifications': 'certifications', '#/services': 'services', '#/afss': 'afss',
       '#/routine': 'routine', '#/repairs': 'repairs', '#/smoke': 'smoke', '#/after-hours': 'after-hours', '#/contact': 'contact', '#/blog': 'blog'}

# ---------- images (committed in /img) ----------
EXT = {f.rsplit('.',1)[0]: f.rsplit('.',1)[1] for f in os.listdir(OUT + '/img')}
src = lambda k: f'/img/{k}.{EXT[k]}'

# ---------- split template ----------
css = re.search(r'<style>(.*?)</style>', T, re.S).group(1)
css += '''
.pf-seen #loader{display:none}
.pf-trans #curtain{transform:none}.pf-trans #curtain .ct{opacity:1;transform:none}
.vh{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.nf{min-height:80svh;display:grid;place-items:center;text-align:center;padding:160px var(--gut) 80px}
.nf h1{font:800 clamp(90px,20vw,240px)/.85 var(--display);letter-spacing:-.06em;color:var(--pink)}
'''
open(f'{OUT}/site.css', 'w').write(css)
labels = {v['slug']: v['label'] for v in PAGES.values()}
labels['/blog/'] = 'Blog'
open(f'{OUT}/site.js', 'w').write(JS.replace('%%LABELS%%', json.dumps(labels)))

shell = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="/site.css">', T, flags=re.S)
shell = re.sub(r'<script>\s*const IMG=%%IMGJSON%%;\s*%%JS%%\s*</script>', '<script src="/site.js" defer></script>', shell)
shell = shell.replace('%%PAGES%%', '')
shell = shell.replace('<span id="cttxt">Profire</span></div></div>', '<span id="cttxt">Profire</span></div></div>\n<script>try{var l=sessionStorage.getItem("pf-trans");if(l)document.getElementById("cttxt").textContent=l}catch(e){}</script>')
assert 'getItem("pf-trans")' in shell
assert '%%JS%%' not in shell
shell = shell.replace('<link rel="icon" href="%%icon%%">',
  '<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png">\n<link rel="apple-touch-icon" href="/img/favicon-180.png">')
for k in EXT: shell = shell.replace(f'%%{k}%%', src(k))
for o, k in OLD.items(): shell = shell.replace(f'href="{o}"', f'href="{SLUG[k]}"')
shell = shell.replace('href="#/"', 'href="/"')
# make header/footer images not block: lazy on footer only
shell = shell.replace('<img class="flogo"', '<img class="flogo" loading="lazy"')
shell = shell.replace('<footer>', '<footer>').replace('<span><img src="/img/fpas.png" alt="FPAS certificate"></span><span><img src="/img/fpaa.png"',
                      '<span><img loading="lazy" src="/img/fpas.png" alt="FPAS certificate"></span><span><img loading="lazy" src="/img/fpaa.png"')
headjs = "<script>try{var s=sessionStorage;if(s.getItem('pf-seen'))document.documentElement.classList.add('pf-seen');if(s.getItem('pf-trans'))document.documentElement.classList.add('pf-trans')}catch(e){}</script>"
noscript = '<noscript><style>.rv,.sw>span,.enter .inner>*{opacity:1!important;transform:none!important}.clip{clip-path:none!important}.clip img{transform:none!important}#loader{display:none!important}body.locked{overflow:auto}</style></noscript>'

cta = re.search(r'<template id="cta-block">(.*?)</template>', P, re.S).group(1)
tpls = {m.group(1): m.group(2) for m in re.finditer(r'<template id="p-([\w-]+)"[^>]*>(.*?)</template>', P, re.S)}

# ---------- content tweaks for keywords ----------
def tweak(k, c):
    rep = {
      'home': [('<p class="lead">Your honest, transparent, reliable fire protection and compliance company.</p>',
                '<p class="lead">Your honest, transparent, reliable fire protection and compliance company. AFSS certification, fire safety inspections and repairs across Sydney and NSW.</p>')],
      'afss': [('<h1 class="split">The AFSS process.</h1>', '<h1 class="split">AFSS inspections &amp; certification.</h1>'),
               ('<span class="eyebrow rv">What it involves</span>', '<span class="eyebrow rv">The AFSS process</span>')],
      'routine': [('<h1 class="split">Test, inspect &amp; certify.</h1>', '<h1 class="split">Routine fire safety inspections.</h1>'),
                  ('<p class="lead">Routine testing', '<p class="lead">Test, inspect and certify. Routine testing')],
      'repairs': [('<h1 class="split">Repairs &amp; preventative maintenance.</h1>', '<h1 class="split">Fire equipment repairs &amp; preventative maintenance.</h1>')],
      'smoke': [('<h1 class="split">Smoke alarm testing.</h1>', '<h1 class="split">Smoke alarm testing &amp; installation.</h1>')],
      'after-hours': [('<div class="flap pinkc" data-flap="ON CALL 24/7"></div>',
                       '<h1 style="font:700 clamp(20px,2.4vw,30px)/1.25 var(--display);letter-spacing:-.01em;margin-bottom:18px">24/7 after-hours fire maintenance service, Sydney &amp; NSW</h1><div class="flap pinkc" data-flap="ON CALL 24/7"></div>')],
      'certifications': [('<h1 class="split">Certifications.</h1>', '<h1 class="split">Certifications.<span class="vh"> Accredited Fire Safety Practitioners, Level 1 and Level 2</span></h1>')],
    }.get(k or 'home', [])
    for a, b in rep:
        assert a in c, (k, a); c = c.replace(a, b)
    return c

def imgs(c):
    n = [0]
    def f(m):
        key = m.group(1); n[0] += 1
        extra = ' fetchpriority="high"' if n[0] == 1 else ' loading="lazy"'
        return f'src="{src(key)}" decoding="async"{extra}'
    return re.sub(r'data-img="(\w+)"', f, c)

def links(c):
    for o, k in OLD.items(): c = c.replace(f'href="{o}"', f'href="{SLUG[k]}"')
    return c.replace('href="#/"', 'href="/"')

# ---------- structured data ----------
AREAS = ['Sydney', 'Bondi', 'Manly', 'Wollongong', 'Northern Beaches', 'Sutherland Shire', 'Central Coast', 'Western Sydney', 'New South Wales']
BUSINESS = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': BASE + '/#business',
  'name': 'Profire Australia', 'alternateName': 'Profire', 'url': BASE + '/',
  'logo': BASE + '/img/logo.png', 'image': BASE + '/img/og.jpg',
  'description': 'Fire protection and compliance company providing AFSS certification, routine fire safety inspections, fire equipment repairs, smoke alarm testing and a 24/7 after-hours service across NSW.',
  'telephone': '+61 2 9948 4494', 'email': 'office@profireaustralia.com.au',
  'address': {'@type': 'PostalAddress', 'addressRegion': 'NSW', 'addressCountry': 'AU'},
  'areaServed': [{'@type': 'Place', 'name': a} for a in AREAS],
  'knowsAbout': ['Annual Fire Safety Statement (AFSS)', 'AS1851', 'Fire safety inspections', 'Smoke alarm testing', 'Fire hydrant systems', 'Sprinkler systems', 'Fire doors', 'Emergency and exit lighting'],
  'contactPoint': {'@type': 'ContactPoint', 'telephone': '+61 2 9948 4494', 'contactType': 'customer service', 'areaServed': 'AU', 'availableLanguage': 'English', 'hoursAvailable': {'@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 'opens': '00:00', 'closes': '23:59'}},
}
def strip(x): return html.unescape(re.sub(r'<[^>]+>', '', x)).strip()

def schema(k, c):
    cfg = PAGES[k]; out = [BUSINESS]
    if k == '':
        out.append({'@context': 'https://schema.org', '@type': 'WebSite', '@id': BASE + '/#website', 'url': BASE + '/', 'name': 'Profire Australia', 'publisher': {'@id': BASE + '/#business'}})
        qas = re.findall(r'<div class="qa rv"><button[^>]*>(.*?)<span class="pl"></span></button><div class="ans"><div><p>(.*?)</p>', c, re.S)
        out.append({'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': strip(q), 'acceptedAnswer': {'@type': 'Answer', 'text': strip(a)}} for q, a in qas]})
    else:
        items = [{'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE + '/'}]
        if cfg.get('parent'):
            pp = PAGES[cfg['parent']]; items.append({'@type': 'ListItem', 'position': 2, 'name': pp['crumb'], 'item': BASE + pp['slug']})
        items.append({'@type': 'ListItem', 'position': len(items) + 1, 'name': cfg['crumb'], 'item': BASE + cfg['slug']})
        out.append({'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': items})
    if cfg.get('service'):
        out.append({'@context': 'https://schema.org', '@type': 'Service', 'name': cfg['service'], 'serviceType': cfg['service'],
                    'url': BASE + cfg['slug'], 'provider': {'@id': BASE + '/#business'},
                    'areaServed': {'@type': 'State', 'name': 'New South Wales'}, 'description': cfg['desc']})
    return '\n'.join(f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False)}</script>' for o in out)

def head(cfg, k, hero):
    url = BASE + cfg['slug']
    t = html.escape(cfg['title'], quote=True); d = html.escape(cfg['desc'], quote=True)
    pre = f'<link rel="preload" as="image" href="{hero}" fetchpriority="high">' if hero else ''
    return f'''<title>{t}</title>
<meta name="description" content="{d}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:site_name" content="Profire Australia"><meta property="og:locale" content="en_AU">
<meta property="og:title" content="{t}"><meta property="og:description" content="{d}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/img/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{t}"><meta name="twitter:description" content="{d}"><meta name="twitter:image" content="{BASE}/img/og.jpg">
<meta name="geo.region" content="AU-NSW">
{pre}
{headjs}'''

def page(k, content, cfg, body_page):
    hero = re.search(r'src="(/img/\w+\.\w+)" decoding="async" fetchpriority="high"', content)
    h = shell
    h = re.sub(r'<title>.*?</title>\s*<meta name="description"[^>]*>', head(cfg, k, hero.group(1) if hero else None).replace('\\', '\\\\'), h, flags=re.S)
    h = h.replace('</head>', schema(k, content) + '\n' + noscript + '\n</head>') if k is not None else h.replace('</head>', noscript + '\n</head>')
    h = h.replace('<body class="locked">', f'<body class="locked" data-page="{body_page}">')
    h = h.replace('<main id="app"></main>', f'<main id="app"><div class="page enter">{content}</div></main>')
    # active nav
    def nav(m):
        keys = m.group(2).split(','); on = (k or '') in keys if k is not None else False
        return f'<a href="{m.group(1)}" data-r="{m.group(2)}"' + (' class="on" aria-current="page"' if on else '') + '>'
    h = re.sub(r'<a href="([^"]*)" data-r="([^"]*)">', nav, h)
    return h

# ---------- blog ----------
def md(text):
    """Small Markdown renderer: ## / ### headings, paragraphs, - and 1. lists, > quotes, **bold**, *italic*, [links](url), ![img](key "caption")."""
    def inline(x):
        x = html.escape(x, quote=False)
        x = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', x)
        x = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', x)
        def link(m):
            u = m.group(2); ext = u.startswith('http') and 'profireaustralia.com.au' not in u
            return f'<a href="{u}"' + (' target="_blank" rel="noopener"' if ext else '') + f'>{m.group(1)}</a>'
        return re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, x)
    out, para, lst, lt = [], [], [], None
    def flush():
        nonlocal para, lst, lt
        if para: out.append('<p>' + inline(' '.join(para)) + '</p>'); para = []
        if lst: out.append(f'<{lt}>' + ''.join(f'<li>{inline(i)}</li>' for i in lst) + f'</{lt}>'); lst = []; lt = None
    for line in text.splitlines():
        l = line.strip()
        if not l: flush(); continue
        m = re.match(r'!\[([^\]]*)\]\((\w+)(?:\s+"([^"]*)")?\)$', l)
        if m:
            flush(); k = m.group(2)
            cap = f'<figcaption>{html.escape(m.group(3))}</figcaption>' if m.group(3) else ''
            out.append(f'<figure class="clip"><img src="{src(k)}" alt="{html.escape(m.group(1), quote=True)}" loading="lazy" decoding="async">{cap}</figure>'); continue
        if l.startswith('### '): flush(); out.append('<h3>' + inline(l[4:]) + '</h3>'); continue
        if l.startswith('## '): flush(); out.append('<h2>' + inline(l[3:]) + '</h2>'); continue
        if l.startswith('> '): flush(); out.append('<blockquote>' + inline(l[2:]) + '</blockquote>'); continue
        m = re.match(r'(?:[-*]|(\d+)\.)\s+(.*)', l)
        if m:
            t = 'ol' if m.group(1) else 'ul'
            if para: flush()
            if lt and lt != t: flush()
            lt = t; lst.append(m.group(2)); continue
        if lst: flush()
        para.append(l)
    flush()
    return '\n'.join(out)

def read_posts():
    posts = []
    d = ROOT + '/content/blog'
    for f in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        if not re.match(r'\d{4}-\d{2}-\d{2}-.+\.md$', f): continue
        raw = open(f'{d}/{f}').read()
        m = re.match(r'---\n(.*?)\n---\n(.*)', raw, re.S)
        meta = dict(re.findall(r'^(\w+):\s*(.*)$', m.group(1), re.M))
        meta = {k: v.strip().strip('"') for k, v in meta.items()}
        if meta.get('draft', 'false') == 'true': continue
        meta['slug'] = meta.get('slug') or re.sub(r'^\d{4}-\d{2}-\d{2}-', '', f[:-3])
        meta['body'] = m.group(2)
        assert meta.get('image') in EXT, f'{f}: image "{meta.get("image")}" not found in /img'
        posts.append(meta)
    posts.sort(key=lambda p: p['date'], reverse=True)
    return posts

def nice_date(d):
    y, mo, da = map(int, d.split('-')); return datetime.date(y, mo, da).strftime('%-d %B %Y')

def blog_page(content, title, desc, slug, extra_schema):
    h = page(None, content, dict(slug=slug, title=title, desc=desc), 'blog')
    h = h.replace('</head>', '\n'.join(f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False)}</script>' for o in [BUSINESS] + extra_schema) + '\n</head>')
    return h.replace('<a href="/blog/" data-r="blog">', '<a href="/blog/" data-r="blog" class="on" aria-current="page">')

def crumbs(items):
    return {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': BASE + u} for i, (n, u) in enumerate(items)]}

def card(p, feat=False):
    return (f'<a class="post-card rv{" feat" if feat else ""}" href="/blog/{p["slug"]}/" data-cur="Read"><div class="im"><img src="{src(p["image"])}" alt="{html.escape(p.get("image_alt", ""), quote=True)}" loading="lazy" decoding="async"></div>'
            f'<div class="tx"><time datetime="{p["date"]}">{nice_date(p["date"])}</time><h3>{html.escape(p["title"])}</h3><p>{html.escape(p["description"])}</p><span class="more">Read article →</span></div></a>')

def build_blog():
    posts = read_posts(); urls = []
    if os.path.isdir(OUT + '/blog'): shutil.rmtree(OUT + '/blog')
    os.makedirs(OUT + '/blog')
    for i, p in enumerate(posts):
        rel = [q for q in posts if q is not p][:3]
        hero = f'<section class="phero" style="min-height:70svh"><div class="bg" data-speed="0.25"><img src="{src(p["image"])}" alt="{html.escape(p.get("image_alt", ""), quote=True)}" decoding="async" fetchpriority="high"></div><div class="wrap inner"><div class="crumb"><a href="/">Home</a>/<a href="/blog/">Blog</a>/<span>Article</span></div><h1 class="split" style="max-width:20ch;font-size:clamp(40px,6.4vw,92px)">{html.escape(p["title"])}</h1><p class="lead">{html.escape(p["description"])}</p><div class="post-meta" style="margin-top:22px;color:#fff">{nice_date(p["date"])} · Profire Australia</div></div></section>'
        body = f'<section class="sec"><article class="wrap"><div class="article">{md(p["body"])}<p class="note">This article is general information about fire safety compliance in NSW. Every building is different, so <a href="/contact/">talk to our team</a> about your property.</p></div></article></section>'
        more = ('<section class="sec paper"><div class="wrap"><div class="sh"><div><span class="eyebrow rv">Keep reading</span><h2 class="split" style="margin-top:18px">More from the blog.</h2></div><a class="btn ghost mag rv" href="/blog/">All articles <span class="arr">→</span></a></div><div class="posts">' + ''.join(card(q) for q in rel) + '</div></div></section>') if rel else ''
        url = f'/blog/{p["slug"]}/'
        art = {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': p['title'], 'description': p['description'],
               'image': BASE + src(p['image']), 'datePublished': p['date'], 'dateModified': p.get('updated', p['date']),
               'author': {'@type': 'Organization', 'name': 'Profire Australia', 'url': BASE + '/'}, 'publisher': {'@id': BASE + '/#business'},
               'mainEntityOfPage': BASE + url, 'keywords': p.get('tags', '')}
        h = blog_page(hero + body + more + cta, p['title'] + ' | Profire', p['description'], url, [art, crumbs([('Home', '/'), ('Blog', '/blog/'), (p['title'], url)])])
        h = h.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">')
        h = h.replace(f'{BASE}/img/og.jpg', BASE + src(p['image']))
        os.makedirs(OUT + url, exist_ok=True); open(OUT + url + 'index.html', 'w').write(h)
        urls.append((url, p.get('updated', p['date']), '0.6'))
    hero = '<section class="phero" style="min-height:62svh"><div class="bg" data-speed="0.25"><img src="' + src('team2') + '" alt="Profire office team reviewing inspection reports" decoding="async" fetchpriority="high"></div><div class="wrap inner"><div class="crumb"><a href="/">Home</a>/<span>Blog</span></div><h1 class="split">Fire safety, explained.</h1><p class="lead">Plain-English guides to AFSS, fire safety inspections and keeping NSW buildings compliant, from the Profire team.</p></div></section>'
    if posts:
        grid = '<div class="posts">' + card(posts[0], True) + ''.join(card(q) for q in posts[1:]) + '</div>'
    else:
        grid = '<p class="lead" style="text-align:center;margin:0 auto">Our first articles are on the way. In the meantime, <a href="/contact/" style="color:var(--pink);font-weight:600">ask us anything</a>.</p>'
    idx = blog_page(hero + f'<section class="sec"><div class="wrap">{grid}</div></section>' + cta,
                    'Fire Safety Blog | AFSS & Compliance Guides for NSW | Profire',
                    'Plain-English guides to AFSS certification, fire safety inspections, smoke alarms and fire compliance for NSW strata and commercial buildings.',
                    '/blog/', [crumbs([('Home', '/'), ('Blog', '/blog/')])])
    open(OUT + '/blog/index.html', 'w').write(idx)
    urls.insert(0, ('/blog/', posts[0]['date'] if posts else TODAY, '0.7'))
    return urls

for k, cfg in PAGES.items():
    c = tpls['home' if k == '' else k]
    c = tweak(k, c).replace('%%CTA%%', cta)
    c = imgs(links(c))
    html_ = page(k, c, cfg, k)
    path = OUT + cfg['slug'] + 'index.html'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w').write(html_)

# 404
nf = f'''<section class="nf"><div><h1>404</h1><h2 style="margin:10px 0 18px">This page has gone up in smoke.</h2><p class="lead" style="margin:0 auto 30px">The page you're after has moved or no longer exists.</p><div class="hero-row" style="justify-content:center"><a class="btn mag" href="/">Back to home <span class="arr">→</span></a><a class="btn ghost mag" href="/contact/">Get in touch</a></div></div></section>'''
nfh = page(None, nf, dict(slug='/404/', title='Page not found | Profire', desc='This page could not be found.'), '404')
nfh = nfh.replace('<meta name="robots" content="index,follow,max-image-preview:large">', '<meta name="robots" content="noindex">')
nfh = re.sub(r'<link rel="canonical"[^>]*>\n', '', nfh)
open(OUT + '/404.html', 'w').write(nfh.replace('header.top{', 'header.top{'))

BLOG_URLS = build_blog()

# sitemap, robots
pri = {'': '1.0', 'afss': '0.9', 'routine': '0.8', 'smoke': '0.8', 'repairs': '0.8', 'after-hours': '0.8', 'services': '0.8', 'certifications': '0.7', 'contact': '0.7', 'about': '0.6', 'team': '0.5'}
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(
    f'  <url><loc>{BASE}{v["slug"]}</loc><lastmod>{TODAY}</lastmod><priority>{pri[k]}</priority></url>\n' for k, v in PAGES.items()) + ''.join(
    f'  <url><loc>{BASE}{u}</loc><lastmod>{d}</lastmod><priority>{p}</priority></url>\n' for u, d, p in BLOG_URLS) + '</urlset>\n'
open(OUT + '/sitemap.xml', 'w').write(sm)
open(OUT + '/robots.txt', 'w').write(f'User-agent: *\nAllow: /\n\nSitemap: {BASE}/sitemap.xml\n')

# redirects from the old Wix URLs (keeps existing Google rankings)
R = [('/about', '/about/'), ('/team-3', '/team/'), ('/certifications', '/certifications/'), ('/services', '/services/'),
     ('/general-8', '/afss-inspections/'), ('/copy-of-the-afss-process', '/routine-fire-inspections/'),
     ('/copy-of-routine-inspections', '/fire-equipment-repairs/'), ('/copy-of-fire-equipment-repairs-and-pr-1', '/smoke-alarm-testing/'),
     ('/services-4', '/after-hours-fire-service/'), ('/get-in-touch', '/contact/'), ('/post/:slug*', '/blog/'), ('/afss', '/afss-inspections/')]
vercel = {'trailingSlash': True, 'redirects': [{'source': s_, 'destination': b, 'permanent': True} for a, b in R for s_ in ([a] if a.endswith('*') else [a, a + '/']) if a + '/' != b],
          'headers': [{'source': '/img/(.*)', 'headers': [{'key': 'Cache-Control', 'value': 'public, max-age=31536000, immutable'}]},
                      {'source': '/(site.css|site.js)', 'headers': [{'key': 'Cache-Control', 'value': 'public, max-age=86400'}]}]}
json.dump(vercel, open(OUT + '/vercel.json', 'w'), indent=2)
open(OUT + '/_redirects', 'w').write(''.join(f'{a.replace(":slug*","*")}  {b}  301\n' for a, b in R))
print('built', OUT)
