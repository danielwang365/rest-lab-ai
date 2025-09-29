# Simple AI Therapist Frontend with Tracking

A clean React/Next.js interface for voice conversations with your AI therapist, featuring real-time tracking visualizations.

## What's Different from the Original Template

This is based on the official LiveKit React template with these enhancements:

### ✅ **Added Components:**
- **`AnalyticsDashboard`** - Main dashboard showing real-time health metrics
- **Tracking Types** - TypeScript definitions for pain/sleep/mood data
- **Real-time Data Listening** - Receives updates from your Python agent

### 📊 **Tracking Features:**

**Pain Assessment:**
- Pain level (1-10)
- Location and quality
- Triggers and coping strategies

**Sleep Quality:**
- Sleep rating (1-10)
- Hours slept, wake-ups
- Affecting factors

**Mood Assessment:**
- Mood and energy levels (1-10)
- Daily activity completion
- Social engagement and coping strategies

## How It Works

1. **Voice Conversation**: Use the standard LiveKit voice interface
2. **Agent Processing**: Your Python agent processes the conversation
3. **Function Calls**: When you mention pain/sleep/mood, the agent calls tracking functions
4. **Real-time Updates**: The tracking panel instantly shows new data
5. **Local Storage**: All data is saved in your browser

## Interface Layout

```
┌─────────────────────────────────────┐
│         LiveKit Voice Chat          │
│        (Original Template)          │
│                                     │
│                                     │
│                                     │
└─────────────────────────────────────┘
                                    ┌─┐
                              ┌─────┤📊├─────┐
                              │ Pain: 6/10   │
                              │ Sleep: 7/10  │  <- Tracking Panel
                              │ Mood: 5/10   │     (Floating)
                              │ [mini chart] │
                              └──────────────┘
```

## Development

The tracking panel appears when:
- A therapy session is active
- Shows current values and mini trends
- Updates in real-time when agent calls tracking functions
- Persists data between sessions

## Files Modified/Added

- `components/analytics-dashboard.tsx` - Main tracking visualization
- `lib/tracking-types.ts` - TypeScript definitions  
- `components/app.tsx` - Added tracking panel integration
- `next.config.ts` - Relaxed linting for development

Original LiveKit template functionality remains unchanged!
