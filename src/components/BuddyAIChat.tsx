import React, { useState } from 'react';
import { UserProfile, WorkoutRoutine } from '../types';
import { X, Send, Sparkles, Dumbbell, Zap, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';

interface BuddyAIChatProps {
  userProfile: UserProfile;
  activeRoutine: WorkoutRoutine;
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (actionType: string, payload?: any) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'buddy';
  text: string;
  actionCta?: {
    label: string;
    action: string;
  };
}

export const BuddyAIChat: React.FC<BuddyAIChatProps> = ({
  userProfile,
  activeRoutine,
  isOpen,
  onClose,
  onSelectAction
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'buddy',
      text: `Hey ${userProfile.name || 'friend'} 👋 I’m your GymBuddy AI. What can I help with for today's session?`
    }
  ]);
  const [inputText, setInputText] = useState('');

  const suggestedPrompts = [
    'What should I do today?',
    'How do I perform bench press?',
    'What weight should I start with?',
    'Can I replace an exercise?',
    'I’m feeling low on energy today'
  ];

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent, friendly, actionable response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: Message;

      if (lower.includes('low on energy') || lower.includes('tired') || lower.includes('fatigued')) {
        reply = {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: 'No problem at all. Let’s do our 20-Min Low-Friction Restart session—just a gentle warmup, 3 key lifts, and a relaxing stretch. Showing up is what counts.',
          actionCta: {
            label: 'Switch to 20-Min Restart Session →',
            action: 'switch-to-restart'
          }
        };
      } else if (lower.includes('replace') || lower.includes('swap') || lower.includes('instead of')) {
        reply = {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: 'You can swap the Barbell Bench Press for the Seated Chest Press Machine. It provides locked guided motion and removes shoulder balance stress for beginners.',
          actionCta: {
            label: 'Use Chest Press Machine →',
            action: 'swap-exercise'
          }
        };
      } else if (lower.includes('weight') || lower.includes('heavy') || lower.includes('how much')) {
        reply = {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: `For ${userProfile.goal.toLowerCase()}, choose a weight where reps 8, 9, and 10 feel challenging but your form stays pristine. For your body weight (${userProfile.weight} ${userProfile.weightUnit}), start with 35–40 kg on barbell or 12 kg dumbbells.`
        };
      } else if (lower.includes('what should i do') || lower.includes('today')) {
        reply = {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: `Today we have ${activeRoutine.title}. We’ll start with 3 joint-mobility warmups, complete ${activeRoutine.mainItems.length} core exercises, and wrap up with 3 recovery stretches (~${activeRoutine.estimatedMinutes} mins total).`,
          actionCta: {
            label: 'Start Today’s Routine →',
            action: 'start-routine'
          }
        };
      } else if (lower.includes('warmup') || lower.includes('stretch')) {
        reply = {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: 'Warmups and cool-down stretches are built right into your workout session! You don’t need to jump between separate tabs—just tap Start Workout and I will guide you through dynamic mobility before your first working set, and soothing stretches at the end.'
        };
      } else {
        reply = {
          id: `buddy-${Date.now()}`,
          sender: 'buddy',
          text: `Got it! Remember to keep your back supported, control each repetition over 2 full seconds, and breathe out on the push. I’m right here if you need another cue.`
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md mx-auto bg-[#131826] border-t border-[#2A2F3F] rounded-t-3xl flex flex-col h-[82vh] shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2F3F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#131826] border border-[#2A2F3F] flex items-center justify-center shadow-sm">
              <Logo size="xs" variant="icon" glow={true} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#FFFFFF]">Buddy AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
              </div>
              <span className="text-[10px] text-[#A1A8B8]">Your friendly gym companion</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#131826] border border-[#2A2F3F] text-[#A1A8B8] hover:text-[#FFFFFF] transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#8B5CF6] text-black font-semibold rounded-tr-sm shadow-md shadow-purple-500/20'
                    : 'bg-[#131826] border border-[#2A2F3F] text-[#FFFFFF] rounded-tl-sm'
                }`}
              >
                {m.text}
              </div>

              {/* Action CTA pill if provided by AI */}
              {m.actionCta && (
                <button
                  onClick={() => {
                    if (onSelectAction) {
                      onSelectAction(m.actionCta!.action);
                    }
                    onClose();
                  }}
                  className="mt-2 text-xs font-bold bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] hover:bg-[#8B5CF6]/25 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 btn-press"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{m.actionCta.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 border-t border-[#2A2F3F] overflow-x-auto no-scrollbar flex gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-[11px] font-medium whitespace-nowrap bg-[#131826] hover:bg-[#1E2438] border border-[#2A2F3F] text-[#A1A8B8] px-3 py-1.5 rounded-full transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-[#2A2F3F] bg-[#0B0D14]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Buddy anything (e.g. form, weights)..."
              className="flex-1 bg-[#131826] border border-[#2A2F3F] rounded-2xl px-4 py-3 text-xs text-[#FFFFFF] placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#8B5CF6] disabled:opacity-40 text-black transition-opacity btn-press shadow-md shadow-purple-500/20"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
