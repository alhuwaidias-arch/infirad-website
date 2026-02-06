# Project TODO

## Completed Features
- [x] Neo-Brutalist design with Space Grotesk/IBM Plex Sans typography
- [x] Bilingual support (Arabic/English) with language toggle
- [x] Custom high-quality images for visual sections
- [x] Core sections: Hero, About Us, Methodology, Capabilities, Engagement, Footer
- [x] Animated graph visualization in hero section
- [x] Updated logo to new brand assets
- [x] Fixed header transparency with white text and drop shadows
- [x] Increased font sizes for readability
- [x] Fixed mobile responsiveness for badge boxes
- [x] Added LinkedIn link to footer
- [x] Upgraded project from web-static to web-db-user
- [x] Set up GitHub Actions workflow for deployment
- [x] Connected custom domain (infiradev.com)
- [x] Fixed GitHub Pages deployment configuration

## Pending Features
- [x] Integrate Hadi AI chat agent with Express backend
- [x] Add Python subprocess management for AI agent
- [x] Configure proxy middleware for /api/hadi/* requests
- [x] Update frontend API configuration to use proxy endpoint
- [x] Add required dependencies (http-proxy-middleware, concurrently)
- [x] Configure Hadi agent to use only DeepSeek API (not Anthropic)
- [x] Create hadiApi.ts service for frontend
- [x] Update ChatWidget to use real Hadi API
- [x] Test AI chat integration end-to-end
- [x] Copy company PDF documents to hadi-api/company-docs/
- [x] Update Python paths to use relative paths
- [x] Create HADI_INTEGRATION.md documentation
- [x] Add install:hadi script to package.json

## Telegram Bridge Integration
- [x] Create Telegram bridge service for website chat
- [x] Add API endpoints for bidirectional messaging
- [x] Update ChatWidget to use Telegram bridge mode
- [x] Initialize Telegram bot in server startup
- [x] Add telegramRouter to tRPC
- [x] Test end-to-end: website → Telegram → website
- [x] Create TELEGRAM_BRIDGE.md documentation

## Fix Telegram Bridge for Seamless Two-Way Chat
- [x] Debug why chat widget is not working (bot conflict issue identified)
- [x] Implement real-time polling for Telegram replies (2-second polling)
- [x] Add message delivery confirmation
- [x] Handle bot unavailable gracefully
- [ ] Test complete flow: website → Telegram → website (requires stopping other bot instances)
- [x] Ensure visitor doesn't know they're chatting with Telegram bot
