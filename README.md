# elonsoul

a voice-enabled ai companion that embodies elon musk's personality. real-time conversations with synchronized voice synthesis and animated avatar responses.

![elonsoul](https://raw.githubusercontent.com/Zer0-codes/elonsoul/main/public/preview.png)

## features

- **voice synthesis** - realistic speech powered by elevenlabs text-to-speech
- **speech recognition** - talk naturally using your microphone
- **synchronized responses** - text appears in sync with voice playback
- **animated avatar** - visual feedback showing speaking and thinking states
- **soul engine** - personality system that tracks mood and conversational context
- **mobile responsive** - works seamlessly on all devices

## tech stack

- [next.js 15](https://nextjs.org) - react framework with app router
- [vercel ai sdk](https://sdk.vercel.ai) - streaming ai responses
- [openai gpt-4o](https://openai.com) - language model backend
- [elevenlabs](https://elevenlabs.io) - voice synthesis api
- [tailwindcss](https://tailwindcss.com) - utility-first styling
- [typescript](https://typescriptlang.org) - type safety

## installation

clone the repository:

\`\`\`bash
git clone https://github.com/Zer0-codes/elonsoul.git
cd elonsoul
\`\`\`

install dependencies:

\`\`\`bash
pnpm install
\`\`\`

## environment setup

create a `.env.local` file in the root directory:

\`\`\`env
# required - openai api key for chat completions
OPENAI_API_KEY=your_openai_api_key

# optional - elevenlabs for realistic voice synthesis
# if not provided, falls back to browser speech synthesis
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# optional - custom voice id from elevenlabs
# search "elon musk" in elevenlabs voice library to find one
# defaults to "adam" voice if not specified
ELON_VOICE_ID=your_voice_id
\`\`\`

### getting api keys

**openai:**
1. go to [platform.openai.com](https://platform.openai.com)
2. create an account and add billing
3. generate an api key from the api keys section

**elevenlabs (optional but recommended):**
1. sign up at [elevenlabs.io](https://elevenlabs.io)
2. go to profile settings to get your api key
3. browse the voice library and search for "elon musk"
4. add a voice to your library and copy its voice id

## usage

start the development server:

\`\`\`bash
pnpm dev
\`\`\`

open [http://localhost:3000](http://localhost:3000) in your browser.

### controls

- **text input** - type your message and press enter or click send
- **microphone** - click to enable speech-to-text input
- **speaker icon** - toggle voice synthesis on/off
- **suggestion buttons** - quick conversation starters

## project structure

\`\`\`
elonsoul/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts        # ai chat endpoint
│   │   └── text-to-speech/
│   │       └── route.ts        # elevenlabs tts endpoint
│   ├── globals.css             # global styles and animations
│   ├── layout.tsx              # root layout with metadata
│   └── page.tsx                # main entry point
├── components/
│   ├── elon-avatar.tsx         # animated avatar component
│   ├── elon-chat.tsx           # main chat interface
│   ├── message-list.tsx        # message display with typewriter
│   └── soul-state.tsx          # mood indicator component
├── lib/
│   └── utils.ts                # utility functions
└── public/
    └── elon-musk-portrait-professional-headshot.jpg
\`\`\`

## customization

### changing the personality

edit the system prompt in `app/api/chat/route.ts`:

\`\`\`typescript
const ELON_SOUL_SYSTEM_PROMPT = `your custom prompt here`
\`\`\`

### using a different voice

1. browse [elevenlabs voice library](https://elevenlabs.io/voice-library)
2. find a voice you like and add it to your library
3. copy the voice id and set it as `ELON_VOICE_ID` in your env

### adjusting voice settings

modify the voice parameters in `app/api/text-to-speech/route.ts`:

\`\`\`typescript
voice_settings: {
  stability: 0.5,        // 0-1, higher = more consistent
  similarity_boost: 0.8, // 0-1, higher = closer to original
  style: 0.3,            // 0-1, style exaggeration
  use_speaker_boost: true
}
\`\`\`

## deployment

deploy to vercel:

\`\`\`bash
pnpm build
vercel --prod
\`\`\`

or click the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Zer0-codes/elonsoul)

remember to add your environment variables in the vercel dashboard.

## contributing

contributions are welcome. please open an issue first to discuss what you would like to change.

1. fork the repository
2. create your feature branch (`git checkout -b feature/something`)
3. commit your changes (`git commit -m 'add something'`)
4. push to the branch (`git push origin feature/something`)
5. open a pull request

## license

[mit](LICENSE)

## links

- [github](https://github.com/zer0-codes)
- [website](https://zer0.codes)
- [twitter](https://x.com/zer0codes)
- [contact](mailto:hi@zer0.codes)

---

built by [zer0](https://zer0.codes)
