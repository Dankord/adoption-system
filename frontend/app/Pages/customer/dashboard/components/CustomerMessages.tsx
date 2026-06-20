"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth, ConversationItem, Message } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { usePolling } from "@/lib/lib-polling";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Send,
  MessageCircle,
  ChevronLeft,
  Paperclip,
  MoreVertical,
  Search,
  PawPrint,
  Loader2,
} from "lucide-react";

export default function CustomerMessages() {
  const { user, getConversations, getMessages, sendMessage, getUnreadCount } =
    useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isOwnMessage = useCallback(
    (msg: Message) => msg.sender_id === user?.id,
    [user?.id]
  );

  const loadConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      if (activeConversation) {
        const updated = data.find((c) => c.id === activeConversation.id);
        if (updated) setActiveConversation(updated);
      }
    } catch {
      // silently fail
    }
  }, [getConversations, activeConversation]);

  usePolling(loadConversations, 5000, true);

  const loadMessages = useCallback(
    async (conversationId: number) => {
      setMessagesLoading(true);
      try {
        const data = await getMessages(conversationId);
        setMessages(data);
      } catch {
        // silently fail
      } finally {
        setMessagesLoading(false);
      }
    },
    [getMessages]
  );

  const selectConversation = (conv: ConversationItem) => {
    setActiveConversation(conv);
    loadMessages(conv.id);
    setIsMobileChatOpen(true);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;
    const text = messageInput.trim();
    setMessageInput("");
    try {
      await sendMessage(activeConversation.id, text);
      await loadMessages(activeConversation.id);
      await loadConversations();
    } catch (err) {
      setMessageInput(text);
      toast.error(getApiErrorMessage(err, "Failed to send message."));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getOtherPartyName = (conv: ConversationItem) => {
    if (user?.role === "customer") {
      return conv.owner?.customer_name || "Owner";
    }
    return conv.customer?.customer_name || "Customer";
  };

  const getOtherPartyId = (conv: ConversationItem) => {
    if (user?.role === "customer") {
      return conv.owner_id;
    }
    return conv.customer_id;
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherName = getOtherPartyName(conv);
    const petName = conv.pet?.name || "";
    const query = searchQuery.toLowerCase();
    return otherName.toLowerCase().includes(query) || petName.toLowerCase().includes(query);
  });

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        Messages
      </h2>

      <Card className="flex-1 overflow-hidden flex flex-col border-[#dabcac]/40">
        <CardContent className="p-0 flex-1 flex">
          {/* Sidebar */}
          <div
            className={`${isMobileChatOpen ? "hidden md:flex" : "flex"} flex-col w-full md:w-[380px] border-r border-[#dabcac]/30`}
          >
            <div className="p-4 border-b border-[#dabcac]/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6150]/40" size={16} />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 && !loading && (
                <div className="p-8 text-center text-[#7A6150]/50">
                  <MessageCircle className="mx-auto mb-3 opacity-30" size={40} />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Start a conversation about a pet</p>
                </div>
              )}

              {loading && (
                <div className="p-8 text-center">
                  <Loader2 className="mx-auto animate-spin text-[#C4622D]" size={24} />
                </div>
              )}

              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={`w-full text-left p-4 border-b border-[#dabcac]/10 hover:bg-[#EAD8C6]/20 transition-colors ${
                    activeConversation?.id === conv.id
                      ? "bg-[#EAD8C6]/40"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C4622D]/10 flex items-center justify-center flex-shrink-0">
                      <PawPrint className="text-[#C4622D]" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`font-medium text-sm truncate ${
                            activeConversation?.id === conv.id
                              ? "text-[#7A6150]"
                              : "text-[#7A6150]"
                          }`}
                        >
                          {getOtherPartyName(conv)}
                        </span>
                        <span className="text-xs text-[#7A6150]/40 flex-shrink-0">
                          {formatTime(conv.last_message_at)}
                        </span>
                      </div>
                      {conv.pet && (
                        <p className="text-xs text-[#7A6150]/50 truncate mt-0.5">
                          About: {conv.pet.name}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-[#7A6150]/50 truncate max-w-[200px]">
                          {conv.latestMessage?.body || "No messages yet"}
                        </p>
                        {conv.unread_count > 0 && (
                          <span className="ml-2 flex-shrink-0 bg-[#C4622D] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div
            className={`${isMobileChatOpen ? "flex" : "hidden md:flex"} flex-col flex-1`}
          >
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 p-4 border-b border-[#dabcac]/20 bg-white/50">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="md:hidden"
                    onClick={() => setIsMobileChatOpen(false)}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  <div className="w-9 h-9 rounded-full bg-[#C4622D]/10 flex items-center justify-center flex-shrink-0">
                    <PawPrint className="text-[#C4622D]" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {getOtherPartyName(activeConversation)}
                    </p>
                    {activeConversation.pet && (
                      <p className="text-xs text-[#7A6150]/50 truncate">
                        About: {activeConversation.pet.name}
                      </p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical size={16} className="text-[#7A6150]/40" />
                  </Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDF6EE]/50">
                  {messagesLoading && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-[#C4622D]" size={24} />
                    </div>
                  )}

                  {!messagesLoading && messages.length === 0 && (
                    <div className="text-center py-8 text-[#7A6150]/40">
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs mt-1">
                        Say hello to {getOtherPartyName(activeConversation)}!
                      </p>
                    </div>
                  )}

                  {messages.map((msg) => {
                    const own = isOwnMessage(msg);
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${own ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            own
                              ? "bg-[#C4622D] text-white rounded-br-sm"
                              : "bg-white text-[#7A6150] rounded-bl-sm shadow-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.body}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              own
                                ? "text-white/60"
                                : "text-[#7A6150]/40"
                            }`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-[#dabcac]/20 bg-white/50">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="flex-shrink-0 text-[#7A6150]/50"
                    >
                      <Paperclip size={18} />
                    </Button>
                    <Textarea
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 min-h-[42px] max-h-24 resize-none bg-white/70"
                      rows={1}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      size="icon-sm"
                      className="flex-shrink-0"
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#7A6150]/40">
                <div className="text-center">
                  <MessageCircle className="mx-auto mb-3 opacity-30" size={48} />
                  <p className="text-lg font-medium">Select a conversation</p>
                  <p className="text-sm mt-1">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
