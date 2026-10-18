# MusicBook

Music Book For Young Clarinetists by Rey Abolofia

The LilyPond sources for the PDFs in [src](src) (warm-up, articulation, Klose
scales) live in [purple4reina/sheetmusic](https://github.com/purple4reina/sheetmusic)
under `teaching/`.

## Deploying

To deploy a change to any of the typescript files in
[src/assets/js](src/assets/js), run the following command:

```bash
tsc -p tsconfig.json
```

Alternatively, keep typescript building in the background with:

```bash
tsc -p tsconfig.json --watch
```

Be sure to commit the changes to both the `.ts` and `.js` files.
