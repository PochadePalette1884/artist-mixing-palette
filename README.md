# Artist's Mixing Palette: Munsell System

An interactive oil-painting mixing palette by **Michael Klein**, built for teaching and demonstrations.
Pigments mix the way paint does (spectral Kubelka–Munk mixing across 31 wavelengths), and every color is
placed in the Munsell system: value up, hue around, chroma out.

## What's inside

| File | What it is |
|---|---|
| `index.html` | The whole palette in one file. Open it in any browser; this is what students use. |
| `src/page.html` | The page itself: layout, styles, palettes, paint piles, the tree, the Munsell Book. |
| `src/engine.js` | The color engine: pigment reflectance curves, mixing, Munsell conversion. |
| `build.py` | Rebuilds `index.html` from the two source files (`python3 build.py`). |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |

## Features

- Michael's studio palette (17 colors, studio order), Klein Limited and Klein Neutral
- Historical palettes: Van Dyck, Gérôme, Monet, Repin, Sargent, Zorn, Zorn Extended, plus Michael Harding Wide Range and a Spectrum palette
- The mix: Munsell notation, opacity, screen-versus-paint comparison, the mix on every ground, tints with white
- Where it sits: a 3D Munsell tree with mixing paths, reachable colors, cross planes and a top view
- Add a painting: see a painting's colors as a tree, tap any spot for its closest mix, keep a Collection
- Mixing string between two pigments or two Munsell notations
- Munsell Book: 40 hue pages computed from the notation
- Wavelength reader

## Put it online with GitHub Pages

1. Create a repository on GitHub, then choose **Add file > Upload files** and drag in everything in this folder.
   (In Finder, press Cmd+Shift+. to show the hidden `.nojekyll` file so it uploads too.)
2. Go to **Settings > Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**,
   branch **main**, folder **/ (root)**, and save.
3. After a minute the palette is live at `https://<your-username>.github.io/<repository-name>/`.

Note: GitHub Pages sites are public, even from a private repository (Pages for private repositories needs a paid plan).
Anyone with the address can open it.

## Updating

Replace `src/page.html` and `src/engine.js` (or just `index.html`) with the new versions and commit.
Pages republishes automatically.

## Notes

- Students' painting Collections are saved in their own browser only.
- Munsell notations are approximate (computed from CIELAB, not looked up in the renotation tables).
- Pigment curves are fitted to swatches and published colors, not spectrophotometer measurements.

© 2026 Michael Klein. All rights reserved.
