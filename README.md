# Schaakclub Jean Jaurès — website

Bilingual (NL/EN) Jekyll site for Schaakclub Jean Jaurès (Gent), hosted on GitHub Pages.

## Run locally

    bundle install
    bundle exec jekyll serve

Then open http://localhost:4000/nl/

## Add a news item

Create two files (one per language), same `lang_ref` value so they pair up:

    _news/YYYY-MM-DD-slug-nl.md
    _news/YYYY-MM-DD-slug-en.md

Front matter: `title`, `date`, `lang` (`nl`/`en`), `lang_ref` (shared slug), `excerpt`.

## Add a result

Shown in the "Detailuitslagen"/"Detailed results" section of the Interclub page. Create one
file — results aren't translated (season/opponent/score are language-neutral):

    _results/<season>-r<round>.md

Front matter: `season`, `division`, `round`, `opponent`, `score`, `sort_key`.

`sort_key` controls display order (not `round`, which is ignored for sorting): format is
`<season>-<round zero-padded to 2 digits>`, e.g. `2025-2026-01`. This lets results be sorted
correctly across multiple seasons, newest first.

## Add a gallery photo

1. Drop the image into `assets/img/gallery/`.
2. Add an entry to `_data/gallery.yml` with `file`, `alt_nl`, `alt_en`.

## Add/edit a static page

Static pages (Home, About, Schedule, Interclub, Join, News index, Gallery index) live in
`nl/` and `en/`. Every bilingual pair must share the same `lang_ref` front-matter value, or
the language switcher won't find the translated counterpart.
