'use client';

import { useEffect, useState } from 'react';
import { Room } from 'livekit-client';
import { useVoiceAssistant, BarVisualizer } from '@livekit/components-react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface VoiceBarProps {
  room: Room | null;
  sessionStarted: boolean;
  onStartSession: () => void;
}

export function VoiceBar({ room, sessionStarted, onStartSession }: VoiceBarProps) {
  const { state, audioTrack } = useVoiceAssistant();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (room) {
      const handleConnected = () => setIsConnected(true);
      const handleDisconnected = () => setIsConnected(false);
      
      room.on('connected', handleConnected);
      room.on('disconnected', handleDisconnected);
      
      setIsConnected(room.state === 'connected');
      
      return () => {
        room.off('connected', handleConnected);
        room.off('disconnected', handleDisconnected);
      };
    }
  }, [room]);

  const getStatusText = () => {
    if (!sessionStarted) return 'Ready to start therapy session';
    if (!isConnected) return 'Connecting...';
    
    switch (state) {
      case 'listening':
        return 'Listening to you...';
      case 'speaking':
        return 'AI therapist is responding...';
      case 'thinking':
        return 'Processing your message...';
      default:
        return 'Ready to listen';
    }
  };

  const getStatusColor = () => {
    if (!sessionStarted || !isConnected) return 'text-gray-500';
    
    switch (state) {
      case 'listening':
        return 'text-red-500';
      case 'speaking':
        return 'text-blue-500';
      case 'thinking':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getMicIcon = () => {
    if (!sessionStarted || !isConnected) return Mic;
    return state === 'listening' ? Mic : MicOff;
  };

  const MicIcon = getMicIcon();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Therapy Session Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">AI Therapy Session</h1>
                <p className="text-xs text-gray-500">Chronic Pain & Sleep Support</p>
              </div>
            </div>
          </div>

          {/* Center: Voice Controls & Status */}
          <div className="flex items-center space-x-4">
            
            {/* Mic Button */}
            <button
              onClick={() => {
                console.log('Mic button clicked!', { sessionStarted, isConnected, state });
                onStartSession();
              }}
              disabled={false}
              className={`
                relative p-3 rounded-full transition-all duration-200 cursor-pointer
                ${!sessionStarted 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl' 
                  : state === 'listening'
                  ? 'bg-red-500 text-white animate-pulse shadow-lg'
                  : state === 'speaking'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 shadow hover:bg-gray-200'
                }
              `}
            >
              <MicIcon className="w-5 h-5" />
              
              {/* Pulse animation for listening */}
              {state === 'listening' && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
              )}
            </button>

            {/* Voice Visualizer */}
            {sessionStarted && audioTrack && (
              <div className="w-32 h-8">
                <BarVisualizer
                  state={state}
                  barCount={8}
                  trackRef={audioTrack}
                  className="w-full h-full"
                />
              </div>
            )}

            {/* Status Text */}
            <div className="text-center min-w-48">
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </p>
              {sessionStarted && (
                <p className="text-xs text-gray-400">
                  {isConnected ? 'Connected' : 'Connecting...'}
                </p>
              )}
            </div>
          </div>

          {/* Right: Session Controls */}
          <div className="flex items-center space-x-2">
            {sessionStarted && (
              <>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-xs text-gray-500">
                    {isConnected ? 'Live' : 'Connecting'}
                  </span>
                </div>
              </>
            )}
            
            {!sessionStarted && (
              <button
                onClick={() => {
                  console.log('Start Session button clicked!');
                  onStartSession();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
              >
                Start Session
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
