# REST Lab AI - AI Therapy Companion Instructions

A complete AI therapy companion system built with LiveKit Agents, featuring a specialized voice AI therapist and real-time health tracking interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Usage Guide](#usage-guide)
- [Product Features](#product-features)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

## 🎯 Overview

REST Lab AI is a comprehensive AI therapy companion system consisting of:

1. **Voice AI Agent** (Python) - A specialized therapist AI that provides emotional support, coping strategies, and tracks health metrics
2. **Web Interface** (React/Next.js) - A clean, real-time dashboard for voice conversations with live health tracking visualizations

The system is designed for individuals managing chronic pain and sleep disorders, providing evidence-based therapeutic support between professional therapy sessions.

## ✨ Features

### 🎤 Voice AI Therapist
- **Specialized Therapy Focus**: Chronic pain and sleep disorder support
- **Evidence-Based Interventions**: CBT, ACT, and mindfulness techniques
- **Real-Time Health Tracking**: Automatic logging of pain, sleep, and mood assessments
- **Compassionate Communication**: Warm, empathetic, non-judgmental tone
- **Safety Protocols**: Built-in crisis detection and referral systems
- **Multi-language Support**: Powered by Deepgram's multilingual STT

### 📊 Real-Time Health Dashboard
- **Pain Assessment Tracking**: Level (1-10), location, quality, triggers, and coping strategies
- **Sleep Quality Monitoring**: Rating, hours slept, sleep onset time, wake-ups, and affecting factors
- **Mood & Functioning Assessment**: Mood, energy, daily activities, social engagement, and emotional coping
- **Live Data Updates**: Instant visualization when the AI calls tracking functions
- **Persistent Storage**: Data saved locally in browser storage
- **Mini Visualizations**: Trend charts and progress indicators

### 🔧 Technical Features
- **High-Quality Voice Pipeline**: OpenAI GPT-4o-mini + Deepgram STT/TTS
- **Enhanced Noise Cancellation**: LiveKit Cloud noise reduction
- **Turn Detection**: Context-aware speaker detection with multilingual support
- **Metrics & Logging**: Comprehensive usage analytics and performance monitoring
- **Production Ready**: Includes Dockerfile and deployment configuration

## 📋 Prerequisites

### System Requirements
- **Python**: 3.9 or higher
- **Node.js**: 18 or higher
- **Package Managers**: `uv` (Python) and `npm`/`pnpm` (Node.js)

### Required API Keys
You'll need accounts and API keys for:
- **LiveKit**: [LiveKit Cloud](https://cloud.livekit.io/) or self-hosted instance
- **OpenAI**: [Get API key](https://platform.openai.com/api-keys)
- **Deepgram**: [Get API key](https://console.deepgram.com/)

## 🚀 Quick Start

### 1. Clone and Setup Environment

```bash
# Clone the repository
git clone <your-repo-url>
cd rest-lab-ai

# Install Python dependencies
uv sync

# Install frontend dependencies
cd react-frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Create `.env.local` in the root directory:

```env
# LiveKit Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# AI Service Keys
OPENAI_API_KEY=sk-your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key
```

Create `react-frontend/.env.local`:

```env
# LiveKit Configuration (same as above)
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
LIVEKIT_URL=wss://your-project.livekit.cloud
```

### 3. Download Required Models

```bash
# Download Silero VAD and LiveKit turn detector models
uv run python src/agent.py download-files
```

### 4. Start Both Services

**Terminal 1 - Start the AI Agent:**
```bash
uv run python src/agent.py dev
```

**Terminal 2 - Start the Web Interface:**
```bash
cd react-frontend
npm run dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser and click "Start call" to begin your therapy session.

## 🔧 Detailed Setup

### LiveKit Configuration

You can automatically load your LiveKit environment using the [LiveKit CLI](https://docs.livekit.io/home/cli/cli-setup):

```bash
# Install LiveKit CLI
npm install -g @livekit/cli

# Load environment variables
lk app env -w .env.local
```

### Alternative Agent Commands

```bash
# Console mode (terminal-only interaction)
uv run python src/agent.py console

# Development mode (for frontend/telephony)
uv run python src/agent.py dev

# Production mode
uv run python src/agent.py start
```

### Frontend Development

```bash
cd react-frontend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 📖 Usage Guide

### Starting a Therapy Session

1. **Open the Web Interface**: Navigate to `http://localhost:3000`
2. **Grant Permissions**: Allow microphone access when prompted
3. **Start the Call**: Click "Start call" to connect with your AI therapist
4. **Begin Conversation**: The AI will greet you and ask how you're feeling

### Interacting with the AI Therapist

The AI therapist is designed to:

- **Check-in on your wellbeing**: "How are you feeling right now?"
- **Assess pain levels**: "Can you rate your pain on a scale of 1-10?"
- **Monitor sleep quality**: "How did you sleep last night?"
- **Track mood and energy**: "How's your energy level today?"
- **Provide coping strategies**: Evidence-based techniques for pain and sleep management
- **Offer emotional support**: Validation and encouragement

### Health Tracking Features

The system automatically tracks and visualizes:

**Pain Assessments:**
- Triggered when you mention pain levels, location, or quality
- Records: pain level (1-10), location, quality, triggers, coping strategies
- Example: "My back pain is about a 7 today, it's a sharp pain"

**Sleep Quality:**
- Triggered when you discuss sleep from the previous night
- Records: sleep quality (1-10), hours slept, sleep onset, wake-ups, factors
- Example: "I only got 5 hours of sleep and woke up 3 times"

**Mood & Functioning:**
- Triggered when you share emotional state or daily activities
- Records: mood, energy, daily activities, social engagement, coping strategies
- Example: "I'm feeling pretty down today, low energy"

### Real-Time Dashboard

The tracking panel shows:
- **Current Metrics**: Latest pain, sleep, and mood ratings
- **Mini Trends**: Small charts showing recent patterns
- **Live Updates**: Data appears instantly when mentioned in conversation
- **Persistent Data**: Information saved between sessions

## 🎯 Product Features

### AI Therapist Capabilities

**Therapeutic Approaches:**
- **Cognitive Behavioral Therapy (CBT)**: Thought challenging and behavioral activation
- **Acceptance & Commitment Therapy (ACT)**: Values clarification and psychological flexibility
- **Mindfulness-Based Interventions**: Body scans, breathing exercises, present-moment awareness

**Communication Style:**
- Warm, empathetic, and non-judgmental
- Patient-paced conversations
- Validating responses that acknowledge difficulty
- Person-first language
- Open-ended questions to encourage expression

**Safety Features:**
- Crisis detection for suicidal ideation or self-harm
- Automatic referrals to emergency resources (988 Suicide & Crisis Lifeline)
- Clear scope limitations (no medical diagnosis or treatment)
- Medication concerns referred to healthcare providers

### Health Tracking System

**Comprehensive Monitoring:**
- **Pain Management**: Level, location, quality, triggers, and coping strategies
- **Sleep Patterns**: Quality, duration, onset time, disturbances, and affecting factors
- **Emotional Wellbeing**: Mood, energy, daily functioning, and social engagement

**Data Integration:**
- Real-time data transmission from AI to frontend
- Persistent local storage for continuity
- Trend analysis and pattern recognition
- Healthcare provider preparation notes

### Technical Architecture

```
Frontend (React/Next.js) ↔ LiveKit Room ↔ Python Therapist Agent
                    ↓
              Local Storage
              (tracking data)
```

**Voice Pipeline:**
- **LLM**: OpenAI GPT-4o-mini for natural conversation
- **STT**: Deepgram Nova-3 with multilingual support
- **TTS**: Deepgram Aura-2-Andromeda for natural speech
- **VAD**: Silero Voice Activity Detection
- **Turn Detection**: LiveKit multilingual turn detector

## 🐛 Troubleshooting

### Common Issues

**Agent won't start:**
```bash
# Ensure models are downloaded
uv run python src/agent.py download-files

# Check environment variables
cat .env.local

# Verify API keys are valid
```

**Frontend connection issues:**
```bash
# Verify both .env.local files have matching LiveKit credentials
# Check that the agent is running in dev mode
# Ensure port 3000 is available
```

**No voice input/output:**
- Grant microphone permissions in browser
- Check browser console for errors
- Verify Deepgram API key is valid
- Test with different browsers

**Tracking data not appearing:**
- Check browser console for WebSocket errors
- Verify the agent is running and connected
- Try mentioning specific pain/sleep/mood keywords
- Check browser local storage for saved data

### Debug Mode

Enable verbose logging:

```bash
# Agent debug mode
LIVEKIT_LOG_LEVEL=debug uv run python src/agent.py dev

# Frontend debug mode
DEBUG=* npm run dev
```

### Performance Issues

**Agent performance:**
- Monitor CPU and memory usage
- Check network latency to LiveKit servers
- Verify adequate bandwidth for real-time audio

**Frontend performance:**
- Clear browser cache and local storage
- Disable browser extensions
- Check network connectivity

## 🔧 Development

### Running Tests

```bash
# Python agent tests
uv run pytest

# Frontend tests (if available)
cd react-frontend
npm test
```

### Code Formatting

```bash
# Python formatting
uv run ruff format src/

# Frontend formatting
cd react-frontend
npm run format
```

### Custom Configuration

**Agent Customization:**
- Modify `src/prompts.py` to adjust therapist behavior
- Add new function tools in `src/agent.py`
- Configure different LLM/STT/TTS providers

**Frontend Customization:**
- Update `react-frontend/app-config.ts` for branding
- Modify tracking components in `components/`
- Adjust styling in `app/globals.css`

### Production Deployment

The project includes a `Dockerfile` for containerized deployment:

```bash
# Build container
docker build -t rest-lab-ai .

# Run container
docker run -p 8080:8080 --env-file .env.local rest-lab-ai
```

For LiveKit Cloud deployment, see the [deployment guide](https://docs.livekit.io/agents/ops/deployment/).

---

## 📞 Support

For technical issues:
- Check the [LiveKit Documentation](https://docs.livekit.io/)
- Join the [LiveKit Community Slack](https://livekit.io/join-slack)
- Review agent logs for error messages

For therapeutic concerns:
- This AI is not a replacement for professional medical care
- Contact your healthcare provider for medical questions
- In crisis situations, call 988 (Suicide & Crisis Lifeline) or emergency services

---

**Note**: This system is designed as a supportive tool between therapy sessions and should not replace professional medical care or crisis intervention services.
