#!/usr/bin/env bash
# Encode mixed WAV masters into web MP3s for the site, then rebuild waveforms.
#
# Usage: scripts/encode-audio.sh "/path/to/folder/with/wavs"
#
# Each line of TRACKS maps a source WAV (relative to the folder) to the output
# slug used in src/data/recordings.ts, with two optional fields: a silence
# threshold in dB for tracks whose room noise sits above the default, and a
# maximum length in seconds to cut applause off the end. Leading silence is trimmed, a short
# fade-in/out removes clicks, and nothing else about the mix is changed.
set -euo pipefail

SRC="${1:?usage: scripts/encode-audio.sh /path/to/wav/folder}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/audio"
mkdir -p "$OUT"

TRACKS=(
  "Verdi.wav|verdi-la-forza-del-destino"
  "Bellison 1.wav|bellison-wedding-preparation"
  "Bellison 2.wav|bellison-wedding-procession"
  "Bellison 3.wav|bellison-canzonetta"
  "Bellison 4.wav|bellison-hebrew-dance"
  "Bellison 5.wav|bellison-maypole"
  "Gershwin 1.wav|gershwin-prelude-1"
  "Gershwin 2.wav|gershwin-prelude-2"
  "Gershwin 3.wav|gershwin-prelude-3"
  "Milhaud.wav|milhaud-duo-concertant"
  "New York Counterpoint - mixed.wav|reich-new-york-counterpoint|-50|699"
)

for entry in "${TRACKS[@]}"; do
  IFS='|' read -r wav slug threshold maxdur <<<"$entry"
  threshold="${threshold:--58}"
  in="$SRC/$wav"
  [[ -f "$in" ]] || { echo "missing: $in" >&2; exit 1; }

  # Trim anything quieter than the threshold at the very start, keeping 0.25 s of air.
  trimmed="$(mktemp -t "$slug").wav"
  ffmpeg -loglevel error -y -i "$in" \
    -af "silenceremove=start_periods=1:start_threshold=${threshold}dB:start_silence=0.25" \
    ${maxdur:+-t "$maxdur"} -c:a pcm_s24le "$trimmed"

  dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$trimmed")"
  fade_len="${maxdur:+3}"; fade_len="${fade_len:-1.2}"
  fade_out_start="$(echo "$dur - $fade_len" | bc -l)"

  ffmpeg -loglevel error -y -i "$trimmed" \
    -af "afade=t=in:d=0.05,afade=t=out:st=${fade_out_start}:d=${fade_len}" \
    -c:a libmp3lame -q:a 2 -ar 48000 \
    -metadata artist="Rey Abolofia" \
    -metadata album="The Jewish Clarinet (live)" \
    "$OUT/$slug.mp3"
  rm -f "$trimmed"
  printf '%-34s %6.1fs  %s\n' "$slug" "$dur" "$(du -h "$OUT/$slug.mp3" | cut -f1)"
done

node "$(dirname "$0")/peaks.mjs"
