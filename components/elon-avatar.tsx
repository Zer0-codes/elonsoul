"use client"

import { cn } from "@/lib/utils"
import type { SoulMood } from "@/components/elon-chat"

interface ElonAvatarProps {
  isSpeaking: boolean
  isThinking: boolean
  mood?: SoulMood
}

const moodGlowColors: Record<SoulMood, string> = {
  curious: "from-blue-500/20 via-blue-400/30 to-blue-500/20",
  excited: "from-orange-500/20 via-orange-400/30 to-orange-500/20",
  thoughtful: "from-purple-500/20 via-purple-400/30 to-purple-500/20",
  confident: "from-green-500/20 via-green-400/30 to-green-500/20",
  playful: "from-pink-500/20 via-pink-400/30 to-pink-500/20",
  neutral: "from-primary/20 via-primary/30 to-primary/20",
}

const moodBorderColors: Record<SoulMood, string> = {
  curious: "border-blue-500/50",
  excited: "border-orange-500/50",
  thoughtful: "border-purple-500/50",
  confident: "border-green-500/50",
  playful: "border-pink-500/50",
  neutral: "border-primary/50",
}

export function ElonAvatar({ isSpeaking, isThinking, mood = "neutral" }: ElonAvatarProps) {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className={cn(
          "absolute inset-0 -m-3 rounded-full border border-border/50 transition-all duration-700",
          (isSpeaking || isThinking) && "border-foreground/20",
        )}
      />

      <div
        className={cn(
          "absolute inset-0 -m-6 rounded-full border border-border/30 transition-all duration-1000",
          isSpeaking && "border-foreground/10 animate-subtle-pulse",
        )}
      />

      <div
        className={cn(
          "relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden",
          "border border-border bg-card",
          "transition-all duration-500",
          isSpeaking && "speaking-glow",
        )}
      >
        <img
          src="/elon-musk-portrait-professional-headshot.jpg"
          alt="Elon AI"
          className="object-cover w-full h-full grayscale-[20%]"
        />

        {isSpeaking && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 bg-gradient-to-t from-background/90 via-background/40 to-transparent">
            <div className="flex items-end gap-[3px] h-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-foreground/80 rounded-full sound-bar"
                  style={{
                    height: "100%",
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {isThinking && !isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {isSpeaking ? "Speaking" : isThinking ? "Thinking" : "Ready"}
        </p>
      </div>
    </div>
  )
}
