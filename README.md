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

Shown in the "Detailuitslagen"/"Detailed results" section of the Interclub page — one entry
per team per round (both teams play the same round on the same date, so each gets its own
file). Results aren't translated (names/scores are language-neutral); the page templates
translate `home_away` (`"home"`/`"away"`) into NL/EN themselves. Create one file:

    _results/<season>-r<round>-<division>.md

Front matter: `season`, `division` (e.g. `"2A"`), `round`, `team` (e.g. `"Jean Jaures Gent 1"`),
`opponent`, `home_away` (`"home"` or `"away"`), `score` (e.g. `"3 - 5"`), `sort_key`.

Optionally add `boards` for the board-by-board breakdown (shown as a small table under the
match summary) — a list of `{home, result, away}`, one per board, in board order:

```yaml
boards:
  - home: "Player Name (2100)"
    result: "1-0"
    away: "Opponent Name (1950)"
```

`sort_key` controls display order (not `round`, which is ignored for sorting): format is
`<season>-<round zero-padded to 2 digits>-<division>`, e.g. `2026-2027-01-2A`. This lets
results be sorted correctly across multiple seasons and both teams, newest first.

## Add a gallery photo

1. Drop the image into `assets/img/gallery/`.
2. Add an entry to `_data/gallery.yml` with `file`, `alt_nl`, `alt_en`.

## Add/edit a static page

Static pages (Home, About, Schedule, Interclub, Join, News index, Gallery index) live in
`nl/` and `en/`. Every bilingual pair must share the same `lang_ref` front-matter value, or
the language switcher won't find the translated counterpart.
