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

- **Framework**: Next.js 14 (App Router)
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
│   └── utils.ts       # Utility functions
└── types/             # TypeScript type definitions
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
