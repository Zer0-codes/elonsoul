"use client"

import { useEffect, useRef } from "react"
import type { UIMessage } from "ai"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
  displayedText: string
  isTyping: boolean
  currentSpeakingId: string | null
  isLoadingVoice: boolean
  spokenMessageIds: Set<string>
  onSuggestionClick?: (text: string) => void
}

export function MessageList({
  messages,
  isLoading,
  displayedText,
  isTyping,
  currentSpeakingId,
  isLoadingVoice,
  spokenMessageIds,
  onSuggestionClick,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, displayedText])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <p className="text-sm text-muted-foreground mb-8 max-w-xs leading-relaxed">
          Start a conversation about SpaceX, Tesla, AI, or the future of humanity.
        </p>

        <div className="flex flex-col gap-2 w-full max-w-sm">
          {["What's next for SpaceX?", "Thoughts on AI safety?", "Future of electric vehicles?"].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSuggestionClick?.(suggestion)}
              className={cn(
                "flex items-center justify-between px-4 py-3 text-left text-sm",
                "bg-card border border-border rounded-lg",
                "text-foreground/80 hover:text-foreground",
                "hover:border-foreground/20 transition-all duration-200",
                "group",
              )}
            >
              <span>{suggestion}</span>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 py-4">
      {messages.map((message) => {
        const isUser = message.role === "user"
        const fullTextContent = message.parts
          ?.filter((p) => p.type === "text")
          .map((p) => (p as { type: "text"; text: string }).text)
          .join(" ")

        const isCurrentlySpeaking = message.id === currentSpeakingId
        const hasBeenSpoken = spokenMessageIds.has(message.id)

        let textToShow: string | undefined
        if (isUser) {
          textToShow = fullTextContent
        } else if (isCurrentlySpeaking) {
          textToShow = displayedText
        } else if (hasBeenSpoken) {
          textToShow = fullTextContent
        } else {
          textToShow = fullTextContent
        }

        const showLoadingState = !isUser && isCurrentlySpeaking && isLoadingVoice && !textToShow

        return (
          <div key={message.id} className={cn("animate-fade-in-up", isUser ? "text-right" : "text-left")}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">
              {isUser ? "You" : "Elon"}
            </p>

            <div
              className={cn(
                "inline-block max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed",
                isUser ? "bg-foreground text-background" : "bg-card border border-border text-foreground",
              )}
            >
              {showLoadingState ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">
                  {textToShow}
                  {!isUser && isCurrentlySpeaking && isTyping && (
                    <span className="inline-block w-[2px] h-4 ml-0.5 bg-foreground/60 animate-pulse" />
                  )}
                </p>
              )}
            </div>
          </div>
        )
      })}

      {isLoading && !isLoadingVoice && (
        <div className="animate-fade-in-up text-left">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Elon</p>
          <div className="inline-block px-4 py-3 rounded-lg bg-card border border-border">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
