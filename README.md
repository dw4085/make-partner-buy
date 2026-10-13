# Make · Buy · Partner

An interactive strategic decision analysis tool for MBA students, developed for Columbia Business School's Technology Strategy course.

## Overview

This tool guides students through a systematic analysis of make-buy-partner decisions using established strategic frameworks:

1. **Competition-Driven Pressures** - 2x2 matrix of performance vs. cost pressures
2. **Technology S-Curve** - Technology lifecycle positioning
3. **Transaction Cost Economics** - Asset specificity, uncertainty, and frequency
4. **Hold-Up Risk** - Dependency and lock-in assessment
5. **Bargaining Power** - Negotiating position analysis
6. **Additional Dimensions** - Time horizon, capability gap, optionality

## Features

- Mobile-friendly responsive design
- AI-powered scenario parsing (Claude or OpenAI)
- Interactive framework inputs with real-time visualizations
- Personalized feedback comparing intuition vs. systematic analysis
- Shareable results and downloadable summaries
- Colorblind-accessible design
- One sign-in through the class hub; each analysis is recorded in the hub's activity log

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

Configure your AI provider:

```env
# Use 'anthropic' (default) or 'openai'
AI_PROVIDER=anthropic

# Provide the appropriate API key
ANTHROPIC_API_KEY=your_key_here
# or
OPENAI_API_KEY=your_key_here
```

And the class hub (see `.env.example`): `HUB_URL`, `HUB_JWT_PUBLIC_KEY`, `HUB_COOKIE_NAME`,
`HUB_APP_SLUG` (server), `NEXT_PUBLIC_HUB_URL`, `NEXT_PUBLIC_HUB_APP_SLUG` (browser, build-time),
and optionally `HUB_FRAME_ANCESTORS`.

### Class hub (sign-in and activity)

Students sign in once, at the class hub. The app is served under the hub's cookie domain
(preview: `mpb.preview.cbs-tech-strategy.com`) and has no sign-in of its own:

- **Pages:** `src/proxy.ts` checks the hub's session cookie (`src/lib/hub.ts`, the hub kit) and
  sends visitors without one to the hub's `/renew`, which returns them signed in. Guests whose pass
  doesn't include this app go to the app's page in the hub.
- **API routes:** every route (they call the AI model or fetch content) returns 401 without a valid
  cookie (`denyUnlessSignedIn()` in `src/lib/auth.ts`). The browser reloads on a 401
  (`src/lib/api.ts`) so the sign-in check runs again.
- **Activity:** the app has no database, so the browser reports to the hub
  (`src/lib/hub-client.ts`, held in localStorage until the hub has them, sent with the cookie).
  `src/lib/hubEvents.ts` builds the reports; each scenario is one run (`runId`):
  `run.started` (initial instinct locked in), `run.submitted` (framework scores + analysis),
  `run.completed` (plus personalised feedback). There is no admin page, so no outbox panel or sweep.
- **Embedding:** pages send `Content-Security-Policy: frame-ancestors 'self' …` (the hub's
  dashboard may frame the app) instead of `X-Frame-Options: DENY`; set `HUB_FRAME_ANCESTORS` to
  change the allowed origins (read at build time).

For local testing, run the hub locally and serve this app as `http://<sub>.hub.localhost:<port>`.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Deployment

This app is configured for Vercel deployment:

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Tech Stack

- **Framework**: Next.js 16 (App Router; `proxy.ts` gates pages)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **Charts**: Custom SVG, Recharts
- **AI**: Vercel AI SDK (Claude/OpenAI)
- **State**: React Context

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes for AI interactions
│   ├── globals.css    # Global styles and design tokens
│   ├── layout.tsx     # Root layout with providers
│   └── page.tsx       # Main app entry point
├── components/
│   ├── frameworks/    # Framework-specific components
│   ├── layout/        # Header, ProgressBar
│   ├── screens/       # Page-level screen components
│   └── ui/            # shadcn/ui components
├── context/           # React Context for session state
├── lib/
│   ├── ai/            # AI provider abstraction
│   ├── constants.ts   # Design system constants
│   ├── hub.ts         # Class hub kit (server): verifies the hub's session cookie
│   ├── hub-client.ts  # Class hub kit (browser): holds and sends activity reports
│   ├── hubEvents.ts   # Activity reports for each analysis
│   ├── auth.ts        # API route sign-in check
│   └── utils.ts       # Utility functions
├── types/             # TypeScript type definitions
└── proxy.ts           # Sign-in check for every page
```

## Design System

- **Primary**: Columbia Blue (#1D4ED8)
- **Secondary**: Warm Navy (#1E3A5F)
- **Accent**: Gold (#B4975A)
- **Make**: Teal (#0D9488)
- **Buy**: Blue (#2563EB)
- **Partner**: Orange (#C2410C)

Typography:
- Headlines: Libre Baskerville (serif)
- Body: DM Sans (sans-serif)

## Author

Professor Dan Wang
Columbia Business School
Technology Strategy

## License

Educational use only. All rights reserved.
