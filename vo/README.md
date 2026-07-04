# Voiceover clips

`intro-video.html` auto-plays one clip per beat, triggered at each beat's start:

| File | Beat | Starts at |
|------|------|-----------|
| `beat1.mp3` | The Pain | 0.6s |
| `beat2.mp3` | The Shift | 10.8s |
| `beat3.mp3` | The Loop | 30.5s |
| `beat4.mp3` | The Aha | 50.5s |

Generate them (matches the presenter app's voice — OpenAI `gpt-4o-mini-tts`, voice "nova"):

```bash
OPENAI_API_KEY=sk-... node scripts/make-vo.mjs
```

Or drop in your own ElevenLabs / HeyGen renders using the same filenames. If the
files are absent, the video still plays with music + burned-in captions.
