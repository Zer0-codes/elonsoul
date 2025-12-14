"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ElonAvatar } from "@/components/elon-avatar"
import { MessageList } from "@/components/message-list"
import { cn } from "@/lib/utils"
import type SpeechRecognition from "SpeechRecognition"

export type SoulMood = "curious" | "excited" | "thoughtful" | "confident" | "playful" | "neutral"

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export function ElonChat() {
  const [inputValue, setInputValue] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [soulMood, setSoulMood] = useState<SoulMood>("neutral")
  const [isLoadingVoice, setIsLoadingVoice] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const [spokenMessageIds, setSpokenMessageIds] = useState<Set<string>>(new Set())

  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typewriterRef = useRef<NodeJS.Timeout | null>(null)
  const voiceEnabledRef = useRef(voiceEnabled)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "in_progress"

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled
  }, [voiceEnabled])

  const analyzeMood = (text: string): SoulMood => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes("mars") || lowerText.includes("space") || lowerText.includes("rocket")) return "excited"
    if (lowerText.includes("think") || lowerText.includes("believe") || lowerText.includes("future"))
      return "thoughtful"
    if (lowerText.includes("obviously") || lowerText.includes("definitely") || lowerText.includes("will"))
      return "confident"
    if (lowerText.includes("?") || lowerText.includes("interesting")) return "curious"
    if (lowerText.includes("haha") || lowerText.includes("joke") || lowerText.includes("fun")) return "playful"
    return "neutral"
  }

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel()
    }
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current)
      typewriterRef.current = null
    }
  }, [])

  const startTypewriter = useCallback((text: string, durationMs: number) => {
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current)
    }
    setDisplayedText("")
    setIsTyping(true)
    const chars = text.split("")
    const intervalMs = Math.max(durationMs / chars.length, 30)
    let currentIndex = 0
    typewriterRef.current = setInterval(() => {
      if (currentIndex < chars.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        if (typewriterRef.current) {
          clearInterval(typewriterRef.current)
          typewriterRef.current = null
        }
        setIsTyping(false)
      }
    }, intervalMs)
  }, [])

  const finishSpeaking = useCallback((text: string) => {
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current)
      typewriterRef.current = null
    }
    setDisplayedText(text)
    setIsTyping(false)
    setIsSpeaking(false)
    setIsLoadingVoice(false)
    setCurrentSpeakingId(null)
  }, [])

  const fallbackBrowserTTS = useCallback(
    (text: string) => {
      if (typeof window === "undefined") {
        finishSpeaking(text)
        return
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 0.85
      utterance.volume = 1
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.toLowerCase().includes("male") ||
            v.name.includes("David") ||
            v.name.includes("Daniel") ||
            v.name.includes("James")),
      )
      if (preferredVoice) utterance.voice = preferredVoice
      const estimatedDuration = text.length * 80
      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsLoadingVoice(false)
        startTypewriter(text, estimatedDuration)
      }
      utterance.onend = () => finishSpeaking(text)
      utterance.onerror = () => finishSpeaking(text)
      window.speechSynthesis.speak(utterance)
    },
    [startTypewriter, finishSpeaking],
  )

  const speakMessage = useCallback(
    async (text: string, messageId: string) => {
      if (!voiceEnabledRef.current || typeof window === "undefined") {
        setDisplayedText(text)
        return
      }
      stopAllAudio()
      setIsLoadingVoice(true)
      setCurrentSpeakingId(messageId)
      setDisplayedText("")
      setIsTyping(false)
      try {
        const response = await fetch("/api/text-to-speech", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        })
        if (!voiceEnabledRef.current) {
          setDisplayedText(text)
          setIsLoadingVoice(false)
          setCurrentSpeakingId(null)
          return
        }
        if (response.headers.get("Content-Type")?.includes("audio")) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audioRef.current = audio
          audio.onloadedmetadata = () => {
            const duration = (audio.duration || 5) * 1000
            setIsLoadingVoice(false)
            setIsSpeaking(true)
            startTypewriter(text, duration)
          }
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl)
            finishSpeaking(text)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl)
            setIsLoadingVoice(false)
            fallbackBrowserTTS(text)
          }
          await audio.play()
        } else {
          setIsLoadingVoice(false)
          fallbackBrowserTTS(text)
        }
      } catch (error) {
        console.error("tts error:", error)
        setIsLoadingVoice(false)
        fallbackBrowserTTS(text)
      }
    },
    [stopAllAudio, startTypewriter, finishSpeaking, fallbackBrowserTTS],
  )

  useEffect(() => {
    if (status !== "ready" || messages.length === 0) return
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== "assistant") return
    if (spokenMessageIds.has(lastMessage.id)) return
    const textContent = lastMessage.parts
      ?.filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join(" ")
    if (!textContent) return
    setSpokenMessageIds((prev) => new Set(prev).add(lastMessage.id))
    setSoulMood(analyzeMood(textContent))
    speakMessage(textContent, lastMessage.id)
  }, [status, messages, spokenMessageIds, speakMessage])

  useEffect(() => {
    return () => {
      stopAllAudio()
    }
  }, [stopAllAudio])

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
      }
      recognitionRef.current.onerror = () => setIsListening(false)
      recognitionRef.current.onend = () => setIsListening(false)
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopAllAudio()
      setIsSpeaking(false)
      setIsLoadingVoice(false)
      setIsTyping(false)
      if (currentSpeakingId) {
        const msg = messages.find((m) => m.id === currentSpeakingId)
        if (msg) {
          const text = msg.parts
            ?.filter((p) => p.type === "text")
            .map((p) => (p as { type: "text"; text: string }).text)
            .join(" ")
          if (text) setDisplayedText(text)
        }
        setCurrentSpeakingId(null)
      }
    }
    setVoiceEnabled(!voiceEnabled)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    setSoulMood("curious")
    setDisplayedText("")
    setCurrentSpeakingId(null)
    sendMessage({ text: inputValue })
    setInputValue("")
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <header className="flex items-center justify-between px-4 py-5 md:px-6 md:py-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-xl font-medium tracking-tight text-foreground">elonsoul</h1>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 py-1 rounded border border-border">
            ai
          </span>
        </div>

        <div className="flex items-center gap-1">
          <a
            href="https://x.com/i/communities/2000112914284298515"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="join x community"
          >
            <XIcon className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/Zer0-codes/elonsoul"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            aria-label="view on github"
          >
            <GitHubIcon className="w-4 h-4" />
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoice}
            className="text-muted-foreground hover:text-foreground h-9 w-9"
          >
            {isLoadingVoice ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : voiceEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="sr-only">{voiceEnabled ? "disable voice" : "enable voice"}</span>
          </Button>
        </div>
      </header>

      <div className="flex justify-center py-6 md:py-10">
        <ElonAvatar isSpeaking={isSpeaking} isThinking={isLoading || isLoadingVoice} mood={soulMood} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          displayedText={displayedText}
          isTyping={isTyping}
          currentSpeakingId={currentSpeakingId}
          isLoadingVoice={isLoadingVoice}
          spokenMessageIds={spokenMessageIds}
          onSuggestionClick={(text) => {
            setInputValue(text)
            inputRef.current?.focus()
          }}
        />
      </div>

      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="ask anything..."
              disabled={isLoading}
              className={cn(
                "w-full px-4 py-3 bg-card border border-border rounded-lg",
                "text-foreground placeholder:text-muted-foreground text-sm",
                "focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200",
              )}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            disabled={isLoading}
            className={cn(
              "h-11 w-11 rounded-lg text-muted-foreground hover:text-foreground",
              isListening && "bg-accent/20 text-accent",
            )}
          >
            {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
            <span className="sr-only">{isListening ? "stop listening" : "start voice input"}</span>
          </Button>

          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="h-11 w-11 rounded-lg bg-foreground text-background hover:bg-foreground/90"
          >
            <Send className="w-4 h-4" />
            <span className="sr-only">send message</span>
          </Button>
        </form>

        <p className="mt-3 text-center text-[11px] text-muted-foreground tracking-wide">
          {isLoadingVoice
            ? "generating voice..."
            : isSpeaking
              ? "speaking"
              : isListening
                ? "listening..."
                : "voice synthesis by elevenlabs"}
        </p>
      </div>
    </div>
  )
}
