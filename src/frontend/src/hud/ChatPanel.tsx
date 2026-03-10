import { ScrollArea } from "@/components/ui/scroll-area";
import { backend } from "@/services/backendService";
import { useGameStore } from "@/store/gameStore";
import { MessageSquare, Send, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function ChatPanel() {
  const {
    chatMessages,
    chatTab,
    chatOpen,
    setChatTab,
    setChatOpen,
    setChatMessages,
  } = useGameStore();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMsgs = useCallback(async () => {
    try {
      const msgs = await backend.getGlobalChat();
      setChatMessages(msgs.slice(-20));
    } catch {}
  }, [setChatMessages]);

  useEffect(() => {
    fetchMsgs();
    const id = setInterval(fetchMsgs, 3000);
    return () => clearInterval(id);
  }, [fetchMsgs]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on length change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      if (chatTab === "global") {
        await backend.sendGlobalMessage(input.trim());
      }
      setInput("");
      const msgs = await backend.getGlobalChat();
      setChatMessages(msgs.slice(-20));
    } catch {
    } finally {
      setSending(false);
    }
  };

  if (!chatOpen) {
    return (
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="hud-panel p-3 flex items-center gap-2 hover:border-gold/50 transition-colors"
      >
        <MessageSquare className="w-4 h-4 text-gold" />
        <span className="text-xs font-display text-foreground/60">Chat</span>
      </button>
    );
  }

  return (
    <div className="hud-panel w-80">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30">
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="chat.global.tab"
            onClick={() => setChatTab("global")}
            className={`text-xs font-display px-2 py-1 rounded transition-colors ${
              chatTab === "global"
                ? "bg-gold/20 text-gold"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            Global
          </button>
          <button
            type="button"
            data-ocid="chat.island.tab"
            onClick={() => setChatTab("island")}
            className={`text-xs font-display px-2 py-1 rounded transition-colors ${
              chatTab === "island"
                ? "bg-gold/20 text-gold"
                : "text-foreground/50 hover:text-foreground/70"
            }`}
          >
            Island
          </button>
        </div>
        <button
          type="button"
          onClick={() => setChatOpen(false)}
          className="text-foreground/40 hover:text-foreground/80"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      <ScrollArea className="h-36">
        <div className="p-2 space-y-1">
          {chatMessages.length === 0 ? (
            <p className="text-foreground/30 text-xs text-center py-4">
              No messages yet
            </p>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={`${msg.sender.toString()}-${msg.timestamp.toString()}`}
                className="text-xs"
              >
                <span className="text-gold/70 font-display">
                  Pirate #{msg.sender.toString().slice(0, 4)}:{" "}
                </span>
                <span className="text-foreground/80">{msg.content}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2 p-2 border-t border-border/30">
        <input
          data-ocid="chat.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Say something..."
          className="flex-1 bg-background/50 border border-border/30 rounded px-2 py-1 text-xs text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50"
        />
        <button
          type="button"
          data-ocid="chat.send_button"
          onClick={send}
          disabled={sending || !input.trim()}
          className="p-1.5 rounded bg-gold/20 border border-gold/30 hover:bg-gold/30 transition-colors disabled:opacity-40"
        >
          <Send className="w-3 h-3 text-gold" />
        </button>
      </div>
    </div>
  );
}
