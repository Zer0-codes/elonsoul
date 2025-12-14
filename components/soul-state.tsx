"use client"

import { cn } from "@/lib/utils"
import type { SoulMood } from "@/components/elon-chat"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SoulStateProps {
  mood: SoulMood
  isThinking: boolean
  messageCount: number
}

const moodConfig: Record<SoulMood, { color: string; label: string; icon: string }> = {
  curious: { color: "bg-blue-500", label: "Curious", icon: "?" },
  excited: { color: "bg-orange-500", label: "Excited", icon: "!" },
  thoughtful: { color: "bg-purple-500", label: "Thoughtful", icon: "~" },
  confident: { color: "bg-green-500", label: "Confident", icon: "+" },
  playful: { color: "bg-pink-500", label: "Playful", icon: "*" },
  neutral: { color: "bg-cyan-500", label: "Ready", icon: "○" },
}

export function SoulState({ mood, isThinking, messageCount }: SoulStateProps) {
  const config = moodConfig[mood]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border cursor-default">
            {/* Soul indicator */}
            <div className="relative">
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-colors duration-300",
                  isThinking ? "bg-amber-500 animate-pulse" : config.color,
                )}
              />
              {isThinking && (
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-75" />
              )}
            </div>

            {/* Status text */}
            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">
              {isThinking ? "Processing" : config.label}
            </span>

            {/* Memory indicator */}
            <div className="flex items-center gap-1 pl-2 border-l border-border">
              <svg viewBox="0 0 16 16" className="w-3 h-3 text-muted-foreground" fill="currentColor">
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
                <circle cx="8" cy="8" r="2" />
              </svg>
              <span className="text-xs text-muted-foreground tabular-nums">{messageCount}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1.5">
            <p className="font-medium text-sm">Soul State</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Mood: {config.label}</p>
              <p>Memory: {messageCount} interactions</p>
              <p className="text-[10px] opacity-70">ElonSoul Engine</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
