# Schaakclub Jean Jaurès Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bilingual (NL default / EN toggle) Jekyll website for Schaakclub Jean Jaurès on GitHub Pages, covering Home, About/History, Schedule & Join, News, Results, and Gallery.

**Architecture:** Static site built with Jekyll, built natively by GitHub Pages (no CI pipeline). Bilingual pages live in parallel `/nl/` and `/en/` directories sharing layouts/includes; a `lang_ref` front-matter field pairs each page with its translation for the language switcher. News and results are Jekyll collections (`_news`, `_results`); gallery images are driven by a `_data/gallery.yml` file so captions can be bilingual without duplicating images.

**Tech Stack:** Jekyll (via the `github-pages` gem for version parity with GitHub Pages), Ruby (installed locally via winget for this project), plain CSS (no preprocessor), no JavaScript required, no Jekyll plugins beyond what's built into Jekyll core (`where`, `where_exp`, `sort` Liquid filters).

## Global Constraints

- Dutch is the canonical/default language. Root `/` redirects to `/nl/`. English is available via a language-switcher link on every page. No other languages (no French).
- No CMS or non-technical editing workflow — maintainer edits Markdown/HTML/CSS directly and pushes via git.
- No live KBSB/VSF results integration — results are entered manually per season/round.
- No GitHub Actions workflow for deployment — GitHub Pages builds Jekyll natively from the default branch.
- No youth program content (club has none currently).
- Visual theme: walnut brown (`#3d2b1f`) + cream/ivory (`#f2ead9`) + muted sage/olive (`#8a9a5b`) + warm brass/gold (`#b08d57`); serif headings, sans-serif body; refinable later purely via CSS.
- GitHub account: **JRuyssinck** (personal), already authenticated via `gh auth login`. Repo will be created under this account, named `schaakclub-jean-jaures` (so the live site is `https://jruyssinck.github.io/schaakclub-jean-jaures/`) — flag now if a different repo name is wanted, otherwise this is what gets created in the deployment task.
- Real assets already sit in the project root and must be moved into `assets/img/`, not left at root:
  - `jeanjaures_logo_small.gif` (club emblem/logo).
  - Nine photo files, one confirmed duplicate pair (`20230212_134418.jpg` / `20230212_134418(1).jpg`) → dedupe to 8 unique photos.
