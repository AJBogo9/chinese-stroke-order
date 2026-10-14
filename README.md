# chinese-stroke-order

A web app for learning the stroke order of Chinese characters. Type a character, step through its strokes, then draw it yourself in a quiz.

Live at https://ajbogo9.github.io/chinese-stroke-order/

## Using it

Watch mode shows the character and highlights one stroke at a time.

| Key | Button | Action |
|---|---|---|
| W | Animate All | highlight the remaining strokes in order |
| A | Previous | go back one stroke |
| S | Repeat | highlight the current stroke again |
| D | Next | go forward one stroke |

Quiz mode hides the character and you draw it with the mouse or a finger. After a wrong stroke, the correct one flashes as a hint. Show outline turns the grey outline on or off.

The app remembers the last character, the mode and the outline setting. Characters without stroke data get a message straight away instead of an empty box. Adding `?embed` to the URL hides the title and the footer, for showing the app in an iframe.

## Running it locally

You need [Bun](https://bun.sh).

```bash
bun install
bun run build        # or `bun run watch` to rebuild on save
python3 -m http.server
```

Then open http://localhost:8000. Chrome blocks module scripts on `file://` URLs, so opening `index.html` straight from disk does not work.

`bun run check` type-checks the code. A push to `main` type-checks, builds and deploys the site to GitHub Pages.

`src/characters.ts` lists the characters that have stroke data. `bun run characters` regenerates it.

## Credits

The drawing, highlighting and quiz come from [Hanzi Writer](https://hanziwriter.org) (MIT license). The stroke data comes from [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) through [hanzi-writer-data](https://github.com/chanind/hanzi-writer-data), under the Arphic Public License, and loads from the jsDelivr CDN when you pick a character.