- Confirmed practical info: adults meet **Tuesday evenings** at **IVG-school, Kazernenstraat 16, Gent** (interclub matches also played there); contact email `scjeanjaures@gmail.com` (unverified — copy must not claim it's guaranteed monitored); membership fee unknown — Join page must invite visitors to ask rather than state a number.
- The `docs/` folder (specs/plans) and Ruby tooling files (`Gemfile`, `Gemfile.lock`, `README.md`) must be excluded from the Jekyll build output (`exclude:` in `_config.yml`) — they're repo-only, not site content.
- Every internal link/asset reference uses Jekyll's `relative_url` filter (never a hardcoded absolute path) so the site works correctly under the `/schaakclub-jean-jaures` baseurl.

---

## File Structure

```
/
├── Gemfile                        # Task 1
├── Gemfile.lock                    # Task 1 (generated)
├── _config.yml                     # Task 1
├── .gitignore                       # Task 1
├── index.html                        # Task 1 (root -> /nl/ redirect)
├── _layouts/
│   ├── default.html                   # Task 2
│   ├── home.html                       # Task 2
│   ├── page.html                        # Task 2
│   └── news-item.html                    # Task 7
├── _includes/
│   ├── header.html                        # Task 2
│   ├── nav.html                            # Task 2
│   ├── footer.html                          # Task 2
│   └── lang-switcher.html                    # Task 2
├── assets/
│   ├── css/main.css                            # Task 3
│   └── img/
│       ├── logo/jeanjaures_logo_small.gif          # Task 4
│       └── gallery/gallery-01.jpg … gallery-08.jpg    # Task 9
├── _data/
│   └── gallery.yml                                     # Task 9
├── _news/
│   ├── 2026-08-10-nieuwe-website-nl.md                   # Task 7
│   └── 2026-08-10-nieuwe-website-en.md                    # Task 7
├── _results/
│   └── 2025-2026-r1.md                                       # Task 8
├── nl/
│   ├── index.md                                                # Task 2
│   ├── about.md                                                 # Task 5
│   ├── schedule.md                                               # Task 6
│   ├── join.md                                                    # Task 6
│   ├── news.md                                                     # Task 7
│   ├── results.md                                                   # Task 8
│   └── gallery.md                                                    # Task 9
├── en/
│   ├── index.md / about.md / schedule.md / join.md / news.md / results.md / gallery.md   # same tasks as nl/ counterparts
├── 404.html                                                                                   # Task 10
└── README.md                                                                                    # Task 11
```

---

### Task 1: Toolchain setup & Jekyll skeleton

**Files:**
- Create: `Gemfile`
- Create: `.gitignore`
- Create: `_config.yml`
- Create: `index.html`
- Test: manual build verification (no test framework for a static skeleton — verified via `jekyll build` output)

**Interfaces:**
- Produces: a working `bundle exec jekyll build` command later tasks rely on; `_config.yml` keys `title`, `baseurl`, `collections.news`, `collections.results`, `defaults` (per-directory `lang` assignment), `exclude`.

- [ ] **Step 1: Install Ruby locally**

```bash
winget install --id RubyInstallerTeam.RubyWithDevKit.3.2 --source winget --accept-package-agreements --accept-source-agreements
```

Close and reopen the terminal after install so `PATH` picks up Ruby, then verify:

```bash
ruby --version
```

Expected: `ruby 3.2.x ...` printed (exact patch version may differ).

- [ ] **Step 2: Create the Gemfile**

```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "webrick", "~> 1.8"
```

- [ ] **Step 3: Install gems**

```bash
gem install bundler
bundle install
```

Expected: completes with `Bundle complete!` and a `Gemfile.lock` is created.

- [ ] **Step 4: Create `.gitignore`**

```
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
.bundle/
vendor/
```

- [ ] **Step 5: Create `_config.yml`**

```yaml
title: "Schaakclub Jean Jaurès"
description: "De schaakclub van Gent sinds 1945"
baseurl: "/schaakclub-jean-jaures"
url: "https://jruyssinck.github.io"

collections:
  news:
    output: true
    permalink: /:collection/:path/
  results:
    output: true
    permalink: /:collection/:path/

defaults:
  - scope:
      path: "nl"
    values:
      lang: nl
  - scope:
      path: "en"
    values:
      lang: en
  - scope:
      path: ""
      type: "news"
    values:
      layout: news-item
  - scope:
      path: ""
      type: "results"
    values:
      layout: none

exclude:
  - Gemfile
  - Gemfile.lock
  - README.md
  - docs
  - vendor
  - node_modules
```

- [ ] **Step 6: Create the root redirect `index.html`**

```html
---
layout: none
permalink: /
---
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url={{ "/nl/" | relative_url }}">
  <link rel="canonical" href="{{ "/nl/" | relative_url }}">
  <title>Schaakclub Jean Jaurès</title>
</head>
<body>
  <p>Redirecting to <a href="{{ "/nl/" | relative_url }}">/nl/</a>…</p>
</body>
</html>
```

- [ ] **Step 7: Verify the skeleton builds**

```bash
bundle exec jekyll build
```

Expected: `done in X.XXX seconds.` with no errors, and `_site/index.html` exists containing `url=/schaakclub-jean-jaures/nl/` in its refresh meta tag.

```bash
grep -o 'url=[^"]*' _site/index.html
```

Expected output: `url=/schaakclub-jean-jaures/nl/`

- [ ] **Step 8: Commit**

```bash
git add Gemfile Gemfile.lock .gitignore _config.yml index.html
git commit -m "Set up Jekyll toolchain and site skeleton"
```

---

### Task 2: Shared layouts, includes & language switcher

**Files:**
- Create: `_layouts/default.html`, `_layouts/home.html`, `_layouts/page.html`
- Create: `_includes/header.html`, `_includes/nav.html`, `_includes/footer.html`, `_includes/lang-switcher.html`
- Create: `nl/index.md`, `en/index.md`
- Test: build + grep-based assertions on generated HTML (no test framework available; this is the static-site equivalent of an integration test — assert on rendered output)

**Interfaces:**
- Consumes: `_config.yml` `defaults` (Task 1) for `page.lang`.
- Produces: front-matter convention `lang_ref: <shared-slug>` that every future bilingual page pair must set identically (e.g. both `nl/about.md` and `en/about.md` use `lang_ref: about`) — the language switcher depends on this exact field name and matching value. Also produces CSS class hooks later tasks style: `.site-header`, `.site-nav`, `.lang-switch`, `.hero`, `.page`, `.site-footer`.

- [ ] **Step 1: Write the assertion (failing) for the language switcher, before building anything**

```bash
bundle exec jekyll build 2>&1 | tail -5
test -f _site/nl/index.html && grep -q '/en/' _site/nl/index.html
echo "exit code: $?"
```

Expected: build fails or `_site/nl/index.html` doesn't exist yet (`No such file or directory`), confirming the check currently fails — there's no `nl/index.md` or layout yet.

- [ ] **Step 2: Create `_layouts/default.html`**

```html
<!DOCTYPE html>
<html lang="{{ page.lang | default: 'nl' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page.title }} · {{ site.title }}</title>
  <link rel="stylesheet" href="{{ "/assets/css/main.css" | relative_url }}">
  <link rel="icon" href="{{ "/assets/img/logo/jeanjaures_logo_small.gif" | relative_url }}">
</head>
<body>
  {% include header.html %}
  <main>
    {{ content }}
  </main>
  {% include footer.html %}
</body>
</html>
```

- [ ] **Step 3: Create `_includes/header.html`**

```html
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="{% if page.lang == 'en' %}{{ "/en/" | relative_url }}{% else %}{{ "/nl/" | relative_url }}{% endif %}">
      <img src="{{ "/assets/img/logo/jeanjaures_logo_small.gif" | relative_url }}" alt="Schaakclub Jean Jaurès" class="brand-logo">
      <span>Schaakclub Jean Jaurès</span>
    </a>
    {% include nav.html %}
  </div>
</header>
```

- [ ] **Step 4: Create `_includes/nav.html`**

```html
<nav class="site-nav">
  {% assign l = page.lang | default: 'nl' %}
  {% if l == 'nl' %}
    <a href="{{ "/nl/" | relative_url }}">Home</a>
    <a href="{{ "/nl/about/" | relative_url }}">Over ons</a>
    <a href="{{ "/nl/schedule/" | relative_url }}">Wanneer &amp; Waar</a>
    <a href="{{ "/nl/news/" | relative_url }}">Nieuws</a>
    <a href="{{ "/nl/gallery/" | relative_url }}">Foto's</a>
    <a href="{{ "/nl/results/" | relative_url }}">Resultaten</a>
    <a href="{{ "/nl/join/" | relative_url }}">Lid worden</a>
  {% else %}
    <a href="{{ "/en/" | relative_url }}">Home</a>
    <a href="{{ "/en/about/" | relative_url }}">About</a>
    <a href="{{ "/en/schedule/" | relative_url }}">When &amp; Where</a>
    <a href="{{ "/en/news/" | relative_url }}">News</a>
    <a href="{{ "/en/gallery/" | relative_url }}">Gallery</a>
    <a href="{{ "/en/results/" | relative_url }}">Results</a>
    <a href="{{ "/en/join/" | relative_url }}">Join</a>
  {% endif %}
  {% include lang-switcher.html %}
</nav>
```

- [ ] **Step 5: Create `_includes/lang-switcher.html`**

```html
{% assign other = site.pages | where: "lang_ref", page.lang_ref | where_exp: "item", "item.lang != page.lang" | first %}
<span class="lang-switch">
  {% if other %}
    <a href="{{ other.url | relative_url }}">{% if page.lang == 'nl' %}English{% else %}Nederlands{% endif %}</a>
  {% elsif page.lang == 'nl' %}
    <a href="{{ "/en/" | relative_url }}">English</a>
  {% else %}
    <a href="{{ "/nl/" | relative_url }}">Nederlands</a>
  {% endif %}
</span>
```

- [ ] **Step 6: Create `_includes/footer.html`**

```html
<footer class="site-footer">
  <div class="container">
    <p>&copy; {{ site.time | date: "%Y" }} Schaakclub Jean Jaurès — Gent</p>
  </div>
</footer>
```

- [ ] **Step 7: Create `_layouts/home.html`**

```html
---
layout: default
---
<section class="hero">
  <img src="{{ "/assets/img/logo/jeanjaures_logo_small.gif" | relative_url }}" alt="" class="hero-logo">
  <h1>{{ page.title }}</h1>
  <p class="tagline">{{ page.tagline }}</p>
</section>
<div class="container home-content">
  {{ content }}
</div>
```

- [ ] **Step 8: Create `_layouts/page.html`**

```html
---
layout: default
---
<article class="container page">
  <h1>{{ page.title }}</h1>
  {{ content }}
</article>
```

- [ ] **Step 9: Create `nl/index.md`**

```markdown
---
layout: home
title: Schaakclub Jean Jaurès
tagline: De gezelligste schaakclub van Gent, al sinds 1945.
lang_ref: home
permalink: /nl/
---
Welkom! Schaakclub Jean Jaurès is een gezellige, laagdrempelige schaakclub in Gent — ideaal
als je graag online speelt of af en toe aan een schaaktafeltje in een café zit, en het wel
eens in het echt en zonder al te veel druk wil proberen.

Kom gerust eens langs op een [clubavond]({{ "/nl/schedule/" | relative_url }}), of lees meer
[over onze club]({{ "/nl/about/" | relative_url }}).
```

- [ ] **Step 10: Create `en/index.md`**

```markdown
---
layout: home
title: Schaakclub Jean Jaurès
tagline: Ghent's friendliest chess club, since 1945.
lang_ref: home
permalink: /en/
---
Welcome! Schaakclub Jean Jaurès is a friendly, low-pressure chess club in Ghent — a great
next step if you enjoy playing online or at a chess table in a bar, and want to try playing
in person without too much competitive pressure.

Come by for a [club evening]({{ "/en/schedule/" | relative_url }}), or read more
[about our club]({{ "/en/about/" | relative_url }}).
```

- [ ] **Step 11: Run the build and re-check the assertion**

```bash
bundle exec jekyll build
grep -o 'href="[^"]*"' _site/nl/index.html | grep '/en/'
grep -o 'href="[^"]*"' _site/en/index.html | grep '/nl/'
```

Expected: each command prints one matching `href="…/en/"` (from `nl/index.html`) and `href="…/nl/"` (from `en/index.html`) respectively — confirming the language switcher links both directions.

- [ ] **Step 12: Commit**

```bash
git add _layouts _includes nl/index.md en/index.md
git commit -m "Add shared layouts, includes, and language switcher"
```

---

### Task 3: Visual theme CSS

**Files:**
- Create: `assets/css/main.css`
- Test: build + grep for palette variables in output CSS

**Interfaces:**
- Consumes: CSS class hooks produced in Task 2 (`.site-header`, `.site-nav`, `.lang-switch`, `.hero`, `.page`, `.site-footer`, `.container`, `.brand`, `.brand-logo`).
- Produces: CSS custom properties `--color-walnut`, `--color-cream`, `--color-sage`, `--color-brass` and classes `.news-list`, `.gallery-grid`, `table.results` that Tasks 7–9 rely on for their markup to render styled (not required for those tasks' own tests to pass, but keeps visuals consistent).

- [ ] **Step 1: Write the assertion (failing) for the theme file**

```bash
test -f assets/css/main.css && grep -q -- "--color-walnut" assets/css/main.css
echo "exit code: $?"
```

Expected: non-zero exit code — `assets/css/main.css` doesn't exist yet.

- [ ] **Step 2: Create `assets/css/main.css`**

```css
:root {
  --color-walnut: #3d2b1f;
  --color-cream: #f2ead9;
  --color-sage: #8a9a5b;
  --color-brass: #b08d57;
  --font-heading: Georgia, "Times New Roman", serif;
  --font-body: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font-body);
  background: var(--color-cream);
  color: var(--color-walnut);
  line-height: 1.6;
}

h1, h2, h3 { font-family: var(--font-heading); color: var(--color-walnut); }

a { color: var(--color-brass); text-decoration: none; }
a:hover { text-decoration: underline; }

.container { max-width: 960px; margin: 0 auto; padding: 0 1rem; }

.site-header {
  background: var(--color-walnut);
  color: var(--color-cream);
  border-bottom: 4px solid var(--color-brass);
}
.header-inner { display: flex; align-items: center; justify-content: space-between; padding: 1rem; flex-wrap: wrap; }
.brand { display: flex; align-items: center; gap: .5rem; color: var(--color-cream); font-family: var(--font-heading); font-size: 1.25rem; }
.brand-logo { height: 40px; }
.site-nav { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
.site-nav a { color: var(--color-cream); }
.lang-switch { margin-left: 1rem; font-size: .85rem; opacity: .85; }

.hero {
  background-color: var(--color-cream);
  background-image:
    linear-gradient(45deg, rgba(138, 154, 91, 0.18) 25%, transparent 25%, transparent 75%, rgba(138, 154, 91, 0.18) 75%),
    linear-gradient(45deg, rgba(138, 154, 91, 0.18) 25%, transparent 25%, transparent 75%, rgba(138, 154, 91, 0.18) 75%);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
  padding: 3rem 1rem;
  text-align: center;
}
.hero-logo { height: 80px; }
.tagline { font-size: 1.15rem; }

.page { padding-top: 2rem; padding-bottom: 2rem; }

.news-list { list-style: none; padding: 0; }
.news-list li { margin-bottom: 1.5rem; }
.news-list .meta { color: var(--color-brass); font-size: .85rem; }

.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: .5rem; list-style: none; padding: 0; }
.gallery-grid img { width: 100%; border-radius: 4px; display: block; }

table.results { width: 100%; border-collapse: collapse; margin: 1rem 0; }
table.results th, table.results td { border: 1px solid var(--color-brass); padding: .5rem; text-align: left; }

.site-footer { background: var(--color-walnut); color: var(--color-cream); text-align: center; padding: 1rem; margin-top: 2rem; }
```

- [ ] **Step 3: Run build and re-check the assertion**

```bash
bundle exec jekyll build
grep -q -- "--color-walnut" assets/css/main.css && echo PASS
grep -q "assets/css/main.css" _site/nl/index.html && echo PASS
```

Expected: both lines print `PASS`.

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.css
git commit -m "Add wooden/chess-themed site styling"
```

---

### Task 4: Logo & favicon integration

**Files:**
- Create: `assets/img/logo/jeanjaures_logo_small.gif` (moved from project root)
- Modify: none (header/favicon references already point here from Task 2)
- Delete: `jeanjaures_logo_small.gif` (project root copy, after move)

**Interfaces:**
- Produces: the exact asset path `assets/img/logo/jeanjaures_logo_small.gif` that `_includes/header.html` and `_layouts/default.html`'s favicon `<link>` (Task 2) already reference.

- [ ] **Step 1: Write the assertion (failing) for the logo asset**

```bash
test -f _site/assets/img/logo/jeanjaures_logo_small.gif
echo "exit code: $?"
```

Expected: non-zero exit code — the file hasn't been moved into `assets/img/logo/` yet, so Jekyll hasn't copied it into `_site`.

- [ ] **Step 2: Move the logo into place**

```bash
mkdir -p assets/img/logo
git mv jeanjaures_logo_small.gif assets/img/logo/jeanjaures_logo_small.gif
```

- [ ] **Step 3: Run build and re-check the assertion**

```bash
bundle exec jekyll build
test -f _site/assets/img/logo/jeanjaures_logo_small.gif && echo PASS
grep -q 'assets/img/logo/jeanjaures_logo_small.gif' _site/nl/index.html && echo PASS
```

Expected: both lines print `PASS` (the second confirms the header include on the home page actually renders the `<img>` tag).

- [ ] **Step 4: Commit**

```bash
git add -A assets/img/logo
git commit -m "Move club logo into assets and wire it up as favicon/brand image"
```

---

### Task 5: About/History page (NL + EN)

**Files:**
- Create: `nl/about.md`, `en/about.md`
- Test: build + grep for key historical facts

**Interfaces:**
- Consumes: `_layouts/page.html`, `lang_ref` convention (Task 2).
- Produces: `lang_ref: about` pair — no later task depends on this beyond nav links already wired in Task 2.

- [ ] **Step 1: Write the assertion (failing) for the About page**

```bash
test -f _site/nl/about/index.html && grep -q "1945" _site/nl/about/index.html
echo "exit code: $?"
```

Expected: non-zero exit code — `nl/about.md` doesn't exist yet.

- [ ] **Step 2: Create `nl/about.md`**

```markdown
---
layout: page
title: Over ons
lang_ref: about
permalink: /nl/about/
---
Schaakclub Jean Jaurès werd opgericht in **1945** in het Volkshuis Jean Jaurès aan de
Ryhovelaan in Gent, genoemd naar de Franse socialist Jean Jaurès. In de decennia die volgden
groeide de club uit tot een vaste waarde in het Gentse schaakleven, met als hoogtepunt de
**nationale titel in 1971 en 1973** in de hoogste afdeling van de interclubcompetitie.

Vandaag speelt de club in de Oost-Vlaamse liga (VSF), met ploegen in de tweede en vijfde
afdeling. Maar onze club draait niet enkel om competitie: we willen vooral een gezellige,
laagdrempelige plek zijn voor iedereen die graag een partijtje schaakt — of je nu al jaren
clubschaak speelt, of net de stap wil zetten van online spelen of een partijtje in het café
naar een echte club.
```

- [ ] **Step 3: Create `en/about.md`**

```markdown
---
layout: page
title: About us
lang_ref: about
permalink: /en/about/
---
Schaakclub Jean Jaurès was founded in **1945** at the Jean Jaurès community center on
Ryhovelaan in Ghent, named after the French socialist Jean Jaurès. Over the following
decades the club became a fixture of Ghent's chess scene, culminating in the **national
championship in 1971 and 1973**, in the top division of the interclub competition.

Today the club plays in the East Flanders league (VSF), fielding teams in the second and
fifth division. But our club isn't just about competition — we want to be a friendly,
low-pressure place for anyone who enjoys a game of chess, whether you've played club chess
for years, or you're just taking the step from playing online or at a bar to joining a real
club.
```

- [ ] **Step 4: Run build and re-check the assertion**

```bash
bundle exec jekyll build
grep -q "1945" _site/nl/about/index.html && echo PASS
grep -q "1971" _site/en/about/index.html && echo PASS
```

Expected: both lines print `PASS`.

- [ ] **Step 5: Commit**

```bash
git add nl/about.md en/about.md
git commit -m "Add About/History page in NL and EN"
```

---

### Task 6: Schedule & Join pages (NL + EN)

**Files:**
- Create: `nl/schedule.md`, `en/schedule.md`, `nl/join.md`, `en/join.md`
- Test: build + grep for address/contact content

**Interfaces:**
- Consumes: `_layouts/page.html`, `lang_ref` convention (Task 2).
- Produces: `lang_ref: schedule` and `lang_ref: join` pairs.

- [ ] **Step 1: Write the assertion (failing) for both pages**

```bash
test -f _site/nl/schedule/index.html && grep -q "Kazernenstraat" _site/nl/schedule/index.html
echo "schedule exit code: $?"
test -f _site/nl/join/index.html && grep -q "scjeanjaures@gmail.com" _site/nl/join/index.html
echo "join exit code: $?"
```

Expected: both non-zero — neither file exists yet.

- [ ] **Step 2: Create `nl/schedule.md`**

```markdown
---
layout: page
title: Wanneer & Waar
lang_ref: schedule
permalink: /nl/schedule/
---
We spelen elke **dinsdagavond** in de IVG-school, Kazernenstraat 16, 9000 Gent. Ook onze
interclubwedstrijden worden hier gespeeld.

<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=3.7205%2C51.0430%2C3.7305%2C51.0490&layer=mapnik&marker=51.0460%2C3.7255"
  width="100%" height="300" style="border:1px solid var(--color-brass)">
</iframe>

*Adres en openingsuren onder voorbehoud — neem bij twijfel gerust [contact]({{ "/nl/join/" | relative_url }}) met ons op.*
```

- [ ] **Step 3: Create `en/schedule.md`**

```markdown
---
layout: page
title: When & Where
lang_ref: schedule
permalink: /en/schedule/
---
We play every **Tuesday evening** at IVG-school, Kazernenstraat 16, 9000 Ghent. Our interclub
matches are also played here.

<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=3.7205%2C51.0430%2C3.7305%2C51.0490&layer=mapnik&marker=51.0460%2C3.7255"
  width="100%" height="300" style="border:1px solid var(--color-brass)">
</iframe>

*Address and hours subject to confirmation — if in doubt, feel free to [contact us]({{ "/en/join/" | relative_url }}).*
```

- [ ] **Step 4: Create `nl/join.md`**

```markdown
---
layout: page
title: Lid worden
lang_ref: join
permalink: /nl/join/
---
Nieuwe leden zijn altijd welkom — ervaren clubspelers, maar ook wie vooral online speelt of
af en toe een partijtje in een café speelt en het wel eens "in het echt" wil proberen, in een
ontspannen sfeer.

Kom gewoon eens langs op een [clubavond]({{ "/nl/schedule/" | relative_url }}), of neem
vooraf contact op via **[scjeanjaures@gmail.com](mailto:scjeanjaures@gmail.com)** voor meer
info over lidgeld en werking.
```

- [ ] **Step 5: Create `en/join.md`**

```markdown
---
layout: page
title: Join us
lang_ref: join
permalink: /en/join/
---
New members are always welcome — experienced club players, but just as much anyone who
mostly plays online or occasionally at a bar and wants to try it "for real," in a relaxed
atmosphere.

Just drop by a [club evening]({{ "/en/schedule/" | relative_url }}), or reach out beforehand
via **[scjeanjaures@gmail.com](mailto:scjeanjaures@gmail.com)** for details on membership
fees and how things work.
```

- [ ] **Step 6: Run build and re-check the assertion**

```bash
bundle exec jekyll build
grep -q "Kazernenstraat" _site/nl/schedule/index.html && echo PASS
grep -q "scjeanjaures@gmail.com" _site/nl/join/index.html && echo PASS
grep -q "Kazernenstraat" _site/en/schedule/index.html && echo PASS
grep -q "scjeanjaures@gmail.com" _site/en/join/index.html && echo PASS
```

Expected: four `PASS` lines.

- [ ] **Step 7: Commit**

```bash
git add nl/schedule.md en/schedule.md nl/join.md en/join.md
git commit -m "Add Schedule and Join pages in NL and EN"
```

---

### Task 7: News collection & index page (NL + EN)

**Files:**
- Create: `_layouts/news-item.html`
- Create: `_news/2026-08-10-nieuwe-website-nl.md`, `_news/2026-08-10-nieuwe-website-en.md`
- Create: `nl/news.md`, `en/news.md`
- Test: build + grep for filtered, language-correct listing

**Interfaces:**
- Consumes: `collections.news` config (Task 1), `_layouts/default.html` (Task 2).
- Produces: front-matter contract for every future news item: `title`, `date` (YYYY-MM-DD), `lang` (`nl`/`en`), `lang_ref` (shared slug pairing the translation), `excerpt`. `nl/news.md` and `en/news.md` filter `site.news` by `lang` — any future news item must set `lang` correctly or it won't appear on either index.

- [ ] **Step 1: Write the assertion (failing) for the news index**

```bash
test -f _site/nl/news/index.html && grep -q "Nieuwe website" _site/nl/news/index.html
echo "exit code: $?"
```

Expected: non-zero — nothing exists yet.

- [ ] **Step 2: Create `_layouts/news-item.html`**

```html
---
layout: default
---
<article class="container page news-item">
  <h1>{{ page.title }}</h1>
  <p class="meta">{{ page.date | date: "%-d %B %Y" }}</p>
  {{ content }}
</article>
```

- [ ] **Step 3: Create `_news/2026-08-10-nieuwe-website-nl.md`**

```markdown
---
title: Nieuwe website online!
date: 2026-08-10
lang: nl
lang_ref: nieuwe-website
excerpt: Schaakclub Jean Jaurès heeft een nieuwe website, met info over onze club, kalender en meer.
---
We zijn trots om onze nieuwe website te lanceren! Hier vind je alles over onze geschiedenis,
wanneer en waar we spelen, hoe je lid kan worden, en later ook nieuws, foto's en resultaten.
```

- [ ] **Step 4: Create `_news/2026-08-10-nieuwe-website-en.md`**

```markdown
---
title: New website online!
date: 2026-08-10
lang: en
lang_ref: nieuwe-website
excerpt: Schaakclub Jean Jaurès has a new website, with info about our club, schedule and more.
---
We're proud to launch our new website! Here you'll find everything about our history, when
and where we play, how to join, and soon news, photos, and results too.
```

- [ ] **Step 5: Create `nl/news.md`**

```markdown
---
layout: page
title: Nieuws
lang_ref: news
permalink: /nl/news/
---
<ul class="news-list">
{% assign items = site.news | where: "lang", "nl" | sort: "date" | reverse %}
{% for item in items %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    <div class="meta">{{ item.date | date: "%-d %B %Y" }}</div>
    <p>{{ item.excerpt }}</p>
  </li>
{% endfor %}
</ul>
```

- [ ] **Step 6: Create `en/news.md`**

```markdown
---
layout: page
title: News
lang_ref: news
permalink: /en/news/
---
<ul class="news-list">
{% assign items = site.news | where: "lang", "en" | sort: "date" | reverse %}
{% for item in items %}
  <li>
    <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
    <div class="meta">{{ item.date | date: "%-d %B %Y" }}</div>
    <p>{{ item.excerpt }}</p>
  </li>
{% endfor %}
</ul>
```

- [ ] **Step 7: Run build and re-check the assertion**

```bash
bundle exec jekyll build
grep -q "Nieuwe website online" _site/nl/news/index.html && echo PASS
grep -q "New website online" _site/en/news/index.html && echo PASS
grep -qv "New website online" _site/nl/news/index.html && echo "PASS (nl index does not leak en item)"
```

Expected: three `PASS` lines — confirms both indexes render and are correctly filtered by language.

- [ ] **Step 8: Commit**

```bash
git add _layouts/news-item.html _news nl/news.md en/news.md
git commit -m "Add news collection and bilingual news index pages"
```

---

### Task 8: Results collection & table page (NL + EN)

**Files:**
- Create: `_results/2025-2026-r1.md`
- Create: `nl/results.md`, `en/results.md`
- Test: build + grep for rendered table row data

**Interfaces:**
- Consumes: `collections.results` config (Task 1).
- Produces: front-matter contract for every future result: `season`, `division`, `round`, `opponent`, `score` — results are language-neutral (proper nouns/numbers only), so both `nl/results.md` and `en/results.md` read the same `site.results` collection and only their column headers differ.

- [ ] **Step 1: Write the assertion (failing) for the results table**

```bash
test -f _site/nl/results/index.html && grep -q "Ronde" _site/nl/results/index.html
echo "exit code: $?"
```

Expected: non-zero — nothing exists yet.

- [ ] **Step 2: Create `_results/2025-2026-r1.md`**

```markdown
---
season: "2025-2026"
division: "2"
round: 1
opponent: "Voorbeeldclub Gent"
score: "3.5 - 2.5"
---
```

- [ ] **Step 3: Create `nl/results.md`**

```markdown
---
layout: page
title: Resultaten
lang_ref: results
permalink: /nl/results/
---
<table class="results">
  <thead>
    <tr><th>Seizoen</th><th>Afdeling</th><th>Ronde</th><th>Tegenstander</th><th>Score</th></tr>
  </thead>
  <tbody>
  {% assign items = site.results | sort: "round" %}
  {% for item in items %}
    <tr>
      <td>{{ item.season }}</td>
      <td>{{ item.division }}</td>
      <td>{{ item.round }}</td>
      <td>{{ item.opponent }}</td>
      <td>{{ item.score }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
```

- [ ] **Step 4: Create `en/results.md`**

```markdown
---
layout: page
title: Results
lang_ref: results
permalink: /en/results/
---
<table class="results">
  <thead>
    <tr><th>Season</th><th>Division</th><th>Round</th><th>Opponent</th><th>Score</th></tr>
  </thead>
  <tbody>
  {% assign items = site.results | sort: "round" %}
  {% for item in items %}
    <tr>
      <td>{{ item.season }}</td>
      <td>{{ item.division }}</td>
      <td>{{ item.round }}</td>
      <td>{{ item.opponent }}</td>
      <td>{{ item.score }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
```

- [ ] **Step 5: Run build and re-check the assertion**

```bash
bundle exec jekyll build
grep -q "Ronde" _site/nl/results/index.html && echo PASS
grep -q "Voorbeeldclub Gent" _site/nl/results/index.html && echo PASS
grep -q "Voorbeeldclub Gent" _site/en/results/index.html && echo PASS
```

Expected: three `PASS` lines.

- [ ] **Step 6: Commit**

```bash
git add _results nl/results.md en/results.md
git commit -m "Add results collection and bilingual results table pages"
```

---

### Task 9: Gallery page & photo import (NL + EN)

**Files:**
- Create: `_data/gallery.yml`
- Create: `nl/gallery.md`, `en/gallery.md`
- Create: `assets/img/gallery/gallery-01.jpg` … `assets/img/gallery/gallery-08.jpg` (moved + renamed from project root)
- Delete: the 9 original photo files from the project root (8 kept under new names, 1 duplicate dropped)

**Interfaces:**
- Consumes: `.gallery-grid` CSS class (Task 3).
- Produces: `_data/gallery.yml` schema `- file: <name>.jpg`, `alt_nl: <string>`, `alt_en: <string>` — the two gallery pages both read this same file so images aren't duplicated per language.

- [ ] **Step 1: Verify the duplicate photo pair is byte-identical before dropping one**

```bash
sha1sum "20230212_134418.jpg" "20230212_134418(1).jpg"
```

Expected: both lines print the same SHA1 hash, confirming they're identical. (If the hashes differ, stop and keep both files under distinct names instead of deduping — flag this to the user.)

- [ ] **Step 2: Write the assertion (failing) for the gallery page**

```bash
test -f _site/assets/img/gallery/gallery-01.jpg
echo "exit code: $?"
```

Expected: non-zero — photos haven't been moved yet.

- [ ] **Step 3: Move and rename the photos**

```bash
mkdir -p assets/img/gallery
git mv "20230212_134418.jpg" assets/img/gallery/gallery-01.jpg
git rm "20230212_134418(1).jpg"
git mv "322486294_497739092460108_7188930329772791992_n.jpg" assets/img/gallery/gallery-02.jpg
git mv "322569506_738292210965961_7003350708274268410_n.jpg" assets/img/gallery/gallery-03.jpg
git mv "323009629_884252636358873_8360323790644930374_n.jpg" assets/img/gallery/gallery-04.jpg
git mv "IMG-20230206-WA0002.jpg" assets/img/gallery/gallery-05.jpg
git mv "IMG_1335.jpeg" assets/img/gallery/gallery-06.jpg
git mv "IMG_20231204_213623820.jpg" assets/img/gallery/gallery-07.jpg
git mv "IMG_20240929_132810819_HDR.jpg" assets/img/gallery/gallery-08.jpg
```

- [ ] **Step 4: Create `_data/gallery.yml`**

```yaml
- file: gallery-01.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-02.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-03.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-04.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-05.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-06.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-07.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
- file: gallery-08.jpg
  alt_nl: "Clubmoment bij Schaakclub Jean Jaurès"
  alt_en: "A club moment at Schaakclub Jean Jaurès"
```

- [ ] **Step 5: Create `nl/gallery.md`**

```markdown
---
layout: page
title: Foto's
lang_ref: gallery
permalink: /nl/gallery/
---
<ul class="gallery-grid">
{% for item in site.data.gallery %}
  <li><img src="{{ "/assets/img/gallery/" | append: item.file | relative_url }}" alt="{{ item.alt_nl }}"></li>
{% endfor %}
</ul>
```

- [ ] **Step 6: Create `en/gallery.md`**

```markdown
---
layout: page
title: Gallery
lang_ref: gallery
permalink: /en/gallery/
---
<ul class="gallery-grid">
{% for item in site.data.gallery %}
  <li><img src="{{ "/assets/img/gallery/" | append: item.file | relative_url }}" alt="{{ item.alt_en }}"></li>
{% endfor %}
</ul>
```

- [ ] **Step 7: Run build and re-check the assertion**

```bash
bundle exec jekyll build
test -f _site/assets/img/gallery/gallery-01.jpg && echo PASS
test -f _site/assets/img/gallery/gallery-08.jpg && echo PASS
grep -c "<img" _site/nl/gallery/index.html
```

Expected: two `PASS` lines and the grep count prints `8`.

- [ ] **Step 8: Commit**

```bash
git add -A assets/img/gallery _data/gallery.yml nl/gallery.md en/gallery.md
git commit -m "Add gallery page with imported club photos"
```

---

### Task 10: Custom bilingual 404 page

**Files:**
- Create: `404.html`
- Test: build + grep for both-language content

**Interfaces:**
- Consumes: `_layouts/default.html` (Task 2).

- [ ] **Step 1: Write the assertion (failing)**

```bash
test -f _site/404.html && grep -q "Pagina niet gevonden" _site/404.html
echo "exit code: $?"
```

Expected: non-zero — `404.html` doesn't exist yet.

- [ ] **Step 2: Create `404.html`**

```html
---
layout: default
title: 404
permalink: /404.html
lang: nl
---
<div class="container page">
  <h1>Pagina niet gevonden / Page not found</h1>
  <p>
    Deze pagina bestaat niet (meer). Ga naar de <a href="{{ "/nl/" | relative_url }}">Nederlandse homepage</a>.<br>
    This page doesn't exist (anymore). Go to the <a href="{{ "/en/" | relative_url }}">English homepage</a>.
  </p>
</div>
```

- [ ] **Step 3: Run build and re-check the assertion**

```bash
bundle exec jekyll build
grep -q "Pagina niet gevonden" _site/404.html && echo PASS
grep -q "Page not found" _site/404.html && echo PASS
```

Expected: two `PASS` lines.

- [ ] **Step 4: Commit**

```bash
git add 404.html
git commit -m "Add bilingual custom 404 page"
```

---

### Task 11: README documentation

**Files:**
- Create: `README.md`
- Test: manual — every command/path mentioned must exist in the repo as-is (verified by grep against the actual file tree, not a runtime test)

**Interfaces:**
- Consumes: file paths/conventions established in Tasks 1–9 (`_news`, `_results`, `_data/gallery.yml`, `bundle exec jekyll serve`).

- [ ] **Step 1: Create `README.md`**

```markdown
# Schaakclub Jean Jaurès — website

Bilingual (NL/EN) Jekyll site for Schaakclub Jean Jaurès (Gent), hosted on GitHub Pages.

## Run locally

    bundle install
    bundle exec jekyll serve

Then open http://localhost:4000/schaakclub-jean-jaures/nl/

## Add a news item

Create two files (one per language), same `lang_ref` value so they pair up:

    _news/YYYY-MM-DD-slug-nl.md
    _news/YYYY-MM-DD-slug-en.md

Front matter: `title`, `date`, `lang` (`nl`/`en`), `lang_ref` (shared slug), `excerpt`.

## Add a result

Create one file — results aren't translated (season/opponent/score are language-neutral):

    _results/<season>-r<round>.md

Front matter: `season`, `division`, `round`, `opponent`, `score`.

## Add a gallery photo

1. Drop the image into `assets/img/gallery/`.
2. Add an entry to `_data/gallery.yml` with `file`, `alt_nl`, `alt_en`.

## Add/edit a static page

Static pages (Home, About, Schedule, Join, News index, Results index, Gallery index) live in
`nl/` and `en/`. Every bilingual pair must share the same `lang_ref` front-matter value, or
the language switcher won't find the translated counterpart.
```

- [ ] **Step 2: Verify every path/command mentioned actually exists**

```bash
test -d _news && test -d _results && test -f _data/gallery.yml && test -d nl && test -d en && echo PASS
```

Expected: `PASS`.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add README with content-editing instructions"
```

---

### Task 12: Create GitHub repo, push, enable Pages, verify live deployment

**Files:** none (repo-level operations only)

**Interfaces:** none — terminal task.

- [ ] **Step 1: Rename the local default branch to `main`**

```bash
git branch -m master main
```

- [ ] **Step 2: Create the GitHub repository under JRuyssinck**

```bash
gh repo create JRuyssinck/schaakclub-jean-jaures --public --source=. --remote=origin
```

Expected: prints the new repo URL, e.g. `https://github.com/JRuyssinck/schaakclub-jean-jaures`.

- [ ] **Step 3: Push**

```bash
git push -u origin main
```

Expected: push succeeds, branch `main` tracking `origin/main`.

- [ ] **Step 4: Enable GitHub Pages (Jekyll build, root of `main`)**

```bash
gh api repos/JRuyssinck/schaakclub-jean-jaures/pages -X POST -f "source[branch]=main" -f "source[path]=/" 2>&1 || \
gh api repos/JRuyssinck/schaakclub-jean-jaures/pages -X PUT -f "source[branch]=main" -f "source[path]=/"
```

(The API returns 201 on first-time creation, or the PUT updates an existing config — try POST first, fall back to PUT if it already exists.)

- [ ] **Step 5: Wait for the Pages build and verify the live site**

```bash
gh api repos/JRuyssinck/schaakclub-jean-jaures/pages/builds/latest
```

Expected: eventually (poll every ~30s) `"status": "built"`. Then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://jruyssinck.github.io/schaakclub-jean-jaures/nl/
curl -s -o /dev/null -w "%{http_code}\n" https://jruyssinck.github.io/schaakclub-jean-jaures/en/
```

Expected: both print `200`.

- [ ] **Step 6: Final manual check**

Open `https://jruyssinck.github.io/schaakclub-jean-jaures/nl/` in a browser and confirm: logo shows, nav works, language switcher goes to `/en/` and back, About/Schedule/Join/News/Results/Gallery pages all render with real content and photos.

---

## Notes for the club before sharing this URL publicly

- Confirm the membership fee and update `nl/join.md` / `en/join.md` accordingly (currently directs visitors to email instead of stating a number).
- Confirm `scjeanjaures@gmail.com` is still actively monitored.
